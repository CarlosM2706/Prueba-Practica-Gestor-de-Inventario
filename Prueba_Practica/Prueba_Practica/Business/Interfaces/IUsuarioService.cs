using Prueba_Practica.Entities;

namespace Prueba_Practica.Business.Interfaces
{
    public interface IUsuarioService
    {
        Task<Usuario?> LoginAsync(string email, string password);
        Task<bool> RegistrarAsync(string nombre, string email, string password);
        
        Task<List<Usuario>> ObtenerUsuariosAsync();

    }
}
