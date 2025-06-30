using Prueba_Practica.Entities;

namespace Prueba_Practica.Business.Interfaces
{
    public interface ICategoriaService
    {
        Task<IEnumerable<Categoria>> GetCategoriasAsync();
        Task CrearCategoriaAsync(Categoria categoria);
    }
}
