package com.joinit.controller;

import com.joinit.dao.CompanyDao;
import com.joinit.dao.PostingCategoryDao;
import com.joinit.dao.PostingDao;
import com.joinit.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping(path = "/posting")
public class PostingController {

    @Autowired
    PostingDao postingDao;
    @Autowired
    CompanyDao companyDao;
    @Autowired
    PostingCategoryDao postingCategoryDao;


    @PostMapping(path = "/create")
    public Posting addNewPosting(@RequestBody TempPosting tempPosting){

        StringBuilder finalRequirements = new StringBuilder();
        tempPosting.getRequirements().forEach(c -> finalRequirements.append(c).append(","));

        Long categoryId = postingCategoryDao.findByCategoryName(tempPosting.getCategory()).getId();

        Posting finalPosting = new Posting(tempPosting.getEmail(), tempPosting.getCompanyName(), tempPosting.getPositionName(),
                finalRequirements.toString(), tempPosting.getDescription(), new PostingCategory(categoryId), tempPosting.getLocalization(),
                tempPosting.getMinSalary(), tempPosting.getMaxSalary());

        return postingDao.save(finalPosting);
    }

    @DeleteMapping(path = "/delete/{id}")
    public void deleteJobPosting(@PathVariable Long id){
        postingDao.deleteById(id);
    }

    @PutMapping(path = "/{id}")
    public Posting editPosting(@PathVariable Long id, @RequestBody TempPosting tempPosting){

        StringBuilder finalRequirements = new StringBuilder();
        tempPosting.getRequirements().forEach(c -> finalRequirements.append(c).append(","));

        Long categoryId = postingCategoryDao.findByCategoryName(tempPosting.getCategory()).getId();

        Posting finalPosting = new Posting(id, tempPosting.getEmail(), tempPosting.getCompanyName(), tempPosting.getPositionName(),
                finalRequirements.toString(), tempPosting.getDescription(), new PostingCategory(categoryId), tempPosting.getLocalization(),
                tempPosting.getMinSalary(), tempPosting.getMaxSalary());

        return postingDao.save(finalPosting);
    }
}
