using Microsoft.EntityFrameworkCore;
using Prueba_Practica.Entities;

namespace Prueba_Practica.DataAccess.Repositories
{
    public class MultaRepository : GenericRepository<Multa>, IMultaRepository
    {
        public MultaRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Multa>> GetMultasConPrestamoAsync()
        {
            return await _dbSet
                .Include(m => m.Prestamo)
                    .ThenInclude(p => p.Usuario)
                .Include(m => m.Prestamo)
                    .ThenInclude(p => p.Articulo)
                .ToListAsync();
        }

        public async Task<IEnumerable<Multa>> GetMultasPorUsuarioAsync(int usuarioId)
        {
            return await _dbSet
                .Include(m => m.Prestamo)
                    .ThenInclude(p => p.Usuario)
                .Include(m => m.Prestamo)
                    .ThenInclude(p => p.Articulo)
                .Where(m => m.Prestamo.UsuarioId == usuarioId)
                .ToListAsync();
        }
    }
}
