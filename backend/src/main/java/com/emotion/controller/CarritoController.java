package com.emotion.controller;

import com.emotion.model.CarritoItem;
import com.emotion.service.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/** Carrito de compras y checkout. */
@RestController @RequestMapping("/api/carrito/{clienteId}")
public class CarritoController {
    public record CantidadReq(long productoId, int cantidad) {}
    public record PagoReq(String tarjeta) {}

    private final CarritoService service;
    public CarritoController(CarritoService s) { this.service = s; }

    @GetMapping public List<CarritoItem> listar(@PathVariable long clienteId) { return service.listar(clienteId); }

    @PostMapping
    public void agregar(@PathVariable long clienteId, @RequestBody CantidadReq r) { service.agregar(clienteId, r.productoId(), r.cantidad()); }

    @PutMapping
    public void actualizar(@PathVariable long clienteId, @RequestBody CantidadReq r) { service.actualizar(clienteId, r.productoId(), r.cantidad()); }

    @DeleteMapping("/{productoId}")
    public void eliminar(@PathVariable long clienteId, @PathVariable long productoId) { service.eliminar(clienteId, productoId); }

    @PostMapping("/checkout")
    public PagoService.Resultado checkout(@PathVariable long clienteId, @RequestBody PagoReq r) {
        return service.checkout(clienteId, r.tarjeta());
    }
}