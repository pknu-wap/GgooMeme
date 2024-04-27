package com.wap.GgoememeBackend.repository;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberPath;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.wap.GgoememeBackend.domain.Post;
import com.wap.GgoememeBackend.domain.User;
import com.wap.GgoememeBackend.payload.PostPreviewDtos;
import com.wap.GgoememeBackend.payload.response.post.MainPostResponse;
import jakarta.persistence.EntityManager;
import lombok.Getter;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.wap.GgoememeBackend.domain.QPost.post;

@Getter
@Repository
public class MainPostRepository {

    private final JPAQueryFactory query;

    public MainPostRepository(EntityManager em) {
        this.query = new JPAQueryFactory(em);
    }

    public MainPostResponse pageOfMainPosts(int page) {
        NumberPath<Long> bookmarkedUsersCount = Expressions.numberPath(Long.class, "bookmarkedUsers");

        List<Tuple> result = query
                .select(post, post.bookmarkedUsers.size().as(String.valueOf(bookmarkedUsersCount)))
                .from(post)
                .orderBy(bookmarkedUsersCount.desc())
                .limit(21)
                .offset(page * 20)
                .fetch();

        List<Post> posts = result.stream()
                .map(t -> t.get(0, Post.class))
                .collect(Collectors.toList());

        boolean hasNext = posts.size() == 21;
        if (hasNext) {
            posts.remove(20);
        }

        PostPreviewDtos postPreviewDtos = PostPreviewDtos.of(posts);

        return new MainPostResponse(hasNext, postPreviewDtos);
    }
}
