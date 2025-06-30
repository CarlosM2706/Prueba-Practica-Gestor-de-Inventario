using Microsoft.EntityFrameworkCore;
using Prueba_Practica.Entities;

namespace Prueba_Practica.DataAccess.Repositories
{
    public class ArticuloRepository : GenericRepository<Articulo>, IArticuloRepository
    {
        public ArticuloRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Articulo>> GetAllWithCategoriaEstadoAsync()
        {
            return await _dbSet
                .Include(a => a.Categoria)
                .Include(a => a.Estado)
                .ToListAsync();
        }

        public async Task<Articulo?> GetWithCategoriaEstadoAsync(int id)
        {
            return await _dbSet
                .Include(a => a.Categoria)
                .Include(a => a.Estado)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<IEnumerable<Articulo>> GetDisponiblesAsync()
        {
            return await _dbSet
                .Include(a => a.Estado)
                .Include(a => a.Categoria)
                .Where(a => a.Estado.Nombre == "Disponible")
                .ToListAsync();
        }

        public async Task<bool> ExistsByCodigoAsync(string codigo)
        {
            return await _dbSet.AnyAsync(a => a.Codigo == codigo);
        }

        public async Task<Articulo?> GetByIdWithEstadoAsync(int id)
        {
            return await _dbSet.Include(a => a.Estado).FirstOrDefaultAsync(a => a.Id == id);
        }
    }
}

