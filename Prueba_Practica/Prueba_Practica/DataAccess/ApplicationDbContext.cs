using Microsoft.EntityFrameworkCore;
using Prueba_Practica.Entities;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace Prueba_Practica.DataAccess
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Rol> Roles { get; set; }
        public DbSet<Articulo> Articulos { get; set; }
        public DbSet<Prestamo> Prestamos { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Estado> Estados { get; set; }
        public DbSet<Multa> Multas { get; set; }


    }
}

