using Microsoft.EntityFrameworkCore;
using Prueba_Practica.Business.Interfaces;
using Prueba_Practica.DataAccess.Repositories;
using Prueba_Practica.Entities;

namespace Prueba_Practica.Business.Services
{
    public class PrestamoService : IPrestamoService
    {
        private readonly IPrestamoRepository _repo;
        private readonly IArticuloRepository _articuloRepo;

        public PrestamoService(IPrestamoRepository repo, IArticuloRepository articuloRepo)
        {
            _repo = repo;
            _articuloRepo = articuloRepo;
        }

        public async Task<IEnumerable<Prestamo>> ListarAsync()
        {
            return await _repo.GetAllAsync();
        }

        public async Task<Prestamo?> ObtenerPorIdAsync(int id)
        {
            return await _repo.GetWithUsuarioArticuloAsync(id);
        }

        public async Task CrearAsync(Prestamo prestamo)
        {
            await _repo.AddAsync(prestamo);
            await _repo.SaveAsync();
            var articulo = await _articuloRepo.GetByIdAsync(prestamo.ArticuloId);
            if (articulo == null)
                throw new Exception("Artículo no encontrado");

            articulo.EstadoId = (int)Estado.Estados.Prestado; 
            await _articuloRepo.SaveAsync();
        }

        public async Task EditarAsync(Prestamo prestamo)
        {
            _repo.Update(prestamo);
            await _repo.SaveAsync();
        }

        public async Task EliminarAsync(int id)
        {
            var prestamo = await _repo.GetByIdAsync(id);
            if (prestamo != null)
            {
                _repo.Remove(prestamo);
                await _repo.SaveAsync();
            }
        }

        public async Task<IEnumerable<Prestamo>> BuscarPorUsuarioAsync(int usuarioId)
        {
            return await _repo.GetByUsuarioAsync(usuarioId);
        }

        public async Task MarcarComoDevueltoAsync(int prestamoId)
        {
            var context = (_repo as PrestamoRepository)?.Context;
            if (context == null)
                throw new InvalidOperationException("No se puede acceder al contexto");
            await context.Database.ExecuteSqlRawAsync(
                "UPDATE Prestamos SET FechaDevolucion = GETDATE() WHERE Id = {0}", prestamoId);
        }
    }
}
