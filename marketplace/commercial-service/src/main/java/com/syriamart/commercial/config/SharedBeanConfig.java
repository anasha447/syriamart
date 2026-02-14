package com.syriamart.commercial.config;

import com.syriamart.common.security.JwtUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SharedBeanConfig {

    @Bean
    public JwtUtils jwtUtils() {return new JwtUtils(); // Manually creating the bean from common-lib
    }
}