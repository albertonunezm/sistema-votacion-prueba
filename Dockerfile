# Utiliza una imagen oficial de PHP 8.2 con Apache
FROM php:8.2-apache

# Instala MySQL
RUN apt-get update \
    && apt-get install -y default-mysql-client \
    && rm -rf /var/lib/apt/lists/*

# Instala las extensiones necesarias para MySQL
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Instala Apache
RUN apt-get install -y apache2

# Configura Apache
RUN a2enmod rewrite
RUN chown -R www-data:www-data /var/www/html

# Copia el código fuente de la aplicación a /var/www/html
COPY . /var/www/html

# Copia el script de inicialización personalizado (entrypoint.sh)
COPY docker/entrypoint.sh /entrypoint.sh

# Concede permisos de ejecución al script
RUN chmod +x /entrypoint.sh

# Exponer el puerto 80
EXPOSE 80

# Establece el script de entrada personalizado
ENTRYPOINT ["/entrypoint.sh"]
