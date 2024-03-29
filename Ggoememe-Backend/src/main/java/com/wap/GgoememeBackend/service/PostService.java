package com.wap.GgoememeBackend.service;

import com.wap.GgoememeBackend.domain.Hashtag;
import com.wap.GgoememeBackend.domain.Post;
import com.wap.GgoememeBackend.payload.PostDto;
import com.wap.GgoememeBackend.repository.PostRepository;
import com.wap.GgoememeBackend.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.Set;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;


    public PostDto findById(UserPrincipal userPrincipal, Long id) throws NoSuchElementException{
        Post post = postRepository.findById(id)
                .orElseThrow(()->new NoSuchElementException("no post"));

        PostDto postDto = PostDto.of(post);

        //post의 유저중에 user의 id와 일치하는 user가 있는지 확인
        Set<Hashtag> users = post.getBookmarkedUsers();
        boolean isBookMared = users.stream().anyMatch(user -> user.getId().equals(userPrincipal.getId()));
        if(isBookMared){
            postDto.setBookmarked(true);
        }

        return postDto;
    }
}
