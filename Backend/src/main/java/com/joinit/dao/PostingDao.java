package com.joinit.dao;

import com.joinit.model.Posting;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin
@RepositoryRestResource(path = "postings")
public interface PostingDao extends JpaRepository<Posting, Long> {

    Page<Posting> findByPostingCategoryId(@RequestParam("id") Long id, Pageable pageable);

    Page<Posting> findByRequirementContaining(@RequestParam("requirement") String requirement, Pageable pageable);

    Page<Posting> findByLocalizationContaining(@RequestParam("localization") String localization, Pageable pageable);

    Page<Posting> findByEmail(@RequestParam("email") String email, Pageable pageable);

}
