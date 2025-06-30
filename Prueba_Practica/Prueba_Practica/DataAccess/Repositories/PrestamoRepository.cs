using Microsoft.EntityFrameworkCore;
using Prueba_Practica.Entities;

namespace Prueba_Practica.DataAccess.Repositories
{
    public class PrestamoRepository : GenericRepository<Prestamo>, IPrestamoRepository
    {
        public PrestamoRepository(ApplicationDbContext context) : base(context) { }
        public ApplicationDbContext Context => _context;
        public async Task<Prestamo?> GetWithUsuarioArticuloAsync(int id)
        {
            return await _dbSet
                .Include(p => p.Usuario)
                .Include(p => p.Articulo)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Prestamo>> GetAllAsync()
        {
            return await _context.Prestamos
                .Include(p => p.Usuario)
                .Include(p => p.Articulo)
                .ToListAsync();
        }

        public async Task<IEnumerable<Prestamo>> GetByUsuarioAsync(int usuarioId)
        {
            return await _dbSet
                .Include(p => p.Usuario)
                .Include(p => p.Articulo)
                .Where(p => p.UsuarioId == usuarioId)
                .ToListAsync();
        }
    }
}