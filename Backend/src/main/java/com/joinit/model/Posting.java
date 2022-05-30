package com.joinit.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "posting")
@Getter
@Setter
public class Posting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "email")
    private String email;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "position_name")
    private String positionName;

    @Column(name = "requirement")
    private String requirement;

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private PostingCategory postingCategory;

    @Column(name = "localization")
    private String localization;

    @Column(name = "min_salary")
    private BigDecimal minSalary;

    @Column(name = "max_salary")
    private BigDecimal maxSalary;

    public Posting() {
    }

    public Posting(String email, String companyName, String positionName, String requirement, String description, PostingCategory postingCategory,
                   String localization, BigDecimal minSalary, BigDecimal maxSalary) {

        this.email = email;
        this.companyName = companyName;
        this.positionName = positionName;
        this.requirement = requirement;
        this.description = description;
        this.postingCategory = postingCategory;
        this.localization = localization;
        this.minSalary = minSalary;
        this.maxSalary = maxSalary;
    }

    public Posting(Long id, String email, String companyName, String positionName, String requirement, String description, PostingCategory postingCategory,
                   String localization, BigDecimal minSalary, BigDecimal maxSalary) {

        this.id = id;
        this.email = email;
        this.companyName = companyName;
        this.positionName = positionName;
        this.requirement = requirement;
        this.description = description;
        this.postingCategory = postingCategory;
        this.localization = localization;
        this.minSalary = minSalary;
        this.maxSalary = maxSalary;
    }
}


