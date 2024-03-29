package com.wap.GgoememeBackend.payload;

import com.wap.GgoememeBackend.domain.Post;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {
    private String image;
    private List<String> hashtags;
    private int likes;
    private boolean isBookmarked;

    public static PostDto of(Post post){

        return new PostDto(post.getImage(),
                ),
                post.getLikes(),
                false);
    }
}
