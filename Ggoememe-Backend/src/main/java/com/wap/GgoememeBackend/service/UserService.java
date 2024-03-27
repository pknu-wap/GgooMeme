package com.wap.GgoememeBackend.service;

import com.wap.GgoememeBackend.domain.User;
import com.wap.GgoememeBackend.payload.UserDto;
import com.wap.GgoememeBackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    public UserRepository userRepository;

    public UserDto findUser(Long userId) throws RuntimeException{
        Optional<User> optionalUser = userRepository.findById(userId);

        if(optionalUser.isEmpty())
            throw new RuntimeException("no user");

        return UserDto.of(optionalUser.get());
    }
}
