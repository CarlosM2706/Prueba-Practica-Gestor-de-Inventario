namespace Prueba_Practica.Entities
{
    public class Prestamo
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; } = null!;
        public int ArticuloId { get; set; }
        public Articulo Articulo { get; set; } = null!;
        public DateTime FechaSolicitud { get; set; } = DateTime.Now;
        public DateTime FechaEntrega { get; set; }
        public DateTime? FechaDevolucion { get; set; }
        public string Estado { get; set; } = "Pendiente"; 
    }
}
