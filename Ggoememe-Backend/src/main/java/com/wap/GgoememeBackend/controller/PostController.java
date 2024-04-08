package com.wap.GgoememeBackend.controller;

import com.wap.GgoememeBackend.payload.PostDto;
import com.wap.GgoememeBackend.payload.response.post.MainPostResponse;
import com.wap.GgoememeBackend.payload.response.post.RelatedPostResponse;
import com.wap.GgoememeBackend.security.CurrentUser;
import com.wap.GgoememeBackend.security.UserPrincipal;
import com.wap.GgoememeBackend.service.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.NoSuchElementException;

@RestController
public class PostController {
    private final PostService postService;

    public PostController(PostService postService){
        this.postService = postService;
    }

    @GetMapping("/post/info/{id}")
    public ResponseEntity<?> postInfo(@CurrentUser UserPrincipal userPrincipal, @PathVariable("id") Long id) {
        PostDto postDto;
        try {
            postDto = postService.findById(userPrincipal, id);
        }catch (NoSuchElementException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        }
        return new ResponseEntity<>(postDto, HttpStatus.OK);
    }

    @PutMapping("/post/bookmark/{id}/{page}")
    public ResponseEntity<String> clickBookmark(@CurrentUser UserPrincipal userPrincipal, @PathVariable("id") Long id){
        String result;
        try {
            result= postService.clickBookmark(userPrincipal, id);
        }catch (RuntimeException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/post/related/{id}/{page}")
    public ResponseEntity<?> getRelated(@PathVariable("id") Long id, @PathVariable("page") int page){
        RelatedPostResponse relatedPostResponse;
        try {
            relatedPostResponse = postService.getRelatedPosts(id, page);
        }catch (RuntimeException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>(relatedPostResponse, HttpStatus.OK);
    }

    @GetMapping("/post/main/{page}")
    public ResponseEntity<?> getMainPosts(@PathVariable("page") int page){
        MainPostResponse mainPostResponse;
        try {
            mainPostResponse = postService.getMainPosts(page);
        }catch (RuntimeException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>(mainPostResponse, HttpStatus.OK);
    }
}
