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
public class PostDtos {
    private List<PostDto> postDtos;

    public static PostDtos of(List<Post> posts){
        //리스트를 postDto의 리스트로 만들고 생성자 사용해서 반환

        List<PostDto> postDtos = posts.stream().map(PostDto::of).collect(Collectors.toList());
        return new PostDtos(postDtos);
    }
}
