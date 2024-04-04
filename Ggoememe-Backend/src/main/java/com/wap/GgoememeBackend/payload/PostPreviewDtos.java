package com.wap.GgoememeBackend.payload;

import com.wap.GgoememeBackend.domain.Post;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostPreviewDtos {
    private List<PostPreviewDto> postPreviewDtos;

    public static PostPreviewDtos of(List<Post> posts){
        //리스트를 postDto의 리스트로 만들고 생성자 사용해서 반환

        List<PostPreviewDto> postPreviewDtos = posts.stream()
                .map(PostPreviewDto::of)
                .collect(Collectors.toList());
        return new PostPreviewDtos(postPreviewDtos);
    }
}
