package com.wap.GgoememeBackend.controller;

import com.wap.GgoememeBackend.payload.request.reply.ReplyRequest;
import com.wap.GgoememeBackend.payload.response.reply.ReplyResponse;
import com.wap.GgoememeBackend.security.CurrentUser;
import com.wap.GgoememeBackend.security.UserPrincipal;
import com.wap.GgoememeBackend.service.ReplyService;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
public class ReplyController {
    private ReplyService replyService;

    public ReplyController(ReplyService replyService) {
        this.replyService = replyService;
    }

    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = ReplyResponse.class)))
    @GetMapping("/reply/{postId}/{page}")
    public ResponseEntity<?> getReplies(@PathVariable("postId")String postId, @PathVariable("page") int page){
        ReplyResponse replies;
        try {
            replies = replyService.findByPostId(postId, page);
        }catch (NoSuchElementException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        }
        return new ResponseEntity<>(replies, HttpStatus.OK);
    }

    @ApiResponse(responseCode = "200", description = "success write reply")
    @PostMapping("/reply")
    public ResponseEntity<?> writeReply(@CurrentUser UserPrincipal userPrincipal, @RequestBody ReplyRequest replyRequest){
        if(userPrincipal.isEnabled()){
            try{
                replyService.writeReply(userPrincipal.getId(), replyRequest);
            }catch(RuntimeException e){
                return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
            }
            return new ResponseEntity<>("success write reply", HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>("not logined", HttpStatus.NOT_ACCEPTABLE);
        }
    }
}
