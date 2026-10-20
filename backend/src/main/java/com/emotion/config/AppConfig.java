package com.emotion.config;

import org.springframework.context.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.*;

/** CORS y beans compartidos. */
@Configuration
public class AppConfig implements WebMvcConfigurer {

    /** Permite que React (Vite, puerto 5173) consuma la API. */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "http://127.0.0.1:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }

    /** Cliente HTTP para consumir APIs externas (tasa de cambio, pasarelas). */
    @Bean public RestTemplate restTemplate() { return new RestTemplate(); }

    /** Hash de contrasenas. */
    @Bean public BCryptPasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
}