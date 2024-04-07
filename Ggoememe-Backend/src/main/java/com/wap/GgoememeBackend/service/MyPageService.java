package com.wap.GgoememeBackend.service;

import com.wap.GgoememeBackend.domain.Post;
import com.wap.GgoememeBackend.domain.User;
import com.wap.GgoememeBackend.payload.MyPageDto;
import com.wap.GgoememeBackend.payload.PostPreviewDto;
import com.wap.GgoememeBackend.repository.UserRepository;
import com.wap.GgoememeBackend.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MyPageService {
    @Autowired
    public UserRepository userRepository;

    public MyPageDto findMyPage(Long userId) throws RuntimeException{
        Optional<User> optionalUser = userRepository.findById(userId);

        if(optionalUser.isEmpty())
            throw new RuntimeException("no user");

        return MyPageDto.of(optionalUser.get());
    }

    public Map<String, List<PostPreviewDto>> getBookmarkedPosts(UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new NoSuchElementException("No user found"));
        Set<Post> bookmarkedPosts = user.getBookmarkedPosts();

        List<PostPreviewDto> postPreviewDtos = bookmarkedPosts.stream()
                .map(post -> new PostPreviewDto(post.getId(), post.getImage()))
                .collect(Collectors.toList());

        Map<String, List<PostPreviewDto>> PostPreviewDtos = new HashMap<>();
        PostPreviewDtos.put("postPreviewDtos", postPreviewDtos);

        return PostPreviewDtos;
    }
}
