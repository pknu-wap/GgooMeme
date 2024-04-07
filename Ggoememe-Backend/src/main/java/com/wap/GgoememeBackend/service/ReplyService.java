package com.wap.GgoememeBackend.service;

import com.wap.GgoememeBackend.domain.Post;
import com.wap.GgoememeBackend.domain.Reply;
import com.wap.GgoememeBackend.payload.request.reply.ReplyRequest;
import com.wap.GgoememeBackend.payload.response.reply.ReplyResponse;
import com.wap.GgoememeBackend.repository.PostRepository;
import com.wap.GgoememeBackend.repository.ReplyRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class ReplyService {
    private PostRepository postRepository;
    private ReplyRepository replyRepository;

    public ReplyService(PostRepository postRepository, ReplyRepository replyRepository) {
        this.postRepository = postRepository;
        this.replyRepository = replyRepository;
    }

    public ReplyResponse findByPostId(Long postId, int page) throws RuntimeException{
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("no post"));

        //postId기반으로 Reply를 20개씩 페이지네이션 해야 함
        PageRequest pageRequest = PageRequest.of(page, 20, Sort.by("id").descending());
        Page<Reply> pagedReplies = replyRepository.findRepliesByPost(post, pageRequest);
        List<String> replies = pagedReplies.getContent().stream()
                .map(r -> r.getText())
                .collect(Collectors.toList());

        return new ReplyResponse(pagedReplies.hasNext(), replies);
    }

    public void writeReply(Long id, ReplyRequest req) throws RuntimeException{
        Post post = postRepository.findById(req.getPostId())
                .orElseThrow(() -> new NoSuchElementException());

        Reply reply = new Reply(null, req.getText(), post);
        replyRepository.save(reply);
    }
}
