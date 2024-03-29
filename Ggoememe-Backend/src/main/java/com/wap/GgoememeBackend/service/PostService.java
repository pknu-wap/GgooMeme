package com.wap.GgoememeBackend.service;

import com.wap.GgoememeBackend.payload.PostDto;
import com.wap.GgoememeBackend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;


    public PostDto findById(Long id) {

        return PostDto.of(post);
    }
}
