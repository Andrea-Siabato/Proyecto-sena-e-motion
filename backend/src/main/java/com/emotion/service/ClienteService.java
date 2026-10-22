package com.emotion.service;

import com.emotion.model.Cliente;
import com.emotion.repository.ClienteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/** Reglas de negocio de cuentas: registro y autenticacion. */
@Service
public class ClienteService {
    private final ClienteRepository repo;
    private final BCryptPasswordEncoder encoder;
    public ClienteService(ClienteRepository repo, BCryptPasswordEncoder encoder) { this.repo = repo; this.encoder = encoder; }

    public void registrar(String nombre, String email, String password, String telefono, String direccion) {
        if (repo.findByEmail(email).isPresent())
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El correo ya está registrado");
        repo.insert(new Cliente(null, nombre, email, encoder.encode(password), telefono, direccion, "CLIENTE"));
    }

    public Cliente login(String email, String password) {
        return repo.findByEmail(email)
            .filter(c -> encoder.matches(password, c.passwordHash()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas"));
    }

    public void actualizarPassword(Long id, String nuevaPassword) {
        int filas = repo.updatePassword(id, encoder.encode(nuevaPassword));
        if (filas == 0)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente no encontrado");
    }
}