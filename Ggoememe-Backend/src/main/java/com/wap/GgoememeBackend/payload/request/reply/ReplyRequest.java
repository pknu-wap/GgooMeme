package com.wap.GgoememeBackend.payload.request.reply;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReplyRequest {
    private String postId;
    private String text;
}
