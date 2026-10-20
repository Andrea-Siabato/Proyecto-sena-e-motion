package com.emotion.model;

import java.math.BigDecimal;

/** Proyeccion del carrito ya unida con el producto, lista para pintar en la UI. */
public record CarritoItem(Long productoId, String nombre, String imagenUrl,
                          BigDecimal precioCop, int cantidad, int stockDisponible) {}