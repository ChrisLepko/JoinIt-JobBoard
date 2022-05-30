package com.joinit.mailsender;

import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessagePreparator;

import javax.mail.internet.MimeMessage;
import java.io.InputStream;

public interface EmailService extends JavaMailSender {

    @Override
    default MimeMessage createMimeMessage() {
        return null;
    }

    @Override
    default MimeMessage createMimeMessage(InputStream inputStream) throws MailException {
        return null;
    }

    @Override
    default void send(MimeMessage mimeMessage) throws MailException {

    }

    @Override
    default void send(MimeMessage... mimeMessages) throws MailException {

    }

    @Override
    default void send(MimeMessagePreparator mimeMessagePreparator) throws MailException {

    }

    @Override
    default void send(MimeMessagePreparator... mimeMessagePreparators) throws MailException {

    }

    @Override
    default void send(SimpleMailMessage simpleMailMessage) throws MailException {

    }

    @Override
    default void send(SimpleMailMessage... simpleMailMessages) throws MailException {

    }
}
