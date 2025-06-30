using Microsoft.AspNetCore.Identity;
using Prueba_Practica.Business.Interfaces;
using Prueba_Practica.DataAccess;
using Prueba_Practica.Entities;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Generators;

namespace Prueba_Practica.Business.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly ApplicationDbContext _context;

        public UsuarioService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Usuario?> LoginAsync(string email, string password)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(u => u.Email == email);
            if (usuario == null)
                return null;
            bool passwordValida = BCrypt.Net.BCrypt.Verify(password, usuario.PasswordHash);
            return passwordValida ? usuario : null;
        }

        public async Task<bool> RegistrarAsync(string nombre, string email, string password)
        {
            bool existe = await _context.Usuarios.AnyAsync(u => u.Email == email);
            if (existe)
                return false;

            var hash = BCrypt.Net.BCrypt.HashPassword(password);

            var usuario = new Usuario
            {
                Nombre = nombre,
                Email = email,
                PasswordHash = hash,
                RolId = 2 
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Usuario>> ObtenerUsuariosAsync()
        {
            return await _context.Usuarios
                .Select(u => new Usuario { Id = u.Id, Nombre = u.Nombre }) 
                .ToListAsync();
        }
    }
}
