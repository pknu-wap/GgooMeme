package com.wap.GgoememeBackend.repository;

import com.wap.GgoememeBackend.domain.Post;
import com.wap.GgoememeBackend.domain.Reply;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReplyRepository extends JpaRepository<Reply, Long> {
    Page<Reply> findRepliesByPost(Post post, Pageable pageable);
}
