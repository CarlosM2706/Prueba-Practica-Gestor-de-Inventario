using Prueba_Practica.Entities;

namespace Prueba_Practica.DataAccess.Repositories
{
    public interface IArticuloRepository : IGenericRepository<Articulo>
    {
        Task<Articulo?> GetWithCategoriaEstadoAsync(int id);
        Task<IEnumerable<Articulo>> GetDisponiblesAsync();
        Task<bool> ExistsByCodigoAsync(string codigo);
        Task<IEnumerable<Articulo>> GetAllWithCategoriaEstadoAsync();
    }
}
