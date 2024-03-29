package com.wap.GgoememeBackend.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {
    private String image;
    private List<String> hashtags;
    private int likes;
    private boolean isBookmarked;
}
