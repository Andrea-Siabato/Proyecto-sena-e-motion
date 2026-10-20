package com.emotion.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

/** Consume una API externa gratuita (sin API key) para obtener COP por 1 USD. */
@Service
public class TasaCambioService {
    private final RestTemplate http;
    public TasaCambioService(RestTemplate http) { this.http = http; }

    @SuppressWarnings("unchecked")
    public double copPorUsd() {
        try {
            Map<String, Object> r = http.getForObject("https://open.er-api.com/v6/latest/USD", Map.class);
            return ((Number) ((Map<String, Object>) r.get("rates")).get("COP")).doubleValue();
        } catch (Exception e) {
            return 4000.0; // respaldo si la API externa falla
        }
    }
}