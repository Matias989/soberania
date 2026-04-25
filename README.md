# soberania

## Modo mantenimiento (Railway)

El servidor soporta una variable de entorno para activar una pantalla de mantenimiento:

- `MAINTENANCE_MODE=true` (tambien funciona con `1`, `yes`, `on`) activa mantenimiento.
- `MAINTENANCE_MODE=false` o variable ausente mantiene el sitio normal.

Cuando el mantenimiento esta activo:

- Todas las rutas responden con `maintenance.html`.
- El servidor responde con status HTTP `503`.
- Se envian encabezados `Cache-Control: no-store`.

### Configuracion en Railway

1. Ir al servicio en Railway.
2. Abrir **Variables**.
3. Crear o editar `MAINTENANCE_MODE`.
4. Poner `true` para activar o `false` para desactivar.
5. Guardar cambios y redeploy automatico.
