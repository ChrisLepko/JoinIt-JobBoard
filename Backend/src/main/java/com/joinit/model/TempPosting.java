package com.joinit.model;

import java.math.BigDecimal;
import java.util.List;

public class TempPosting {

    private String companyName;
    private String email;
    private String positionName;
    private List<String> requirements;
    private String description;
    private String category;
    private String localization;
    private BigDecimal minSalary;
    private BigDecimal maxSalary;

    public TempPosting(String companyName, String email, String positionName, List<String> requirements, String description, String category, String localization, BigDecimal minSalary, BigDecimal maxSalary) {
        this.companyName = companyName;
        this.email = email;
        this.positionName = positionName;
        this.requirements = requirements;
        this.description = description;
        this.category = category;
        this.localization = localization;
        this.minSalary = minSalary;
        this.maxSalary = maxSalary;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPositionName() {
        return positionName;
    }

    public void setPositionName(String positionName) {
        this.positionName = positionName;
    }

    public List<String> getRequirements() {
        return requirements;
    }

    public void setRequirements(List<String> requirements) {
        this.requirements = requirements;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getLocalization() {
        return localization;
    }

    public void setLocalization(String localization) {
        this.localization = localization;
    }

    public BigDecimal getMinSalary() {
        return minSalary;
    }

    public void setMinSalary(BigDecimal minSalary) {
        this.minSalary = minSalary;
    }

    public BigDecimal getMaxSalary() {
        return maxSalary;
    }

    public void setMaxSalary(BigDecimal maxSalary) {
        this.maxSalary = maxSalary;
    }
}
