package com.wap.GgoememeBackend.domain;

import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.redis.core.RedisHash;

import java.util.List;
import java.util.Random;

@Getter
@Setter
//@NoArgsConstructor
@RedisHash(value = "post", timeToLive = 30)
@Document(collection="posts")
public class CachedPost {

    @Id
    private String id;

    private String src;

    private List<String> tags;

    private int randId;

    public CachedPost() {
        this.randId = generateRandomId();
    }

    public CachedPost(String id, String src, List<String> tags) {
        this.id = id;
        this.src = src;
        this.tags = tags;
    }

    private int generateRandomId() {
        Random random = new Random();
        return random.nextInt(100000000);
    }
}

