package com.joinit.dao;

import com.joinit.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;


@CrossOrigin
@RepositoryRestResource(path = "companies")
public interface CompanyDao extends JpaRepository<Company, String> {

    Company findByEmailAndPassword(@Param("email") String email, @Param("password") String password);

    Company findFirstByEmail(@Param("email") String email);

}
