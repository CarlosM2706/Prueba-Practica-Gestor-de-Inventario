namespace Prueba_Practica.Entities
{
    public class Estado
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;

        public ICollection<Articulo> Articulos { get; set; } = new List<Articulo>();

        public enum Estados
        {
            Disponible = 1,
            Prestado = 2,
        }
    }
}
