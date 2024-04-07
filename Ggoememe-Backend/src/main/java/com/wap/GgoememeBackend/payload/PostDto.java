package com.wap.GgoememeBackend.payload;

import com.wap.GgoememeBackend.domain.Post;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {
    private Long postId;
    private String image;
    private List<String> hashtags;
    private int likes;
    private boolean isBookmarked;

    public static PostDto of(Post post){

        return new PostDto(post.getId(),
                post.getImage(),
                post.getHashtagNames(),
                post.getLikedUsers().size(),
                false);
    }
}
