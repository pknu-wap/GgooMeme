package com.wap.GgoememeBackend.controller;

import com.wap.GgoememeBackend.payload.PostDto;
import com.wap.GgoememeBackend.payload.response.post.MainPostResponse;
import com.wap.GgoememeBackend.payload.response.post.RelatedPostResponse;
import com.wap.GgoememeBackend.payload.response.post.SearchPostResponse;
import com.wap.GgoememeBackend.security.CurrentUser;
import com.wap.GgoememeBackend.security.UserPrincipal;
import com.wap.GgoememeBackend.service.PostService;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
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

    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = PostDto.class)))
    @GetMapping("/post/info/{id}")
    public ResponseEntity<?> postInfo(@CurrentUser UserPrincipal userPrincipal, @PathVariable("id") String id) {
        PostDto postDto;
        try {
            postDto = postService.findById(userPrincipal, id);
        }catch (NoSuchElementException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_ACCEPTABLE);
        }
        return new ResponseEntity<>(postDto, HttpStatus.OK);
    }

    @ApiResponse(responseCode = "200", description = "clicked bookmark")
    @PutMapping("/post/bookmark/{id}")
    public ResponseEntity<String> clickBookmark(@CurrentUser UserPrincipal userPrincipal, @PathVariable("id") String id){
        String result;
        try {
            result= postService.clickBookmark(userPrincipal, id);
        }catch (RuntimeException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = RelatedPostResponse.class)))
    @GetMapping("/post/related/{id}/{page}")
    public ResponseEntity<?> getRelated(@PathVariable("id") String id, @PathVariable("page") int page){
        RelatedPostResponse relatedPostResponse;
        try {
            relatedPostResponse = postService.getRelatedPosts(id, page);
        }catch (RuntimeException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>(relatedPostResponse, HttpStatus.OK);
    }

    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = MainPostResponse.class)))
    @GetMapping("/post/main/{page}/{order}")
    public ResponseEntity<?> getMainPosts(@PathVariable("page") int page, @PathVariable("order") String order) {
        MainPostResponse mainPostResponse;
        try {
            if ("random".equals(order)) {
                mainPostResponse = postService.randomMainPosts(page);
            } else if ("reply".equals(order)) {
                mainPostResponse = postService.replyMainPosts(page);
            } else if ("bookmark".equals(order)) {
                mainPostResponse = postService.bookmarkMainPosts(page);
            } else {
                mainPostResponse = postService.bookmarkMainPosts(page);
            }
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>(mainPostResponse, HttpStatus.OK);
    }

    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = SearchPostResponse.class)))
    @GetMapping("/post/search/{tag}/{page}")
    public ResponseEntity<?> searchPosts(@PathVariable("tag") String tag, @PathVariable("page") int page){
        SearchPostResponse searchPostResponse;
        try {
            searchPostResponse = postService.searchPosts(tag, page);
        }catch (RuntimeException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>(searchPostResponse, HttpStatus.OK);
    }
}
