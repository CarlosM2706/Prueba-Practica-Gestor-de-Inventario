using Prueba_Practica.Entities;

namespace Prueba_Practica.DataAccess.Repositories
{
    public interface IPrestamoRepository : IGenericRepository<Prestamo>
    {
        Task<IEnumerable<Prestamo>> GetAllAsync();
        Task<Prestamo?> GetWithUsuarioArticuloAsync(int id);
        Task<IEnumerable<Prestamo>> GetByUsuarioAsync(int usuarioId);
       
    }
}
