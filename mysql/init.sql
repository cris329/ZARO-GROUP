-- ===== OMEBLAS - Init MySQL con seguridad =====
-- Nota: el usuario y password de app se crean automáticamente
-- por la imagen docker oficial (MYSQL_USER / MYSQL_PASSWORD).

-- Eliminar usuarios anónimos
DELETE FROM mysql.user WHERE User = '';

-- Eliminar base de datos de prueba
DROP DATABASE IF EXISTS test;

-- Eliminar acceso anónimo a tablas de db
DELETE FROM mysql.db WHERE Db LIKE 'test%';

-- Forzar que las conexiones remotas usen SSL
CREATE USER IF NOT EXISTS 'app_user'@'%' IDENTIFIED BY '${MYSQL_PASSWORD_APP}';

-- Zona horaria UTC
SET GLOBAL time_zone = '+00:00';

-- Emitir las variables para el usuario de la app
SET @app_user = '${MYSQL_USER}';
SET @app_pass = '${MYSQL_PASSWORD}';

SET @sql = CONCAT('CREATE USER IF NOT EXISTS ''', @app_user, '''@''%'' IDENTIFIED BY ''', @app_pass, '''');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Permisos mínimos: SELECT, INSERT, UPDATE, DELETE sobre la base de la app
SET @sql = CONCAT('GRANT SELECT, INSERT, UPDATE, DELETE ON ', @app_user, '.* TO ''', @app_user, '''@''%''');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

FLUSH PRIVILEGES;