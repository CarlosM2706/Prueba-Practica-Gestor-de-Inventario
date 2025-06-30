namespace Prueba_Practica.Entities
{
    public class Multa
    {
        public int Id { get; set; }
        public int PrestamoId { get; set; }
        public decimal Monto { get; set; }
        public DateTime FechaRegistro { get; set; }
        public bool Pagado { get; set; }

        public Prestamo? Prestamo { get; set; }
    }
}
