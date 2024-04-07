package com.wap.GgoememeBackend.controller;

import com.wap.GgoememeBackend.service.ReplyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
public class ReplyController {
    private ReplyService replyService;

    public ReplyController(ReplyService replyService) {
        this.replyService = replyService;
    }

    @GetMapping("/reply/{postId}")
    public ResponseEntity<?> getReplies(@PathVariable("postId")Long postId, @PathVariable("page") int page){
        List<String> replies;
        try {
            replies = replyService.findByPostId(postId, page);
        }catch (NoSuchElementException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        }
        return new ResponseEntity<>(replies, HttpStatus.OK);
    }
}
