using Prueba_Practica.Entities;

namespace Prueba_Practica.Business.Interfaces
{
    public interface IPrestamoService
    {
        Task<IEnumerable<Prestamo>> ListarAsync();
        Task<Prestamo?> ObtenerPorIdAsync(int id);
        Task CrearAsync(Prestamo prestamo);
        Task EditarAsync(Prestamo prestamo);
        Task EliminarAsync(int id);
        Task<IEnumerable<Prestamo>> BuscarPorUsuarioAsync(int usuarioId);
       
        Task MarcarComoDevueltoAsync(int prestamoId);

    }
}
