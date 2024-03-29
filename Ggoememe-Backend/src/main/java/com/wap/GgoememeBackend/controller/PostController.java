package com.wap.GgoememeBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PostController {
    @Autowired
    private PostService postService;

    @GetMapping("/post/info/{id}")
    public ResponseEntity<?> postInfo(@PathVariable("id") Long id){
        PostDto postDto = postService.findById(id);;
        return new ResponseEntity<>(postDto, HttpStatus.OK);
    }
}
