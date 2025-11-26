-- =============================================
-- Script SQL para crear la base de datos HotelTropicalDB
-- =============================================

-- Paso 1: Crear la base de datos (si no existe)
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'HotelTropicalDB')
BEGIN
    CREATE DATABASE HotelTropicalDB;
END
GO

-- Usar la base de datos
USE HotelTropicalDB;
GO

-- Paso 2: Eliminar tablas si existen (en orden inverso por las foreign keys)
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Reservas]') AND type in (N'U'))
BEGIN
    DROP TABLE [dbo].[Reservas];
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Habitaciones]') AND type in (N'U'))
BEGIN
    DROP TABLE [dbo].[Habitaciones];
END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
    DROP TABLE [dbo].[Users];
END
GO

-- Paso 3: Crear tabla Users PRIMERO
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    NombreUsuario NVARCHAR(50) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    Rol NVARCHAR(20) NOT NULL DEFAULT 'Cliente', -- 'Cliente' o 'Administrador'
    FechaCreacion DATETIME DEFAULT GETDATE()
);
GO

-- Paso 4: Crear tabla Habitaciones SEGUNDO
CREATE TABLE Habitaciones (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(500),
    Tipo NVARCHAR(50) NOT NULL, -- 'Doble', 'Suite', 'Individual'
    Precio DECIMAL(10,2) NOT NULL,
    Capacidad INT NOT NULL,
    Disponible BIT DEFAULT 1,
    ImagenUrl NVARCHAR(500)
);
GO

-- Paso 5: Crear tabla Reservas TERCERO (después de Users y Habitaciones)
CREATE TABLE Reservas (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    HabitacionId INT NOT NULL,
    NombreCompleto NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    Telefono NVARCHAR(20),
    FechaEntrada DATE NOT NULL,
    FechaSalida DATE NOT NULL,
    MetodoPago NVARCHAR(50),
    Estado NVARCHAR(20) DEFAULT 'Pendiente', -- 'Pendiente', 'Confirmada', 'Cancelada'
    Total DECIMAL(10,2),
    FechaReserva DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Reservas_Users FOREIGN KEY (UserId) REFERENCES Users(Id),
    CONSTRAINT FK_Reservas_Habitaciones FOREIGN KEY (HabitacionId) REFERENCES Habitaciones(Id)
);
GO

-- Paso 6: Insertar datos de prueba

-- Insertar usuarios de prueba
INSERT INTO Users (Nombre, NombreUsuario, Email, Password, Rol) VALUES
('Admin Principal', 'admin', 'admin@hotel.com', 'admin123', 'Administrador'),
('Juan Pérez', 'juanperez', 'juan@email.com', 'cliente123', 'Cliente'),
('María García', 'mariag', 'maria@email.com', 'cliente123', 'Cliente');
GO

-- Insertar habitaciones
INSERT INTO Habitaciones (Nombre, Descripcion, Tipo, Precio, Capacidad, Disponible) VALUES
('Habitación Doble', 'Hasta 4 personas, cama doble.', 'Doble', 150.00, 4, 1),
('Suite', 'Con vista al mar y jacuzzi.', 'Suite', 300.00, 2, 1),
('Habitación Individual', 'Ideal para una persona.', 'Individual', 80.00, 1, 1);
GO

-- Verificar que todo se creó correctamente
SELECT 'Tablas creadas exitosamente' AS Mensaje;
SELECT COUNT(*) AS TotalUsuarios FROM Users;
SELECT COUNT(*) AS TotalHabitaciones FROM Habitaciones;
SELECT COUNT(*) AS TotalReservas FROM Reservas;
GO

