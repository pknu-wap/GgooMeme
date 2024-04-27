package com.wap.GgoememeBackend.payload.response.reply;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReplyResponse {
    private boolean hasNext;
    private List<String> replies;
}
