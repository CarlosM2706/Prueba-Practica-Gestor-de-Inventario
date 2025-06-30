# 📦 Sistema de Inventario con Préstamos y Multas

Este sistema permite gestionar artículos en inventario, realizar préstamos, registrar devoluciones, calcular multas por retrasos y controlar el acceso mediante login por roles (Administrador y Operador).

---

## 🗃️ Base de Datos (SQL Server)

```sql
-- Crear base de datos
CREATE DATABASE Inventario_Prueba;
GO

USE Inventario_Prueba;
GO

-- Tabla Roles
CREATE TABLE Roles (
    Id INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL UNIQUE
);

-- Tabla Usuarios
CREATE TABLE Usuarios (
    Id INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    RolId INT NOT NULL,
    CONSTRAINT FK_Usuarios_Roles FOREIGN KEY (RolId) REFERENCES Roles(Id)
);

-- Tabla Categorias
CREATE TABLE Categorias (
    Id INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL UNIQUE
);

-- Tabla Estados
CREATE TABLE Estados (
    Id INT IDENTITY PRIMARY KEY,
    Nombre NVARCHAR(50) NOT NULL UNIQUE
);

-- Tabla Articulos
CREATE TABLE Articulos (
    Id INT IDENTITY PRIMARY KEY,
    Codigo NVARCHAR(50) NOT NULL UNIQUE,
    Nombre NVARCHAR(150) NOT NULL,
    CategoriaId INT NOT NULL,
    EstadoId INT NOT NULL,
    Ubicacion NVARCHAR(100),
    CONSTRAINT FK_Articulos_Categorias FOREIGN KEY (CategoriaId) REFERENCES Categorias(Id),
    CONSTRAINT FK_Articulos_Estados FOREIGN KEY (EstadoId) REFERENCES Estados(Id)
);

-- Tabla Prestamos
CREATE TABLE Prestamos (
    Id INT IDENTITY PRIMARY KEY,
    UsuarioId INT NOT NULL,
    ArticuloId INT NOT NULL,
    FechaSolicitud DATETIME2 NOT NULL DEFAULT GETDATE(),
    FechaEntrega DATETIME2 NOT NULL,
    FechaDevolucion DATETIME2 NULL,
    Estado NVARCHAR(50) NOT NULL,
    CONSTRAINT FK_Prestamos_Usuarios FOREIGN KEY (UsuarioId) REFERENCES Usuarios(Id),
    CONSTRAINT FK_Prestamos_Articulos FOREIGN KEY (ArticuloId) REFERENCES Articulos(Id)
);

-- Tabla Multas
CREATE TABLE Multas (
    Id INT IDENTITY PRIMARY KEY,
    PrestamoId INT FOREIGN KEY REFERENCES Prestamos(Id),
    Monto DECIMAL(10,2),
    Pagado BIT DEFAULT 0
);
```
## 🎯 Trigger para controlar devolución, estado y multas
```sql
CREATE OR ALTER TRIGGER trg_AfterUpdate_Prestamo_Devolucion
ON Prestamos
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Cambia estado del préstamo a 'Devuelto'
    UPDATE P
    SET P.Estado = 'Devuelto'
    FROM Prestamos P
    INNER JOIN inserted I ON P.Id = I.Id
    INNER JOIN deleted D ON D.Id = I.Id
    WHERE I.FechaDevolucion IS NOT NULL AND D.FechaDevolucion IS NULL;

    -- Cambia estado del artículo a 'Disponible'
    UPDATE A
    SET A.EstadoId = 1
    FROM Articulos A
    INNER JOIN inserted I ON A.Id = I.ArticuloId
    INNER JOIN deleted D ON D.Id = I.Id
    WHERE I.FechaDevolucion IS NOT NULL AND D.FechaDevolucion IS NULL;

    -- Inserta multa si devolvió tarde
    INSERT INTO Multas (PrestamoId, Monto, Pagado)
    SELECT 
        I.Id,
        DATEDIFF(DAY, I.FechaEntrega, I.FechaDevolucion) * 5.0,
        0
    FROM inserted I
    INNER JOIN deleted D ON D.Id = I.Id
    WHERE 
        I.FechaDevolucion IS NOT NULL 
        AND D.FechaDevolucion IS NULL
        AND I.FechaDevolucion > I.FechaEntrega;
END;
```
---
## 🔑 Funcionalidad del Sistema

## 1. Login y Roles
  
Los usuarios deben iniciar sesión con correo y contraseña.

Dependiendo del rol:

Administrador: puede ver, editar y eliminar todo.

Operador: puede registrar y devolver préstamos, ver artículos.

## 2. Gestión de Artículos
Los artículos tienen:

Nombre, código único, categoría, estado, ubicación.

Los estados pueden ser: Disponible, Prestado, Dañado, etc.

## 3. Préstamos
Se pueden registrar nuevos préstamos con fecha límite.

El estado por defecto es "Pendiente".

Cuando el préstamo se aprueba, el artículo pasa a estado "Prestado".

## 4. Devoluciones y Multas
Al marcar una devolución:

Se registra la FechaDevolucion.

Se actualiza automáticamente el estado del préstamo a "Devuelto".

El artículo vuelve a estado "Disponible".

Si la devolución es tardía, se genera una multa automática.

## 📊 Consultas Útiles
```sql
-- Ver estado y devolución de un préstamo
SELECT Estado, FechaDevolucion FROM Prestamos WHERE Id = 4;

-- Ver estado de un artículo
SELECT EstadoId FROM Articulos WHERE Id = 1;

-- Ver multas generadas
SELECT * FROM Multas WHERE PrestamoId = 4;
```
---
## ✅ Recomendaciones

Seguridad
---
Utilizar JWT para autenticación segura.

Validar datos en backend y frontend.

Implementar cierre de sesión automático tras inactividad.

UX/UI
---
Reemplazar alert() por librerías como SweetAlert2.

Mostrar errores de formulario en campo (UX friendly).

Usar spinners o loaders al interactuar con la API.

Código
---
Modularizar código JS en archivos separados.

Evitar duplicación de funciones como cargarArticulos.

Usar buenas prácticas de nomenclatura y DRY.

Funcionalidad futura sugerida
---
📅 Calendario de disponibilidad.

📢 Notificaciones por vencimiento.

📈 Dashboard con estadísticas.

📷 Subida de imágenes por artículo.

## 🚀 Cómo Ejecutar el Proyecto

Restaurar base de datos en SQL Server con el script de arriba.

Configurar conexión en tu archivo backend (.NET Core / Node / etc.).

Levantar el servidor y frontend (puede ser HTML + JS o SPA).

Crear al menos un usuario administrador manualmente para iniciar sesión.

## 👨‍💻 Autor
Este proyecto fue desarrollado como solución a un sistema de préstamos y control de inventario, enfocado en registrar estados y manejar multas automáticamente vía triggers SQL.


