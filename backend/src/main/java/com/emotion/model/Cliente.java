package com.emotion.model;

/** Cliente. passwordHash nunca se expone al frontend (ver ClienteController). */
public record Cliente(Long id, String nombre, String email, String passwordHash,
                      String telefono, String direccion, String rol) {}