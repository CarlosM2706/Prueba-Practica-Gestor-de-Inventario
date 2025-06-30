using Prueba_Practica.Entities;

namespace Prueba_Practica.DataAccess.Repositories
{
    public interface IMultaRepository : IGenericRepository<Multa>
    {
        Task<IEnumerable<Multa>> GetMultasConPrestamoAsync();
        Task<IEnumerable<Multa>> GetMultasPorUsuarioAsync(int usuarioId);
    }
}
