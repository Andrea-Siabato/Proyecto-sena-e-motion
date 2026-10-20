CREATE DATABASE IF NOT EXISTS emotion_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE emotion_db;

-- 1. Tabla de Clientes / Usuarios
CREATE TABLE IF NOT EXISTS clientes (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre        VARCHAR(100) NOT NULL,
    email         VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    telefono      VARCHAR(20),
    direccion     VARCHAR(200),
    rol           ENUM('CLIENTE', 'ADMIN') DEFAULT 'CLIENTE',
    creado_en     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Productos (Scooters y E-Bikes)
CREATE TABLE IF NOT EXISTS productos (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(120) NOT NULL,
    tipo        ENUM('SCOOTER', 'EBIKE') NOT NULL,
    descripcion TEXT,
    precio_cop  DECIMAL(12,0) NOT NULL CHECK (precio_cop >= 0),
    stock       INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    imagen_url  VARCHAR(300),
    activo      BOOLEAN DEFAULT TRUE
);

-- 3. Tabla de Carrito de Compras por Cliente
CREATE TABLE IF NOT EXISTS carrito_items (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    cliente_id  BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    cantidad    INT NOT NULL DEFAULT 1 CHECK (cantidad > 0),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- 4. Tabla de Pedidos / Compras realizadas
CREATE TABLE IF NOT EXISTS pedidos (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    cliente_id  BIGINT NOT NULL,
    total_cop   DECIMAL(12,0) NOT NULL,
    estado      VARCHAR(50) DEFAULT 'PENDIENTE',
    creado_en   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- 5. Detalle de los productos dentro de cada pedido
CREATE TABLE IF NOT EXISTS detalles_pedido (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    pedido_id           BIGINT NOT NULL,
    producto_id         BIGINT NOT NULL,
    cantidad            INT NOT NULL,
    precio_unitario_cop DECIMAL(12,0) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- ==========================================
-- DATOS DE PRUEBA (SEED DATA)
-- ==========================================

-- Insertar un cliente de prueba (Password por defecto en texto plano o hash según manejes)
INSERT INTO clientes (id, nombre, email, password_hash, telefono, direccion, rol) VALUES
(1, 'Carlos Mendoza', 'carlos.mendoza@gmail.com', 'Password123!', '+573104567890', 'Calle 100 # 15-20, Bogotá', 'CLIENTE');

-- Insertar productos iniciales (Scooters y E-Bikes en COP)
INSERT INTO productos (id, nombre, tipo, descripcion, precio_cop, stock, imagen_url) VALUES
(1, 'Scooter Pro Thunder NIU', 'SCOOTER', 'Scooter eléctrico de alta potencia ideal para la topografía urbana.', 3200000, 8, '/img/scooter-1.svg'),
(2, 'E-Bike City Commuter Specialized', 'EBIKE', 'Bicicleta eléctrica asistida para movilidad rápida y ecológica en la ciudad.', 4800000, 5, '/img/ebike-1.svg'),
(3, 'Scooter Urban Lite Xiaomi', 'SCOOTER', 'Modelo ultraligero y plegable para desplazamientos diarios.', 1850000, 12, '/img/scooter-2.svg'),
(4, 'E-Bike All-Terrain X Trek', 'EBIKE', 'Potencia superior y suspensión doble para trayectos exigentes.', 6500000, 4, '/img/ebike-2.svg');