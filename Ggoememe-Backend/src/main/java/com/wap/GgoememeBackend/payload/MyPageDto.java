package com.wap.GgoememeBackend.payload;

import com.wap.GgoememeBackend.domain.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class MyPageDto {
    Long id;
    String email;
    String name;
    String imageUrl;



    //UserDto userDto = UserDto.of(user)
    public static MyPageDto of(User user) {
        return new MyPageDto(user.getId(), user.getEmail(), user.getName(), user.getImageUrl());
    }


}
