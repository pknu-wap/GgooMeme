package com.wap.GgoememeBackend;

import com.wap.GgoememeBackend.domain.AuthProvider;
import com.wap.GgoememeBackend.domain.CachedUser;
import com.wap.GgoememeBackend.repository.redis.CachedUserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;

@SpringBootTest
public class CachedUserRepositoryTest {

    @Autowired
    private CachedUserRepository repo;

    @Test
    void 정상값저장테스트() {
        CachedUser cachedUser = new CachedUser(1L, "이채린", "lcl8661@gmail.com", "https://lh3.googleusercontent.com/a/ACg8ocK8s0zbZgNWzw8F9MbvqZlKMGAfUjXlsnluEezFSiJ9Zn-MiBwK=s96-c", new ArrayList<>(), "8661lcllcl", "109253574579197183232", AuthProvider.google);

        repo.save(cachedUser);

        CachedUser retrievedUser = repo.findById(String.valueOf(cachedUser.getId())).orElse(null);
        Assertions.assertNotNull(retrievedUser);

        repo.delete(cachedUser);
    }
}
