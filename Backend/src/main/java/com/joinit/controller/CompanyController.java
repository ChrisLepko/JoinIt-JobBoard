package com.joinit.controller;

import com.joinit.dao.CompanyDao;
import com.joinit.model.Company;
import com.joinit.model.CompanyUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@CrossOrigin
@RequestMapping(path = "/company")
public class CompanyController {

    @Autowired
    private CompanyDao companyDao;

    @PostMapping("/create")
    public Company createCompanyUser(@RequestBody Company company){
        return companyDao.save(company);
    }

    @PostMapping("/authenticate")
    public Company authenticate(@RequestBody CompanyUser companyUser){
        return companyDao.findByEmailAndPassword(companyUser.getEmail(), companyUser.getPassword());
    }

    @GetMapping("/{email}")
    public Company getUserByEmail(@PathVariable String email){
        return companyDao.findFirstByEmail(email);
    }

    @PutMapping("/{email}")
    public Company updateCompany(@PathVariable String email, @RequestBody Company company){
        return companyDao.save(company);
    }

    @PutMapping("/{email}/photo")
    public Company updateCompanyImage(@PathVariable String email, @RequestParam("newCompany") MultipartFile file) throws IOException {

        Company finalCompany = companyDao.findFirstByEmail(email);

        finalCompany.setImageType(file.getContentType());
        finalCompany.setPic(file.getBytes());

        return companyDao.save(finalCompany);
    }

    @DeleteMapping("/{email}")
    public void deleteCompanyUser(@PathVariable String email){
        companyDao.delete(companyDao.findFirstByEmail(email));
    }

}
