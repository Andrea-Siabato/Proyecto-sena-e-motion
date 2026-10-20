package com.emotion.controller;

import com.emotion.model.Producto;
import com.emotion.repository.ProductoRepository;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

/** CRUD del inventario de scooters y e-bikes. */
@RestController @RequestMapping("/api/productos")
public class ProductoController {
    private final ProductoRepository repo;
    public ProductoController(ProductoRepository repo) { this.repo = repo; }

    @GetMapping public List<Producto> listar() { return repo.findAllActivos(); }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtener(@PathVariable long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Long> crear(@Valid @RequestBody Producto p) { return Map.of("id", repo.insert(p)); }

    @PutMapping("/{id}")
    public ResponseEntity<Void> actualizar(@PathVariable long id, @Valid @RequestBody Producto p) {
        return repo.update(id, p) > 0 ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable long id) {
        return repo.desactivar(id) > 0 ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}