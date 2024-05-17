package com.wap.GgoememeBackend.payload;

import com.querydsl.core.types.dsl.NumberPath;
import com.querydsl.core.types.dsl.StringPath;
import com.wap.GgoememeBackend.domain.Post;
import com.wap.GgoememeBackend.domain.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostPreviewDto {
    private String postId;
    private String postImage;


    public static PostPreviewDto of(Post post){

        return new PostPreviewDto(post.getId(),
                post.getSrc());
    }
}
