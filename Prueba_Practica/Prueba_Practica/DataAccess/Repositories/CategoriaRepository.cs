using Microsoft.EntityFrameworkCore;
using Prueba_Practica.Entities;

namespace Prueba_Practica.DataAccess.Repositories
{
    public class CategoriaRepository : ICategoriaRepository
    {
        private readonly ApplicationDbContext _context;

        public CategoriaRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Categoria>> GetCategoriasAsync()
        {
            return await _context.Categorias.ToListAsync();
        }

        public async Task AgregarCategoriaAsync(Categoria categoria)
        {
            _context.Categorias.Add(categoria);
            await _context.SaveChangesAsync();
        }
    }
}
