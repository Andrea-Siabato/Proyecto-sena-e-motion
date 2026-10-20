package com.emotion.repository;

import com.emotion.model.Producto;
import org.springframework.jdbc.core.*;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Repository;
import java.sql.*;
import java.util.*;

/** Acceso a datos de productos mediante JDBC. */
@Repository
public class ProductoRepository {
    private final JdbcTemplate jdbc;
    public ProductoRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    private static final RowMapper<Producto> MAPPER = (rs, i) -> new Producto(
        rs.getLong("id"), rs.getString("nombre"), rs.getString("tipo"), rs.getString("descripcion"),
        rs.getBigDecimal("precio_cop"), rs.getInt("stock"), rs.getString("imagen_url"), rs.getBoolean("activo"));

    public List<Producto> findAllActivos() {
        return jdbc.query("SELECT * FROM productos WHERE activo = TRUE ORDER BY id DESC", MAPPER);
    }

    public Optional<Producto> findById(long id) {
        return jdbc.query("SELECT * FROM productos WHERE id = ?", MAPPER, id).stream().findFirst();
    }

    public long insert(Producto p) {
        var keys = new GeneratedKeyHolder();
        jdbc.update(con -> {
            PreparedStatement ps = con.prepareStatement(
                "INSERT INTO productos (nombre,tipo,descripcion,precio_cop,stock,imagen_url) VALUES (?,?,?,?,?,?)",
                Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, p.nombre()); ps.setString(2, p.tipo()); ps.setString(3, p.descripcion());
            ps.setBigDecimal(4, p.precioCop()); ps.setInt(5, p.stock()); ps.setString(6, p.imagenUrl());
            return ps;
        }, keys);
        return keys.getKey().longValue();
    }

    public int update(long id, Producto p) {
        return jdbc.update("UPDATE productos SET nombre=?,tipo=?,descripcion=?,precio_cop=?,stock=?,imagen_url=? WHERE id=?",
            p.nombre(), p.tipo(), p.descripcion(), p.precioCop(), p.stock(), p.imagenUrl(), id);
    }

    /** Baja logica: conserva el historial de pedidos. */
    public int desactivar(long id) { return jdbc.update("UPDATE productos SET activo=FALSE WHERE id=?", id); }

    /** Descuento atomico: solo afecta la fila si hay stock suficiente (evita sobreventa). */
    public boolean descontarStock(long id, int cantidad) {
        return jdbc.update("UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?", cantidad, id, cantidad) == 1;
    }
}