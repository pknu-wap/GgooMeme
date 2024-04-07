package com.wap.GgoememeBackend.service;

import com.wap.GgoememeBackend.domain.Post;
import com.wap.GgoememeBackend.repository.PostRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ReplyService {
    private PostRepository postRepository;

    public ReplyService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<String> findByPostId(Long postId, int page) throws RuntimeException{
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("no post"));

        //postId기반으로 Reply를 20개씩 페이지네이션 해야 함
        PageRequest pageRequest = PageRequest.of(page, 20, Sort.by("id").descending());

        return null;
    }
}
