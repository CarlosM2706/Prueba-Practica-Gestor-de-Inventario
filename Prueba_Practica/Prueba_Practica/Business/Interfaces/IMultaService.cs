using Prueba_Practica.Entities;

namespace Prueba_Practica.Business.Interfaces
{
    public interface IMultaService
    {
        Task<IEnumerable<Multa>> ListarMultasAsync();
        Task<Multa?> ObtenerMultaPorIdAsync(int id);
        Task<bool> ActualizarMultaAsync(Multa multa);
    }
}
