package com.joinit.controller;

import com.azure.messaging.servicebus.*;
import com.joinit.mailsender.EmailServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.MessagingException;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

@RestController
@CrossOrigin
@RequestMapping(path = "/email")
public class MailSenderController {

    @Autowired
    private EmailServiceImpl emailService;

    @Value("Endpoint=sb://joinittest.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=b9Ii+A5nPXm/FcQN5hX5cYH5VuCVX+zQfxCbaB4swGA=")
    private String connectionString;

    @Value("queue-joinit")
    private String queueName;

    @PostMapping(path = "/send")
    public void sendEmailPDF(@Param("to") String to, @Param("appliedEmail") String appliedEmail, @Param("firsAndLastName") String firsAndLastName,
                             @Param("introduction") String introduction, @Param("companyName") String companyName,
                             @Param("localization") String localization, @Param("positionName") String positionName,
                             @RequestParam("pdfFile") MultipartFile pdf) throws IOException, MessagingException, InterruptedException {

        sendMessageBatch(to, appliedEmail, firsAndLastName, introduction, companyName, localization, positionName, pdf);

    }

    @GetMapping("/getMessage")
    public String receiveMessages() throws InterruptedException {
        CountDownLatch countdownLatch = new CountDownLatch(1);

        // Create an instance of the processor through the ServiceBusClientBuilder
        ServiceBusProcessorClient processorClient = new ServiceBusClientBuilder()
                .connectionString(connectionString)
                .processor()
                .queueName(queueName)
                .processMessage(MailSenderController::processMessage)
                .processError(context -> processError(context, countdownLatch))
                .buildProcessorClient();

        System.out.println("Starting the processor");
        processorClient.start();

        TimeUnit.SECONDS.sleep(10);
        System.out.println("Stopping and closing the processor");
        processorClient.close();

        return "Wysłano wiadomości";
    }

    private void sendMessageBatch(String to, String appliedEmail, String firsAndLastName, String introduction,
                                  String companyName, String localization, String positionName, MultipartFile pdf) throws IOException, MessagingException {
        // create a Service Bus Sender client for the queue
        ServiceBusSenderClient senderClient = new ServiceBusClientBuilder()
                .connectionString(connectionString)
                .sender()
                .queueName(queueName)
                .buildClient();

        // Creates an ServiceBusMessageBatch where the ServiceBus.
        ServiceBusMessageBatch messageBatch = senderClient.createMessageBatch();

        // create a list of messages
        List<ServiceBusMessage> listOfMessages = createMessages(firsAndLastName, introduction, companyName, localization, positionName);

        // We try to add as many messages as a batch can fit based on the maximum size and send to Service Bus when
        // the batch can hold no more messages. Create a new batch for next set of messages and repeat until all
        // messages are sent.
        for (ServiceBusMessage message : listOfMessages) {
            if (messageBatch.tryAddMessage(message)) {
                continue;
            }

            // The batch is full, so we create a new batch and send the batch.
            senderClient.sendMessages(messageBatch);
            System.out.println("Sent a batch of messages to the queue: " + queueName);

            // create a new batch
            messageBatch = senderClient.createMessageBatch();

            // Add that message that we couldn't before.
            if (!messageBatch.tryAddMessage(message)) {
                System.err.printf("Message is too large for an empty batch. Skipping. Max size: %s.", messageBatch.getMaxSizeInBytes());
            }
        }

        if (messageBatch.getCount() > 0) {
            senderClient.sendMessages(messageBatch);
            System.out.println("Sent a batch of messages to the queue: " + queueName);
        }

        Path currentRelativePath = Paths.get("");
        String workingDirectory = currentRelativePath.toAbsolutePath().toString();

        //String filePath = "D:\\Projects\\JoinIt\\PDF\\cv.pdf";
        String filePath = workingDirectory + "\\cv.pdf";

        try (FileOutputStream stream = new FileOutputStream(filePath)) {
            stream.write(pdf.getBytes());
        }

        emailService.sendMessageWithAttachment(to, firsAndLastName + " applied for " + positionName, listOfMessages.get(0).getBody().toString(), filePath);

        emailService.sendMessageWithAttachment(appliedEmail, "You applied for " + positionName, listOfMessages.get(1).getBody().toString(), filePath);

        Path path = Paths.get(filePath);
        Files.delete(path);

        //close the client
        senderClient.close();
    }

    private List<ServiceBusMessage> createMessages(String firsAndLastName, String introduction,
                                                   String companyName, String localization, String positionName){

        ServiceBusMessage[] messages = {
                new ServiceBusMessage("Hello, "+ "\n\n" + firsAndLastName +
                        " have just applied for " + positionName +" in your company through our JoinIt website." + "\n\n" +
                        "You can find his/her CV in attachment." + "\n\n" +
                        "Below you can find candidate's introduction." + "\n\n" +
                        firsAndLastName + " introduction:" + "\n" + introduction + "\n\n" +
                        "Thank you for using our website!" + "\n\n" +
                        "Best Regards," + "\n" + "JoinIt Team"),
                new ServiceBusMessage("Hi " + firsAndLastName + "," +
                        "\n\n" + "You've just applied for " + positionName + " in " + localization + " on JoinIt to " + companyName
                        + "\n\n" + "We keep our fingers crossed for you!" + "\n\n" + "Best Regards," + "\n" + "JoinIt Team")
        };
        return Arrays.asList(messages);
    }

    private static void processMessage(ServiceBusReceivedMessageContext context) {
        ServiceBusReceivedMessage message = context.getMessage();
        System.out.printf("Processing message. Session: %s, Sequence #: %s. Contents: %s%n", message.getMessageId(),
                message.getSequenceNumber(), message.getBody());

    }

    private static void processError(ServiceBusErrorContext context, CountDownLatch countdownLatch) {
        System.out.printf("Error when receiving messages from namespace: '%s'. Entity: '%s'%n",
                context.getFullyQualifiedNamespace(), context.getEntityPath());

        if (!(context.getException() instanceof ServiceBusException)) {
            System.out.printf("Non-ServiceBusException occurred: %s%n", context.getException());
            return;
        }

        ServiceBusException exception = (ServiceBusException) context.getException();
        ServiceBusFailureReason reason = exception.getReason();

        if (reason == ServiceBusFailureReason.MESSAGING_ENTITY_DISABLED
                || reason == ServiceBusFailureReason.MESSAGING_ENTITY_NOT_FOUND
                || reason == ServiceBusFailureReason.UNAUTHORIZED) {
            System.out.printf("An unrecoverable error occurred. Stopping processing with reason %s: %s%n",
                    reason, exception.getMessage());

            countdownLatch.countDown();
        } else if (reason == ServiceBusFailureReason.MESSAGE_LOCK_LOST) {
            System.out.printf("Message lock lost for message: %s%n", context.getException());
        } else if (reason == ServiceBusFailureReason.SERVICE_BUSY) {
            try {
                // Choosing an arbitrary amount of time to wait until trying again.
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                System.err.println("Unable to sleep for period of time");
            }
        } else {
            System.out.printf("Error source %s, reason %s, message: %s%n", context.getErrorSource(),
                    reason, context.getException());
        }
    }
}