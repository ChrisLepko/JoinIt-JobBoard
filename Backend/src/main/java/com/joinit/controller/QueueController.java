package com.joinit.controller;

import com.azure.storage.queue.QueueClient;
import com.azure.storage.queue.QueueClientBuilder;
import com.azure.storage.queue.models.QueueMessageItem;
import com.azure.storage.queue.models.QueueStorageException;
import com.microsoft.azure.storage.CloudStorageAccount;
import com.microsoft.azure.storage.queue.CloudQueue;
import com.microsoft.azure.storage.queue.CloudQueueClient;
import com.microsoft.azure.storage.queue.CloudQueueMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;


@RestController
@CrossOrigin
@RequestMapping("managequeues")
public class QueueController {

    @Value("DefaultEndpointsProtocol=https;AccountName=jointitstorage;AccountKey=ahgm285mIqNX9NRjQWLUNPNM3WhTtjGboydpY5QTr8uR+T4RksEVrqNn2VdpoBuaSar6PKU6JQNr+AStCuhikw==;EndpointSuffix=core.windows.net")
    private String connectionString;


    @PostMapping("/addMessage")
    public String addMessageToQueue(@Param("companyName") String companyName, @Param("comment") String comment){

        try
        {

            CloudStorageAccount storageAccount =
                    CloudStorageAccount.parse(this.connectionString);

            CloudQueueClient queueClient = storageAccount.createCloudQueueClient();

            CloudQueue queue = queueClient.getQueueReference(companyName.toLowerCase());

            queue.createIfNotExists();

            CloudQueueMessage message = new CloudQueueMessage(comment);
            queue.addMessage(message);
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }

        return "Dodano wiadomość do kolejki";
    }

    @GetMapping("getQueueComment")
    private String getQueueComment(@Param("companyName") String companyName){
        try
        {
            // Instantiate a QueueClient which will be
            // used to create and manipulate the queue
            QueueClient queueClient = new QueueClientBuilder()
                    .connectionString(connectionString)
                    .queueName(companyName.toLowerCase())
                    .buildClient();

            // Peek at the first message
            QueueMessageItem queueMessageItem = queueClient.receiveMessage();

            if(queueMessageItem != null){
                byte[] decoded = Base64.getDecoder().decode(queueMessageItem.getBody().toString());

                queueClient.deleteMessage(queueMessageItem.getMessageId(), queueMessageItem.getPopReceipt());

                return new String(decoded);
            }
            return "No more comments";
        }
        catch (QueueStorageException e)
        {
            // Output the exception message and stack trace
            System.out.println(e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}
