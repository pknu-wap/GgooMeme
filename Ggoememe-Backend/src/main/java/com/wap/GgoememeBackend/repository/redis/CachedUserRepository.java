package com.wap.GgoememeBackend.repository.redis;

import com.wap.GgoememeBackend.domain.CachedUser;
import org.springframework.data.repository.CrudRepository;

public interface CachedUserRepository extends CrudRepository<CachedUser,String> {
}
