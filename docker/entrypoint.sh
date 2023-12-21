#!/bin/bash

# Establecer la zona horaria
echo "America/Santiago" > /etc/timezone
dpkg-reconfigure -f noninteractive tzdata

# Función para esperar a MySQL
wait_for_mysql() {
  echo "Esperando a que MySQL esté listo..."
  while ! mysqladmin ping -h"db" -u"$MYSQL_USER" --password="$MYSQL_PASSWORD" --silent; do
    sleep 1
    echo "Esperando a MySQL..."
  done
}

# Llamada a la función
wait_for_mysql

# Ejecutar el script SQL
mysql -h"db" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" < /docker-entrypoint-initdb.d/data.sql

# Mensaje de registro al completar la ejecución del script SQL
echo "Script SQL ejecutado exitosamente."

# Iniciar el servidor Apache
exec apache2-foreground
