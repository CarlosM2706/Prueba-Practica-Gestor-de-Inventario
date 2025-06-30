namespace Prueba_Practica.DTOs
{
    public class PrestamoDTO
    {
        public int Id { get; set; }

        public int UsuarioId { get; set; }
        public string UsuarioNombre { get; set; }

        public int ArticuloId { get; set; }
        public string ArticuloNombre { get; set; }

        public DateTime FechaSolicitud { get; set; }
        public DateTime FechaEntrega { get; set; }
        public DateTime? FechaDevolucion { get; set; }

        public string Estado { get; set; }
    }

}
