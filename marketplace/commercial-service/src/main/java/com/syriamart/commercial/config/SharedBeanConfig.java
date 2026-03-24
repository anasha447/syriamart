package com.syriamart.commercial.config;

import com.syriamart.common.security.JwtAuthenticationFilter;
import com.syriamart.common.security.JwtUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Instantiates shared beans from common-lib that Spring cannot auto-detect
 * because common-lib is not a Spring Boot application (no @SpringBootApplication).
 */
@Configuration
public class SharedBeanConfig {

    @Bean
    public JwtUtils jwtUtils() {
        return new JwtUtils();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(JwtUtils jwtUtils) {
        return new JwtAuthenticationFilter(jwtUtils);
    }
}
