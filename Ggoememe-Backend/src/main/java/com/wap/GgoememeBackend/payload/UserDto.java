package com.wap.GgoememeBackend.payload;


import com.wap.GgoememeBackend.domain.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    String name;
    String email;

    //UserDto userDto = UserDto.of(user)
    public static UserDto of(User user){
        return new UserDto(user.getName(), user.getEmail());
    }
}
