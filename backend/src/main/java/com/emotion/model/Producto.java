package com.emotion.model;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

/** Vehiculo electrico del inventario. Precio siempre en COP. */
public record Producto(
    Long id,
    @NotBlank String nombre,
    @NotBlank String tipo,                 // SCOOTER | EBIKE
    String descripcion,
    @NotNull @PositiveOrZero BigDecimal precioCop,
    @PositiveOrZero int stock,
    String imagenUrl,
    boolean activo) {}