package com.wap.GgoememeBackend;


import com.wap.GgoememeBackend.domain.CachedPost;
import com.wap.GgoememeBackend.repository.redis.CachedPostRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;

@SpringBootTest
public class CachedPostRepositoryTest {

//    @Autowired
//    private CachedPostRepository repo;
//
//    @Test
//    void 정상값저장테스트(){
//        CachedPost cachedPost = new CachedPost("1","test", new ArrayList<>());
//
//        repo.save(cachedPost);
//
//        Assertions.assertEquals(true,repo.findById(cachedPost.getId()).isPresent());
//
//        repo.delete(cachedPost);
//    }


}
