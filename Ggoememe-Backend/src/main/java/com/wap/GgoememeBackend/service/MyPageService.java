package com.wap.GgoememeBackend.service;

import com.wap.GgoememeBackend.domain.Post;
import com.wap.GgoememeBackend.domain.PostBookmarkedUser;
import com.wap.GgoememeBackend.domain.User;
import com.wap.GgoememeBackend.payload.MyPageDto;
import com.wap.GgoememeBackend.payload.PostPreviewDtos;
import com.wap.GgoememeBackend.repository.mongo.PostRepository;
import com.wap.GgoememeBackend.repository.mysql.UserRepository;
import com.wap.GgoememeBackend.security.UserPrincipal;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MyPageService {
    public UserRepository userRepository;
    public PostRepository postRepository;

    public MyPageService(UserRepository userRepository, PostRepository postRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    public MyPageDto findMyPage(Long userId) throws RuntimeException{
        Optional<User> optionalUser = userRepository.findById(userId);

        if(optionalUser.isEmpty())
            throw new RuntimeException("no user");

        return MyPageDto.of(optionalUser.get());
    }

    public PostPreviewDtos getBookmarkedPosts(UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new NoSuchElementException("No user found"));

        List<PostBookmarkedUser> bookmarkedPosts = user.getBookmarkedPosts();
        List<String> postIds = bookmarkedPosts.stream()
                .map(postBookmarkedUser -> postBookmarkedUser.getPostId())
                .collect(Collectors.toList());
        List<Post> posts = postRepository.findAllById(postIds);

        return PostPreviewDtos.of(posts);
    }
}
