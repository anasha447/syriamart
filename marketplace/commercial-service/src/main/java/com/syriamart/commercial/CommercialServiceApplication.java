package com.syriamart.commercial;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication(scanBasePackages = {"com.syriamart.commercial", "com.syriamart.common"})
public class CommercialServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(CommercialServiceApplication.class, args);
    }
}
