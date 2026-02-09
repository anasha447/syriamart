package com.syriamart.commercial;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
@EnableFeignClients
public class CommercialServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(CommercialServiceApplication.class, args);
    }

}
