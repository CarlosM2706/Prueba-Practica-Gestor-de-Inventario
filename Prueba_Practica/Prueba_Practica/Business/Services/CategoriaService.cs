using Prueba_Practica.Business.Interfaces;
using Prueba_Practica.DataAccess.Repositories;
using Prueba_Practica.Entities;

namespace Prueba_Practica.Business.Services
{
    public class CategoriaService : ICategoriaService
    {
        private readonly ICategoriaRepository _categoriaRepository;

        public CategoriaService(ICategoriaRepository categoriaRepository)
        {
            _categoriaRepository = categoriaRepository;
        }

        public async Task<IEnumerable<Categoria>> GetCategoriasAsync()
        {
            return await _categoriaRepository.GetCategoriasAsync();
        }

        public async Task CrearCategoriaAsync(Categoria categoria)
        {
            await _categoriaRepository.AgregarCategoriaAsync(categoria);
        }
    }
}
