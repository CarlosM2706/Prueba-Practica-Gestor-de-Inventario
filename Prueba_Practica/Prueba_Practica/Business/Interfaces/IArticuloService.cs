using Prueba_Practica.Entities;

namespace Prueba_Practica.Business.Interfaces
{
    public interface IArticuloService
    {
        Task<IEnumerable<Articulo>> ListarAsync();
        Task<Articulo?> ObtenerPorIdAsync(int id);
        Task CrearAsync(Articulo articulo);
        Task EditarAsync(Articulo articulo);
        Task EliminarAsync(int id);
        Task<IEnumerable<Articulo>> BuscarDisponiblesAsync();

    }

}
