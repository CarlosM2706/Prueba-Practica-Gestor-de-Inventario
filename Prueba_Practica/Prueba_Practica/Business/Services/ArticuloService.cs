using Prueba_Practica.Business.Interfaces;
using Prueba_Practica.DataAccess.Repositories;
using Prueba_Practica.Entities;

namespace Prueba_Practica.Business.Services
{
    public class ArticuloService : IArticuloService
    {
        private readonly IArticuloRepository _repo;


        public ArticuloService(IArticuloRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<Articulo>> ListarAsync()
        {
            return await _repo.GetAllWithCategoriaEstadoAsync();
        }

        public async Task<Articulo?> ObtenerPorIdAsync(int id)
        {
            return await _repo.GetWithCategoriaEstadoAsync(id);
        }

        public async Task CrearAsync(Articulo articulo)
        {
            var existe = await _repo.ExistsByCodigoAsync(articulo.Codigo);
            if (existe)
                throw new Exception("El código ya está registrado.");
            if (articulo.EstadoId == 0)
                articulo.EstadoId = 1;

            await _repo.AddAsync(articulo);
            await _repo.SaveAsync();
        }


        public async Task EditarAsync(Articulo articulo)
        {
            _repo.Update(articulo);
            await _repo.SaveAsync();
        }

        public async Task EliminarAsync(int id)
        {
            var articulo = await _repo.GetByIdAsync(id);
            if (articulo != null)
            {
                _repo.Remove(articulo);
                await _repo.SaveAsync();
            }
        }

        public async Task<IEnumerable<Articulo>> BuscarDisponiblesAsync()
        {
            return await _repo.GetDisponiblesAsync();
        }

    }
}
