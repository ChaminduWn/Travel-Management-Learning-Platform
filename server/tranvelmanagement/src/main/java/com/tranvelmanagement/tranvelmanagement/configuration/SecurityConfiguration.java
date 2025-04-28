package com.tranvelmanagement.tranvelmanagement.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable() // Disable CSRF for testing purposes (you can configure it later)
            .authorizeRequests(auth -> auth
                .requestMatchers("/api/register", "/api/login").permitAll() // Allow these endpoints to be accessed without authentication
                .anyRequest().authenticated() // Require authentication for other requests
            )
            .httpBasic(Customizer.withDefaults()); // For simple HTTP Basic Authentication (can be replaced with JWT/Auth later)

        return http.build();
    }
}
