package com.wap.GgoememeBackend.repository.mongo;

import com.wap.GgoememeBackend.domain.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {
    Page<Post> findByTags(String tag, Pageable pageable);

    Page<Post> findByTagsIn(List<String> tags, Pageable pageable);


}
