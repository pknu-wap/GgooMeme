package com.wap.GgoememeBackend.service;

import com.wap.GgoememeBackend.domain.Post;
import com.wap.GgoememeBackend.domain.PostBookmarkedUser;
import com.wap.GgoememeBackend.domain.User;
import com.wap.GgoememeBackend.payload.PostDto;
import com.wap.GgoememeBackend.payload.PostPreviewDtos;
import com.wap.GgoememeBackend.payload.response.post.MainPostResponse;
import com.wap.GgoememeBackend.payload.response.post.RelatedPostResponse;
import com.wap.GgoememeBackend.payload.response.post.SearchPostResponse;
import com.wap.GgoememeBackend.repository.mongo.PostRepository;
import com.wap.GgoememeBackend.repository.mysql.PostBookmarkedUserRepository;
import com.wap.GgoememeBackend.repository.mysql.UserRepository;
import com.wap.GgoememeBackend.security.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostBookmarkedUserRepository postBookmarkedUserRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository, PostBookmarkedUserRepository postBookmarkedUserRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.postBookmarkedUserRepository = postBookmarkedUserRepository;
    }

    public PostDto findById(UserPrincipal userPrincipal, String postId) throws NoSuchElementException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("no post"));

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new NoSuchElementException("no user"));

        PostDto postDto = PostDto.of(post);

        //post의 유저중에 user의 id와 일치하는 user가 있는지 확인

        Optional<PostBookmarkedUser> postBookmarkedUser = postBookmarkedUserRepository.findByPostIdAndUser(postId, user);
        if(postBookmarkedUser.isPresent()){
            postDto.setBookmarked(true);
        }
        return postDto;
    }

    public String clickBookmark(UserPrincipal userPrincipal, String postId) throws RuntimeException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("no post"));

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("no user"));

        Optional<PostBookmarkedUser> postBookmarkedUser = postBookmarkedUserRepository.findByPostIdAndUser(postId, user);
        if(postBookmarkedUser.isPresent()){
            postBookmarkedUserRepository.delete(postBookmarkedUser.get());
            return "remove bookmark";
        } else{
            PostBookmarkedUser add = new PostBookmarkedUser(null, postId, user);
            postBookmarkedUserRepository.save(add);
            return "add bookmark";
        }
    }

    public RelatedPostResponse getRelatedPosts(String postId, int page) throws RuntimeException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("no post"));
        List<String> tags = post.getTags();
        Page<Post> posts = postRepository.findByTagsIn(tags, PageRequest.of(page, 8));
        return new RelatedPostResponse(posts.hasNext(), PostPreviewDtos.of(posts.getContent()));
    }

    public MainPostResponse getMainPosts(int page) throws RuntimeException {
//        return mainPostRepository.pageOfMainPosts(page);
        Page<PostBookmarkedUser> pageOfPostBookmarkedUsers = postBookmarkedUserRepository.findAllOrderByPostIdCountDesc(PageRequest.of(page, 20));
        List<String> postIds = pageOfPostBookmarkedUsers.getContent().stream()
                .map(p -> p.getPostId())
                .collect(Collectors.toList());
        List<Post> posts = postRepository.findAllById(postIds);

        boolean hasNext = pageOfPostBookmarkedUsers.hasNext();

        return new MainPostResponse(hasNext, PostPreviewDtos.of(posts));
    }

    public SearchPostResponse searchPosts(String hashtag, int page){
        PageRequest pageRequest = PageRequest.of(page - 1, 20, Sort.by("id").descending());
        Page<Post> pageOfPosts = postRepository.findByTags(hashtag, pageRequest);
        return new SearchPostResponse(pageOfPosts.hasNext(), PostPreviewDtos.of(pageOfPosts.getContent()));

    }
}
