namespace Prueba_Practica.Entities
{
    public class Articulo
    {
        public int Id { get; set; }
        public string Codigo { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Ubicacion { get; set; } = string.Empty;

        public int CategoriaId { get; set; }
        public Categoria Categoria { get; set; } = null!;

        public int EstadoId { get; set; }
        public Estado Estado { get; set; } = null!;

        public ICollection<Prestamo> Prestamos { get; set; } = new List<Prestamo>();
    }

}
