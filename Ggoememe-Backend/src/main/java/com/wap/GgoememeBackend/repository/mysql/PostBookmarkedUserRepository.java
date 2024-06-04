package com.wap.GgoememeBackend.repository.mysql;

import com.wap.GgoememeBackend.domain.Post;
import com.wap.GgoememeBackend.domain.PostBookmarkedUser;
import com.wap.GgoememeBackend.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

public interface PostBookmarkedUserRepository extends JpaRepository<PostBookmarkedUser, Long> {
    Optional<PostBookmarkedUser> findByPostIdAndUser(String postId, User user);

    @Query(value = "SELECT p FROM PostBookmarkedUser p GROUP BY p.postId ORDER BY COUNT(p.postId) DESC")
    Page<PostBookmarkedUser> findAllOrderByPostIdCountDesc(Pageable pageable);

    List<PostBookmarkedUser> findPostBookmarkedUsersByPostId(String postId);
}
