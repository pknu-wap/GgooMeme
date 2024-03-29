package com.wap.GgoememeBackend.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String image;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "post_hashtag",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "hashtag_id"))
    private Set<Hashtag> hashtags = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "post_bookmarkedUser",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<Hashtag> bookmarkedUsers = new HashSet<>();

    //TODO 아 Hashtag 아니고 user를 넣어야지 다 수정해야함;;
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "post_likedUser",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<Hashtag> likedUsers = new HashSet<>();

    public List<String> getHashtagNames() {
        List<String> hashtagsNames = this.hashtags.stream()
                .map(Hashtag::getName)
                .collect(Collectors.toList());
        return hashtagsNames;
    }
}
