package com.emotion.controller;

import com.emotion.service.TasaCambioService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

/** Expone la tasa COP/USD (API externa) para mostrar el equivalente en dolares. */
@RestController @RequestMapping("/api/tasa")
public class TasaController {
    private final TasaCambioService tasa;
    public TasaController(TasaCambioService t) { this.tasa = t; }

    @GetMapping public Map<String, Double> get() { return Map.of("copPorUsd", tasa.copPorUsd()); }
}