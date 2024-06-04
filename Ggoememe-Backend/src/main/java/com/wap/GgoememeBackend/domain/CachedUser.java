package com.wap.GgoememeBackend.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.redis.core.RedisHash;

import java.util.List;
import java.util.Random;

@Getter
@Setter
//@NoArgsConstructor
@RedisHash(value = "user", timeToLive = 30)
@Document(collection="users")
public class CachedUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Email
    @Column(nullable = false)
    private String email;

    private String imageUrl;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PostBookmarkedUser> bookmarkedPosts;


    @Column(nullable = false)
    private Boolean emailVerified = false;

    @JsonIgnore
    private String password;

    @NotNull
    @Enumerated(EnumType.STRING)
    private AuthProvider provider;

    private String providerId;


    public CachedUser(Long id, String name, String email, String imageUrl, List<PostBookmarkedUser> bookmarkedPosts, String password, String providerId, AuthProvider provider) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.imageUrl = imageUrl;
        this.bookmarkedPosts = bookmarkedPosts;
        this.password = password;
        this.providerId = providerId;
        this.provider = provider;


    }
}

