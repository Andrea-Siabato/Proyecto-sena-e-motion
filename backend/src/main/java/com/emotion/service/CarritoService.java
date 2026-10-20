package com.emotion.service;

import com.emotion.model.CarritoItem;
import com.emotion.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.util.List;

/** Logica del carrito y checkout transaccional. */
@Service
public class CarritoService {
    private final CarritoRepository carrito;
    private final ProductoRepository productos;
    private final PagoService pagos;
    private final JdbcTemplate jdbc;

    public CarritoService(CarritoRepository c, ProductoRepository p, PagoService pg, JdbcTemplate j) {
        this.carrito = c; this.productos = p; this.pagos = pg; this.jdbc = j;
    }

    public List<CarritoItem> listar(long clienteId) { return carrito.findByCliente(clienteId); }
    public void agregar(long cid, long pid, int cant) { carrito.agregar(cid, pid, cant); }
    public void actualizar(long cid, long pid, int cant) {
        if (cant <= 0) carrito.eliminar(cid, pid); else carrito.actualizarCantidad(cid, pid, cant);
    }
    public void eliminar(long cid, long pid) { carrito.eliminar(cid, pid); }

    /** Todo o nada: si falla el stock de cualquier item, se revierte la transaccion completa. */
    @Transactional
    public PagoService.Resultado checkout(long clienteId, String tarjeta) {
        List<CarritoItem> items = carrito.findByCliente(clienteId);
        if (items.isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Carrito vacío");

        BigDecimal total = items.stream()
            .map(i -> i.precioCop().multiply(BigDecimal.valueOf(i.cantidad())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        var pago = pagos.procesar(total, tarjeta);
        if (pago.aprobado()) {
            for (CarritoItem i : items)
                if (!productos.descontarStock(i.productoId(), i.cantidad()))
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Stock insuficiente: " + i.nombre());
            carrito.vaciar(clienteId);
        }
        jdbc.update("INSERT INTO pedidos (cliente_id,total_cop,estado,referencia_pago) VALUES (?,?,?,?)",
            clienteId, total, pago.aprobado() ? "PAGADO" : "RECHAZADO", pago.referencia());
        return pago;
    }
}