package com.wap.GgoememeBackend.service;

import com.wap.GgoememeBackend.domain.Post;
import com.wap.GgoememeBackend.domain.Reply;
import com.wap.GgoememeBackend.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class ReplyService {
    private PostRepository postRepository;

    public ReplyService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<String> findByPostId(Long postId) throws RuntimeException{
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("no post"));

        List<Reply> replies = post.getReplies();

        List<String> repliesTexts = replies.stream()
                .map(r -> r.getText())
                .collect(Collectors.toList());

        return repliesTexts;
    }
}
