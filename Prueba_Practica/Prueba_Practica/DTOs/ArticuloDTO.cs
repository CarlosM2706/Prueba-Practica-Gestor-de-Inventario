namespace Prueba_Practica.DTOs
{
    public class ArticuloDTO
    {
        public string Codigo { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Ubicacion { get; set; } = string.Empty;
        public int CategoriaId { get; set; }
        public int EstadoId { get; set; } = 1;
    }
}
