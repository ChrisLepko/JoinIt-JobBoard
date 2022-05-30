package com.joinit.controller;

import com.joinit.dao.ApplicantsDao;
import com.joinit.model.Applicants;
import com.microsoft.azure.storage.CloudStorageAccount;
import com.microsoft.azure.storage.blob.CloudBlobClient;
import com.microsoft.azure.storage.blob.CloudBlobContainer;
import com.microsoft.azure.storage.blob.CloudBlockBlob;
import com.microsoft.azure.storage.blob.ContainerURL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.WritableResource;
import org.springframework.data.repository.query.Param;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.Charset;

@RestController
@CrossOrigin
@RequestMapping("managepdf")
public class BlobController {


    @Autowired
    private ApplicantsDao applicantsDao;

    @Value("DefaultEndpointsProtocol=https;AccountName=joinitstoragetest;AccountKey=pfRQO6sXIqdBEY++tJ/Xt1FJh7zQ36J52u9j+e8nttfL39i/Ji0y30VClWF35QtWPk48QJTlqC71qVKM6WnL8A==;EndpointSuffix=core.windows.net")
    private String connectionString;

    @GetMapping("/readPdfFile")
    public byte[] readBlobFile(@Param("pdfName") String pdfName) throws IOException {
        try {

            CloudStorageAccount account = CloudStorageAccount.parse(this.connectionString);
            CloudBlobClient cloudBlobClient = account.createCloudBlobClient();
            CloudBlobContainer cloudBlobContainer = cloudBlobClient.getContainerReference("joinitcontainer");
            CloudBlockBlob cloudBlockBlob = cloudBlobContainer.getBlockBlobReference(pdfName + " - cv.pdf");

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            cloudBlockBlob.download(outputStream);

            byte[] byteArray =  outputStream.toByteArray();

            outputStream.close();

            return byteArray;
        }
        catch(Exception ex) {
            throw new RuntimeException();
        }
    }

    @PostMapping("uploadPdf")
    public String uploadBlob(@Param("pdfName") String pdfName, @Param("companyEmail") String companyEmail, @Param("nameSurname") String nameSurname, @RequestParam("pdfFile") MultipartFile pdf) throws IOException {

        try{
            CloudStorageAccount account = CloudStorageAccount.parse(this.connectionString);
            CloudBlobClient cloudBlobClient = account.createCloudBlobClient();
            CloudBlobContainer cloudBlobContainer = cloudBlobClient.getContainerReference("joinitcontainer");
            CloudBlockBlob cloudBlockBlob = cloudBlobContainer.getBlockBlobReference(pdfName + " - cv.pdf");
            cloudBlockBlob.uploadFromByteArray(pdf.getBytes(), 0, (int) pdf.getSize());

            System.out.println(companyEmail);

            Applicants applicants = new Applicants(companyEmail, pdfName, nameSurname);

            applicantsDao.save(applicants);

        }

        catch (Exception ex){
            System.out.println(ex.getMessage());
        }

        return "File was uploaded";
    }
}
