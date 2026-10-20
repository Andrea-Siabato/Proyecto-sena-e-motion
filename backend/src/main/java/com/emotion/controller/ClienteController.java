package com.emotion.controller;

import com.emotion.repository.ClienteRepository;
import com.emotion.service.ClienteService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

/** Registro, login y CRUD de la cuenta del cliente. */
@RestController 
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "http://localhost:5173")
public class ClienteController {

    public record RegistroReq(@NotBlank String nombre, @Email String email,
                             @Size(min = 8) String password, String telefono, String direccion) {}
    public record LoginReq(@Email String email, @NotBlank String password) {}
    public record PerfilReq(@NotBlank String nombre, String telefono, String direccion) {}

    private final ClienteService service;
    private final ClienteRepository repo;

    public ClienteController(ClienteService s, ClienteRepository r) { 
        this.service = s; 
        this.repo = r; 
    }

    @PostMapping("/registro") 
    @ResponseStatus(HttpStatus.CREATED)
    public void registro(@Valid @RequestBody RegistroReq r) {
        service.registrar(r.nombre(), r.email(), r.password(), r.telefono(), r.direccion());
    }

    @PostMapping("/login")
    public Map<String, Object> login(@Valid @RequestBody LoginReq r) {
        var c = service.login(r.email(), r.password());
        return Map.of(
            "id", c.id(), 
            "nombre", c.nombre(), 
            "email", c.email(), 
            "rol", c.rol(),
            "telefono", c.telefono() == null ? "" : c.telefono(),
            "direccion", c.direccion() == null ? "" : c.direccion()
        );
    }

    // Actualizar datos del perfil
    @PutMapping("/{id}")
    public ResponseEntity<Void> actualizar(@PathVariable long id, @Valid @RequestBody PerfilReq r) {
        return repo.update(id, r.nombre(), r.telefono(), r.direccion()) > 0
            ? ResponseEntity.noContent().build() 
            : ResponseEntity.notFound().build();
    }

    // Cambiar contraseña
    @PutMapping("/cambiar-password/{id}")
    public ResponseEntity<?> cambiarPassword(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String nuevaPassword = body.get("password");
        if (nuevaPassword == null || nuevaPassword.length() < 8) {
            return ResponseEntity.badRequest().body("La contraseña debe tener al menos 8 caracteres.");
        }
        // Llamamos al servicio para actualizar y encriptar la nueva contraseña
        service.actualizarPassword(id, nuevaPassword);
        return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada con éxito"));
    }

    // Eliminar / Cancelar cuenta
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable long id) {
        return repo.delete(id) > 0 
            ? ResponseEntity.noContent().build() 
            : ResponseEntity.notFound().build();
    }
}