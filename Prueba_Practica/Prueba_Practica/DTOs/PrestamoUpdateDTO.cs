namespace Prueba_Practica.DTOs
{
    public class PrestamoUpdateDTO
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public int ArticuloId { get; set; }
        public DateTime FechaSolicitud { get; set; }
        public DateTime FechaEntrega { get; set; }
        public DateTime? FechaDevolucion { get; set; }
        public string Estado { get; set; } = string.Empty;
    }

}
