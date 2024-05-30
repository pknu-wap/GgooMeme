package com.wap.GgoememeBackend.service;

import com.wap.GgoememeBackend.domain.CachedPost;
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
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostBookmarkedUserRepository postBookmarkedUserRepository;


    private final MongoTemplate mongoTemplate;

    public PostService(PostRepository postRepository, UserRepository userRepository, PostBookmarkedUserRepository postBookmarkedUserRepository, MongoTemplate mongoTemplate) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.postBookmarkedUserRepository = postBookmarkedUserRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public PostDto findById(UserPrincipal userPrincipal, String postId) throws NoSuchElementException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("no post"));

        boolean isBookmarked = false;
        if(userPrincipal!=null){
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new NoSuchElementException("no user"));
            Optional<PostBookmarkedUser> postBookmarkedUser = postBookmarkedUserRepository.findByPostIdAndUser(postId, user);
            if(postBookmarkedUser.isPresent()){
                isBookmarked=true;
            }
        }
        PostDto postDto = PostDto.of(post);
        postDto.setBookmarked(isBookmarked);
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



    @Cacheable(cacheNames = "searchPosts", key = "#root.target + #root.methodName", sync = true, cacheManager = "rcm")
    public SearchPostResponse searchPosts(String tag, int page){
        PageRequest pageRequest = PageRequest.of(page - 1, 20, Sort.by("id").descending());
        Page<Post> pageOfPosts = postRepository.findByTags(tag, pageRequest);
        return new SearchPostResponse(pageOfPosts.hasNext(), PostPreviewDtos.of(pageOfPosts.getContent()));
    }

    public MainPostResponse randomMainPosts(int page) {
        int pageSize = 20;
        Pageable pageable = PageRequest.of(page - 1, pageSize, Sort.by("id").descending());

        long totalCount = postRepository.count();
        int randomSkip = (int) (Math.random() * totalCount);

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.skip(randomSkip),
                Aggregation.limit(pageSize)
        );

        AggregationResults<Post> results = mongoTemplate.aggregate(aggregation, "posts", Post.class);
        List<Post> posts = results.getMappedResults();

        boolean hasNext = posts.size() == pageSize;

        PostPreviewDtos postPreviewDtos = PostPreviewDtos.of(posts);

        return new MainPostResponse(hasNext, postPreviewDtos);
    }
    @Cacheable(cacheNames = "replayMainPosts", key = "#root.target + #root.methodName", sync = true, cacheManager = "rcm")
    public MainPostResponse replyMainPosts(int page) {
        int pageSize = 20;
        PageRequest pageRequest = PageRequest.of(page - 1, pageSize, Sort.by("replies.size").descending());
        Page<Post> pageOfPosts = postRepository.findAll(pageRequest);

        List<Post> posts = pageOfPosts.getContent();
        boolean hasNext = pageOfPosts.hasNext();

        PostPreviewDtos postPreviewDtos = PostPreviewDtos.of(posts);

        return new MainPostResponse(hasNext, postPreviewDtos);
    }

    @Cacheable(cacheNames = "bookmarkMainPosts", key = "#root.target + #root.methodName", sync = true, cacheManager = "rcm")
    public MainPostResponse bookmarkMainPosts(int page) {
        int pageSize = 20;
        PageRequest pageRequest = PageRequest.of(page - 1, pageSize, Sort.by("bookmarkedUsers.size()").descending());
        Page<Post> pageOfPosts = postRepository.findAll(pageRequest);

        return new MainPostResponse(pageOfPosts.hasNext(), PostPreviewDtos.of(pageOfPosts.getContent()));
    }
}
