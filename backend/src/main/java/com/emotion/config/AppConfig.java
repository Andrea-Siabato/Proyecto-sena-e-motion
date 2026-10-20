package com.emotion.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.*;

/** CORS y beans compartidos. */
@Configuration
public class AppConfig implements WebMvcConfigurer {

    /** Orígenes permitidos, separados por coma. En Railway se define con APP_CORS_ORIGINS. */
    @Value("${app.cors.origins:http://localhost:5173,http://127.0.0.1:5173}")
    private String[] origins;

    /** Permite que el frontend (local o Vercel) consuma la API. */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(origins)
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }

    /** Cliente HTTP para consumir APIs externas (tasa de cambio, pasarelas). */
    @Bean public RestTemplate restTemplate() { return new RestTemplate(); }

    /** Hash de contrasenas. */
    @Bean public BCryptPasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
}