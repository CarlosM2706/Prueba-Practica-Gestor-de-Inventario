using System.Text.Json.Serialization;

namespace Prueba_Practica.Entities
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public int RolId { get; set; }
        public Rol Rol { get; set; } = null!;

        [JsonIgnore]
        public ICollection<Prestamo> Prestamos { get; set; } = new List<Prestamo>();
    }
}
