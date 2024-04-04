package com.wap.GgoememeBackend.repository;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberPath;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.wap.GgoememeBackend.domain.Post;
import com.wap.GgoememeBackend.payload.PostPreviewDtos;
import com.wap.GgoememeBackend.payload.response.post.RelatedPostResponse;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

import static com.wap.GgoememeBackend.domain.QHashtag.hashtag;
import static com.wap.GgoememeBackend.domain.QPost.post;

@Repository
public class QueryDSLRepository {
    private final JPAQueryFactory query;

    public QueryDSLRepository(EntityManager em) {
        this.query = new JPAQueryFactory(em);
    }

    public RelatedPostResponse pageOfRelatedPosts(List<String> hashtagNames, int page){
        NumberPath<Long> hashtagsCount = Expressions.numberPath(Long.class, "hashtag");

        List<Tuple> result = query
                .select(post, hashtag.id.count().as(hashtagsCount))
                .from(post)
                .join(post.hashtags,hashtag)
                .where(hashtag.name.in(hashtagNames))
                .groupBy(post.id)
                .orderBy(hashtagsCount.desc())
                .limit(9)
                .offset(page*8)
                .fetch();

        List<Post> posts = result.stream()
                        .map(t->t.get(0, Post.class))
                                .collect(Collectors.toList());

        boolean hasNext=false;
        if (posts.size()==9) {
            hasNext=true;
            posts.remove(8);
        }

        PostPreviewDtos postPreviewDtos = PostPreviewDtos.of(posts);

        return new RelatedPostResponse(hasNext, postPreviewDtos);
    }
}
