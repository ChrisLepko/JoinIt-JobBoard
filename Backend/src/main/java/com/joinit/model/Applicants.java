package com.joinit.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "applicants")
@Getter
@Setter
@NoArgsConstructor
public class Applicants {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "company_email")
    private String companyEmail;

    @Column(name = "applicant_email")
    private String applicantEmail;

    @Column(name = "name_surname")
    private String nameSurname;

    public Applicants(String companyEmail, String applicantEmail, String nameSurname) {
        this.companyEmail = companyEmail;
        this.applicantEmail = applicantEmail;
        this.nameSurname = nameSurname;
    }
}
