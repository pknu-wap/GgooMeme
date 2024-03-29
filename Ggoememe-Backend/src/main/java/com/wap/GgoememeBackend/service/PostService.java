package com.wap.GgoememeBackend.service;

import com.wap.GgoememeBackend.domain.Post;
import com.wap.GgoememeBackend.domain.User;
import com.wap.GgoememeBackend.payload.PostDto;
import com.wap.GgoememeBackend.repository.PostRepository;
import com.wap.GgoememeBackend.repository.UserRepository;
import com.wap.GgoememeBackend.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.Set;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;


    public PostDto findById(UserPrincipal userPrincipal, Long id) throws NoSuchElementException{
        Post post = postRepository.findById(id)
                .orElseThrow(()->new NoSuchElementException("no post"));

        PostDto postDto = PostDto.of(post);

        //post의 유저중에 user의 id와 일치하는 user가 있는지 확인
        Set<User> users = post.getBookmarkedUsers();
        boolean isBookMarked = users.stream().anyMatch(user -> user.getId().equals(userPrincipal.getId()));
        if(isBookMarked){
            postDto.setBookmarked(true);
        }

        return postDto;
    }

    //TODO 쿼리 개선 필요
    public String clickBookmark(UserPrincipal userPrincipal, Long id) throws RuntimeException{
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("no post"));

        Set<User> users = post.getBookmarkedUsers();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("no user"));
        boolean isBookMarked = users.stream().anyMatch(u -> u.equals(user));
        if(isBookMarked){
            post.getBookmarkedUsers().remove(user);
            postRepository.save(post);
            return "remove bookmark";
        }else{
            post.getBookmarkedUsers().add(user);
            postRepository.save(post);
            return "add bookmark";
        }
    }
}
