package com.emotion.repository;

import com.emotion.model.CarritoItem;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

/** Acceso a datos del carrito mediante JDBC. */
@Repository
public class CarritoRepository {
    private final JdbcTemplate jdbc;
    public CarritoRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    public List<CarritoItem> findByCliente(long clienteId) {
        return jdbc.query("""
            SELECT p.id, p.nombre, p.imagen_url, p.precio_cop, c.cantidad, p.stock
            FROM carrito_items c JOIN productos p ON p.id = c.producto_id
            WHERE c.cliente_id = ?""",
            (rs, i) -> new CarritoItem(rs.getLong("id"), rs.getString("nombre"), rs.getString("imagen_url"),
                rs.getBigDecimal("precio_cop"), rs.getInt("cantidad"), rs.getInt("stock")),
            clienteId);
    }

    /** UPSERT: si el producto ya esta en el carrito, suma la cantidad. */
    public void agregar(long clienteId, long productoId, int cantidad) {
        jdbc.update("""
            INSERT INTO carrito_items (cliente_id, producto_id, cantidad) VALUES (?,?,?)
            ON DUPLICATE KEY UPDATE cantidad = cantidad + VALUES(cantidad)""", clienteId, productoId, cantidad);
    }
    public void actualizarCantidad(long clienteId, long productoId, int cantidad) {
        jdbc.update("UPDATE carrito_items SET cantidad=? WHERE cliente_id=? AND producto_id=?", cantidad, clienteId, productoId);
    }
    public void eliminar(long clienteId, long productoId) {
        jdbc.update("DELETE FROM carrito_items WHERE cliente_id=? AND producto_id=?", clienteId, productoId);
    }
    public void vaciar(long clienteId) { jdbc.update("DELETE FROM carrito_items WHERE cliente_id=?", clienteId); }
}