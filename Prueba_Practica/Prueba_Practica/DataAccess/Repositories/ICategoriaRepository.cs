using Prueba_Practica.Entities;

namespace Prueba_Practica.DataAccess.Repositories
{
    public interface ICategoriaRepository
    {
        Task<IEnumerable<Categoria>> GetCategoriasAsync();
        Task AgregarCategoriaAsync(Categoria categoria);
    }
}
