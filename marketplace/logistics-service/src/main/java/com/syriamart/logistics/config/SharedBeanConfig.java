package com.syriamart.logistics.config;

import com.syriamart.common.security.JwtUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SharedBeanConfig {

    @Bean
    public JwtUtils jwtUtils() {
        return new JwtUtils();
    }
}