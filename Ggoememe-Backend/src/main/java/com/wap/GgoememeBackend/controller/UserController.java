package com.wap.GgoememeBackend.controller;

import com.wap.GgoememeBackend.domain.User;
import com.wap.GgoememeBackend.exception.ResourceNotFoundException;
import com.wap.GgoememeBackend.payload.MyPageDto;
import com.wap.GgoememeBackend.payload.PostPreviewDtos;
import com.wap.GgoememeBackend.payload.UserDto;
import com.wap.GgoememeBackend.repository.UserRepository;
import com.wap.GgoememeBackend.security.CurrentUser;
import com.wap.GgoememeBackend.security.UserPrincipal;
import com.wap.GgoememeBackend.service.MyPageService;
import com.wap.GgoememeBackend.service.PostService;
import com.wap.GgoememeBackend.service.UserService;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private MyPageService myPageService;

    @Autowired
    private PostService postService;

    @GetMapping("/user/me")
    public User getCurrentUser(@CurrentUser UserPrincipal userPrincipal) {
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
    }

    //GET /user/{userId}
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = UserDto.class)))
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserInfo(@CurrentUser UserPrincipal userPrincipal, @PathVariable Long userId) {
        UserDto userDto;
        try {
            userDto = userService.findUser(userId);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(userDto, HttpStatus.OK);
    }

    //Get/mypage/info
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = MyPageDto.class)))
    @GetMapping("/mypage/info")
    public ResponseEntity<MyPageDto> getMyPageInfo(@CurrentUser UserPrincipal userPrincipal) {
        MyPageDto myPageDto;
        try {
            myPageDto = myPageService.findMyPage(userPrincipal.getId());
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(myPageDto, HttpStatus.OK);
    }

    //Get/mypage/bookmark
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = PostPreviewDtos.class)))
    @GetMapping("/mypage/bookmark")
    public ResponseEntity<?> getBookmarkedPosts(@CurrentUser UserPrincipal userPrincipal) {
        PostPreviewDtos bookmarkedPosts;
        try {
            bookmarkedPosts = myPageService.getBookmarkedPosts(userPrincipal);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(bookmarkedPosts, HttpStatus.OK);
    }
}

