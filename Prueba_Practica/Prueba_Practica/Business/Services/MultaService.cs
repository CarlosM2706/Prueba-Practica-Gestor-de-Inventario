using Prueba_Practica.DataAccess.Repositories;
using Prueba_Practica.Entities;
using Prueba_Practica.Business.Interfaces;

namespace Prueba_Practica.Business.Services
{
    public class MultaService : IMultaService
    {
        private readonly IGenericRepository<Multa> _multaRepository;
        public MultaService(IGenericRepository<Multa> multaRepository)
        {
            _multaRepository = multaRepository;
        }
        public async Task<IEnumerable<Multa>> ListarMultasAsync()
        {
            return await _multaRepository.GetAllAsync();
        }
        public async Task<Multa?> ObtenerMultaPorIdAsync(int id)
        {
            return await _multaRepository.GetByIdAsync(id);
        }
        public async Task<bool> ActualizarMultaAsync(Multa multa)
        {
            try
            {
                _multaRepository.Update(multa);
                await _multaRepository.SaveAsync();
                return true;
            }
            catch{
                return false;
            }
        }
    }
}
