package com.wap.GgoememeBackend.payload.response.post;

import com.wap.GgoememeBackend.payload.PostPreviewDtos;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class RelatedPostResponse {
    private boolean hasNext;
    private PostPreviewDtos postDtos;

}
