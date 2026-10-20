package com.emotion.repository;

import com.emotion.model.Cliente;
import org.springframework.jdbc.core.*;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/** Acceso a datos de clientes mediante JDBC. */
@Repository
public class ClienteRepository {
    private final JdbcTemplate jdbc;
    public ClienteRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    private static final RowMapper<Cliente> MAPPER = (rs, i) -> new Cliente(
        rs.getLong("id"), rs.getString("nombre"), rs.getString("email"), rs.getString("password_hash"),
        rs.getString("telefono"), rs.getString("direccion"), rs.getString("rol"));

    public Optional<Cliente> findByEmail(String email) {
        return jdbc.query("SELECT * FROM clientes WHERE email = ?", MAPPER, email).stream().findFirst();
    }
    public Optional<Cliente> findById(long id) {
        return jdbc.query("SELECT * FROM clientes WHERE id = ?", MAPPER, id).stream().findFirst();
    }
    public void insert(Cliente c) {
        jdbc.update("INSERT INTO clientes (nombre,email,password_hash,telefono,direccion) VALUES (?,?,?,?,?)",
            c.nombre(), c.email(), c.passwordHash(), c.telefono(), c.direccion());
    }
    public int update(long id, String nombre, String telefono, String direccion) {
        return jdbc.update("UPDATE clientes SET nombre=?, telefono=?, direccion=? WHERE id=?", nombre, telefono, direccion, id);
    }
    public int delete(long id) { return jdbc.update("DELETE FROM clientes WHERE id=?", id); }
}