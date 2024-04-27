package com.wap.GgoememeBackend.service;

import com.wap.GgoememeBackend.domain.Post;
import com.wap.GgoememeBackend.domain.User;
import com.wap.GgoememeBackend.payload.MyPageDto;
import com.wap.GgoememeBackend.payload.PostPreviewDtos;
import com.wap.GgoememeBackend.repository.UserRepository;
import com.wap.GgoememeBackend.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;

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

    public PostPreviewDtos getBookmarkedPosts(UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new NoSuchElementException("No user found"));
        Set<Post> bookmarkedPosts = user.getBookmarkedPosts();

        List<Post> posts = bookmarkedPosts.stream().toList();
        return PostPreviewDtos.of(posts);
    }
}
