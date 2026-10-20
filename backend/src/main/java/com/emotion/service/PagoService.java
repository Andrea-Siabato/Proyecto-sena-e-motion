package com.emotion.service;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.UUID;

/** Pasarela de pago SIMULADA. Reemplazable por Wompi / PayU / Mercado Pago sin tocar el resto. */
@Service
public class PagoService {
    public record Resultado(boolean aprobado, String referencia) {}

    public Resultado procesar(BigDecimal totalCop, String numeroTarjeta) {
        boolean ok = numeroTarjeta != null && !numeroTarjeta.isBlank() && !numeroTarjeta.endsWith("0000");
        return new Resultado(ok, "SIM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
    }
}