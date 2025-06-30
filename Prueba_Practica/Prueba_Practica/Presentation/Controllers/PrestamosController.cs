using Microsoft.AspNetCore.Mvc;
using Prueba_Practica.Business.Interfaces;
using Prueba_Practica.DTOs;
using Prueba_Practica.Entities;

namespace Prueba_Practica.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PrestamosController : ControllerBase
    {
        private readonly IPrestamoService _prestamoService;
        public PrestamosController(IPrestamoService prestamoService)
        {
            _prestamoService = prestamoService; }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Prestamo>>> GetPrestamos()
        {
            var prestamos = await _prestamoService.ListarAsync();
            return Ok(prestamos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PrestamoDTO>> GetPrestamo(int id)
        {
            var prestamo = await _prestamoService.ObtenerPorIdAsync(id);
            if (prestamo == null) return NotFound();

            var dto = new PrestamoDTO
            {
                Id = prestamo.Id,
                UsuarioId = prestamo.UsuarioId,
                UsuarioNombre = prestamo.Usuario?.Nombre ?? "Desconocido",
                ArticuloId = prestamo.ArticuloId,
                ArticuloNombre = prestamo.Articulo?.Nombre ?? "Desconocido",
                FechaSolicitud = prestamo.FechaSolicitud,
                FechaEntrega = prestamo.FechaEntrega,
                FechaDevolucion = prestamo.FechaDevolucion,
                Estado = prestamo.Estado
            };

            return Ok(dto);
        }

        [HttpPost]
        public async Task<ActionResult> CrearPrestamo([FromBody] PrestamoCreateDTO dto)
        {
            var prestamo = new Prestamo
            {
                UsuarioId = dto.UsuarioId,
                ArticuloId = dto.ArticuloId,
                FechaSolicitud = dto.FechaSolicitud,
                FechaEntrega = dto.FechaEntrega,
                FechaDevolucion = dto.FechaDevolucion,
                Estado = dto.Estado
            };
            await _prestamoService.CrearAsync(prestamo);
            return CreatedAtAction(nameof(GetPrestamo), new { id = prestamo.Id }, prestamo);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> EditarPrestamo(int id, [FromBody] PrestamoUpdateDTO dto)
        {
            if (id != dto.Id)
                return BadRequest("El ID no coincide");
            var prestamoExistente = await _prestamoService.ObtenerPorIdAsync(id);
            if (prestamoExistente == null)
                return NotFound();
            prestamoExistente.UsuarioId = dto.UsuarioId;
            prestamoExistente.ArticuloId = dto.ArticuloId;
            prestamoExistente.FechaSolicitud = dto.FechaSolicitud;
            prestamoExistente.FechaEntrega = dto.FechaEntrega;
            prestamoExistente.FechaDevolucion = dto.FechaDevolucion;
            prestamoExistente.Estado = dto.Estado;
            await _prestamoService.EditarAsync(prestamoExistente);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> EliminarPrestamo(int id)
        {
            var existente = await _prestamoService.ObtenerPorIdAsync(id);
            if (existente == null)
                return NotFound();

            await _prestamoService.EliminarAsync(id);
            return NoContent();
        }

        [HttpGet("usuario/{usuarioId}")]
        public async Task<ActionResult<IEnumerable<Prestamo>>> GetPrestamosPorUsuario(int usuarioId)
        {
            var prestamos = await _prestamoService.BuscarPorUsuarioAsync(usuarioId);
            return Ok(prestamos);
        }

        [HttpPut("{id}/devolver")]
        public async Task<IActionResult> MarcarComoDevuelto(int id)
        {
            var prestamo = await _prestamoService.ObtenerPorIdAsync(id);
            if (prestamo == null)
                return NotFound();

            try
            {
                await _prestamoService.MarcarComoDevueltoAsync(id);
                return Ok(new { mensaje = "Préstamo marcado como devuelto." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }
    }
}
