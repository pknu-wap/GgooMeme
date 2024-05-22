package com.wap.GgoememeBackend.repository.redis;

import com.wap.GgoememeBackend.domain.CachedPost;
import org.springframework.data.repository.CrudRepository;

public interface CachedPostRepository extends CrudRepository<CachedPost,String> {
}
