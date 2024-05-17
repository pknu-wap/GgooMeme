package com.wap.GgoememeBackend;

import com.wap.GgoememeBackend.config.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;


@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class GgoememeBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(GgoememeBackendApplication.class, args);
	}

}
