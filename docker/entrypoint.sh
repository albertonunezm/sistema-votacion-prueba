#!/bin/bash

# Establecer la zona horaria
echo "America/Santiago" > /etc/timezone
dpkg-reconfigure -f noninteractive tzdata

# Espera a que MySQL esté disponible
until mysql -h"db" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e 'SELECT 1' &> /dev/null; do
  echo "Esperando a MySQL..."
  sleep 1
done

# Mensaje de registro para indicar que MySQL está listo
echo "MySQL está listo. Ejecutando script SQL..."

# Espera adicional para asegurar que MySQL esté completamente iniciado
sleep 5



# Iniciar el servidor Apache
exec apache2-foreground

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
