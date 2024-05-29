package com.wap.GgoememeBackend;

import com.wap.GgoememeBackend.service.PostService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class PostServiceTest {
//    @Autowired
//    private PostService postService;
//
//    @Autowired
//    private RedisTemplate<String, Object> redisTemplate;
//
//    @Test
//    public void 정상값찾기(){
//        // Given
//        String tag = "나무";
//        int page = 1;
//        String expectedCacheKey = "com.wap.GgoememeBackend.service.PostService.searchPosts"; // 패키지명과 클래스명을 실제로 바꾸세요.
//
//        // When
//        postService.searchPosts(tag, page);
//
//        // Then
//        ValueOperations<String, Object> valueOps = redisTemplate.opsForValue();
//        Object cachedValue = valueOps.get(expectedCacheKey);
//
//        assertThat(cachedValue).isNotNull();
//    }

}
