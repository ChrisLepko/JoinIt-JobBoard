package com.joinit.dao;

import com.joinit.model.Applicants;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin
@RepositoryRestResource(path = "applicants")
public interface ApplicantsDao extends JpaRepository<Applicants, Long> {

    Page<Applicants> findByCompanyEmailContaining(@RequestParam("companyEmail") String companyEmail, Pageable pageable);
}
