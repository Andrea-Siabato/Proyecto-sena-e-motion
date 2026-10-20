package com.emotion.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://localhost:5173")
public class PedidoController {

    private final JdbcTemplate jdbcTemplate;

    public PedidoController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Obtener el historial de pedidos de un cliente específico
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Map<String, Object>>> obtenerPedidosPorCliente(@PathVariable Long clienteId) {
        String sql = "SELECT p.id AS pedido_id, p.fecha, p.total, p.estado, " +
                     "dp.cantidad, dp.precio_unitario, pr.nombre AS producto_nombre " +
                     "FROM pedidos p " +
                     "LEFT JOIN detalles_pedido dp ON p.id = dp.pedido_id " +
                     "LEFT JOIN productos pr ON dp.producto_id = pr.id " +
                     "WHERE p.cliente_id = ? " +
                     "ORDER BY p.fecha DESC";

        List<Map<String, Object>> pedidos = jdbcTemplate.queryForList(sql, clienteId);
        return ResponseEntity.ok(pedidos);
    }
}