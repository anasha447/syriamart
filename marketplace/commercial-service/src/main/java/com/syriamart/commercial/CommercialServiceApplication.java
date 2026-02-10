package com.syriamart.commercial;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
@EnableFeignClients
@EntityScan(basePackages = {"com.syriamart.commercial", "com.syriamart.common"})
public class CommercialServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(CommercialServiceApplication.class, args);
    }

}
