# =================================================================
# Setup Dockerfile Args
# =================================================================
# Definir un argumento para el entorno (por defecto "production")
ARG APP_ENV=production
ARG OPCACHE_DEFAULT=1

# =================================================================
# Stage 1: Frontend assets compilation
# =================================================================
FROM node:20-alpine AS static-assets

ARG APP_ENV
RUN echo "APP_ENV is set to $APP_ENV"

WORKDIR /app
COPY package*.json vite.config.ts ./


RUN npm ci

COPY . .
RUN npm run build


# =================================================================
# Final Stage: Production image
# =================================================================
FROM serversideup/php:8.3-fpm-nginx AS production-image

ARG APP_ENV
ARG OPCACHE_DEFAULT

USER root

# Instalar extensiones php adicionales necesarias
RUN install-php-extensions exif gd redis

# Usar el argumento para asignar la variable de entorno
ENV PHP_OPCACHE_ENABLE=${OPCACHE_DEFAULT}

# Mostrar valores para depurar
# RUN echo "APP_ENV is set to $APP_ENV" && \
#     echo "PHP_OPCACHE_ENABLE is set to $PHP_OPCACHE_ENABLE"

# Copy frontend assets compilation from previous stage
COPY --from=static-assets --chown=www-data:www-data /app/public/build ./public/build

# Copy application source code
COPY --chown=www-data:www-data composer.json composer.lock ./
COPY --chown=www-data:www-data app ./app
COPY --chown=www-data:www-data bootstrap ./bootstrap
COPY --chown=www-data:www-data config ./config
COPY --chown=www-data:www-data database ./database
COPY --chown=www-data:www-data public ./public
COPY --chown=www-data:www-data routes ./routes
COPY --chown=www-data:www-data storage ./storage
COPY --chown=www-data:www-data resources ./resources
COPY --chown=www-data:www-data artisan artisan


RUN if [ "$APP_ENV" = "production" ]; then \
      composer install --no-interaction --optimize-autoloader --no-dev; \
    else \
      composer install --no-interaction --optimize-autoloader; \
    fi

# Switch to non-root user
USER www-data
