Comando docker build platform amd64:
With cache:
```
docker build --platform linux/amd64 --load -t josetejada110/laravel_react_starter_kit:latest --push .
```
Without cache:
```
docker build --platform linux/amd64 --load -t josetejada110/laravel_react_starter_kit:latest --push --no-cache .
```
José Tejada

Poner orden de carpetas como lo tenemos en el menu (financieros/contabilidad/nomina/administracion)
definir carpetas de registros no especiales

buscar las rutas desde una tabla (analizarlo bien)

actualizar metodo para JSON

# Pedido por Luis Manuel 28/05/2025 11:38 A:M
quitar ese orden de las carpetas dejar registros solamente sin modulos

# Pedido por Luis Manuel 28/05/2025 11:47 A:M
Cambiar el header y el footer de los modales en los registros genericos, que sea medio verde

Usar estos colores para:
Cerrar:  #6c757d Gris
Borrar:  #dc3545 Rojo
Limpiar: #fd7e14 Limpiar

Procedimiento:
    p_traer_encabezado_registros para hacer el formulario para los registros

