package com.wap.GgoememeBackend.service;

import com.wap.GgoememeBackend.domain.*;
import com.wap.GgoememeBackend.payload.PostDto;
import com.wap.GgoememeBackend.payload.PostPreviewDtos;
import com.wap.GgoememeBackend.payload.response.post.MainPostResponse;
import com.wap.GgoememeBackend.payload.response.post.RelatedPostResponse;
import com.wap.GgoememeBackend.payload.response.post.SearchPostResponse;
import com.wap.GgoememeBackend.repository.mongo.PostRepository;
import com.wap.GgoememeBackend.repository.mysql.PostBookmarkedUserRepository;
import com.wap.GgoememeBackend.repository.mysql.ReplyRepository;
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
import java.util.stream.Collectors;


@Service
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ReplyRepository replyRepository;
    private final PostBookmarkedUserRepository postBookmarkedUserRepository;
    private final MongoTemplate mongoTemplate;

    public PostService(PostRepository postRepository, UserRepository userRepository, ReplyRepository replyRepository, PostBookmarkedUserRepository postBookmarkedUserRepository, MongoTemplate mongoTemplate) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.replyRepository = replyRepository;
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
        List<PostBookmarkedUser> list = postBookmarkedUserRepository.findPostBookmarkedUsersByPostId(postId);

        PostDto postDto = PostDto.of(post);
        postDto.setBookmarkedCount(list.size());
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


    @Cacheable(cacheNames = "getRelatedPosts", key = "#root.target + #root.methodName+ #postId +#page", sync = true, cacheManager = "rcm")
    public RelatedPostResponse getRelatedPosts(String postId, int page) throws RuntimeException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("no post"));
        List<String> tags = post.getTags();
        Page<Post> posts = postRepository.findByTagsIn(tags, PageRequest.of(page, 8));
        return new RelatedPostResponse(posts.hasNext(), PostPreviewDtos.of(posts.getContent()));
    }



    @Cacheable(cacheNames = "searchPosts", key = "#root.target + #root.methodName+ #tag +#page", sync = true, cacheManager = "rcm")
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
    @Cacheable(cacheNames = "replyMainPosts", key = "#root.target + #root.methodName + #page", sync = true, cacheManager = "rcm")
    public MainPostResponse replyMainPosts(int page) {
        int pageSize = 20;
        PageRequest pageRequest = PageRequest.of(page - 1, pageSize);

        Page<Object[]>  postWithReplyCountPage = replyRepository.findPostIdsByReplyDesc(pageRequest);
        List<String> postIds = postWithReplyCountPage.stream()
                .map(objects -> String.valueOf(objects[0]))
                .collect(Collectors.toList());

        List<Post> posts = postRepository.findAllById(postIds);

        return new MainPostResponse(postWithReplyCountPage.hasNext(), PostPreviewDtos.of(posts));
    }

    @Cacheable(cacheNames = "bookmarkMainPosts", key = "#root.target + #root.methodName + #page", sync = true, cacheManager = "rcm")
    public MainPostResponse bookmarkMainPosts(int page) {
        int pageSize = 20;
        PageRequest pageRequest = PageRequest.of(page - 1, pageSize);

        Page<Object[]> postWithBookmarkCountPage = postBookmarkedUserRepository.findAllOrderByPostIdCountDesc(pageRequest);
        List<String> postIds = postWithBookmarkCountPage.stream()
                .map(objects -> String.valueOf(objects[0]))
                .collect(Collectors.toList());

        List<Post> posts = postRepository.findAllById(postIds);

        return new MainPostResponse(postWithBookmarkCountPage.hasNext(), PostPreviewDtos.of(posts));
    }
}
