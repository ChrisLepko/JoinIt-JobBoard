package com.joinit.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "posting_category")
@Getter
@Setter
@NoArgsConstructor
public class PostingCategory {

    @Id
    @Basic(optional = false)
    @Column(name = "id",unique=true, nullable = false)
    private Long id;

    @Column(name = "category_name")
    private String categoryName;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "postingCategory")
    private Set<Posting> postings;

    public PostingCategory(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Set<Posting> getPostings() {
        return postings;
    }

    public void setPostings(Set<Posting> postings) {
        this.postings = postings;
    }

    @Override
    public String toString() {
        return "PostingCategory{" +
                "id=" + id +
                ", categoryName='" + categoryName + '\'' +
                ", postings=" + postings +
                '}';
    }
}
