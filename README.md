# e-Motion - E-commerce de scooters electricos y e-bikes

Stack: React (Vite) + Spring Boot 3 (JDBC/JdbcTemplate) + MySQL (XAMPP). Precios en COP.

## Arranque
1. XAMPP: iniciar MySQL e importar `database/schema.sql` (phpMyAdmin > SQL).
2. Backend:  `cd backend && mvn spring-boot:run`   -> http://localhost:8080
3. Frontend: `cd frontend && npm install && npm run dev` -> http://localhost:5173
4. Admin: registrate en la web y ejecuta en phpMyAdmin:
   `UPDATE clientes SET rol='ADMIN' WHERE email='tu@correo.com';`
5. Pago simulado: toda tarjeta se aprueba, salvo las terminadas en 0000.