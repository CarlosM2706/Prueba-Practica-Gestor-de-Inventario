using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Prueba_Practica.Business.Interfaces;
using Prueba_Practica.DTOs;
using Prueba_Practica.Entities;
using Prueba_Practica.Utils;

namespace Prueba_Practica.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArticulosController : ControllerBase
    {
        private readonly IArticuloService _articuloService;

        public ArticulosController(IArticuloService articuloService)
        {
            _articuloService = articuloService;
        }

        // GET: api/articulos

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var articulos = await _articuloService.ListarAsync();
            return Ok(articulos);
        }
        // GET: api/articulos/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var articulo = await _articuloService.ObtenerPorIdAsync(id);
            if (articulo == null)
                return NotFound();

            return Ok(articulo);
        }

        // GET: api/articulos/disponibles
        [HttpGet("disponibles")]
        public async Task<IActionResult> GetDisponibles()
        {
            var disponibles = await _articuloService.BuscarDisponiblesAsync();
            return Ok(disponibles);
        }

        // POST: api/articulos
        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] ArticuloDTO dto)
        {
            try
            {
                var articulo = new Articulo
                {
                    Codigo = dto.Codigo,
                    Nombre = dto.Nombre,
                    Ubicacion = dto.Ubicacion,
                    CategoriaId = dto.CategoriaId,
                    EstadoId = dto.EstadoId
                };

                await _articuloService.CrearAsync(articulo);
                return CreatedAtAction(nameof(GetById), new { id = articulo.Id }, articulo);
            }
            catch (Exception ex)
            {
                return Conflict(new { mensaje = ex.Message });
            }
        }

        // PUT: api/articulos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Editar(int id, [FromBody] Articulo articulo)
        {
            if (id != articulo.Id) return BadRequest();
            var existente = await _articuloService.ObtenerPorIdAsync(id);
            if (existente == null)
                return NotFound();
            try
            {
                await _articuloService.EditarAsync(articulo);
                return NoContent();
            }
            catch (Exception ex)
            {
                return Conflict(new { mensaje = ex.Message });
            }
        }

        // DELETE: api/articulos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var existente = await _articuloService.ObtenerPorIdAsync(id);
            if (existente == null)return NotFound();
            await _articuloService.EliminarAsync(id);
            return NoContent();
        }

        [HttpGet("exportar-pdf")]
        public async Task<IActionResult> ExportarArticulosPDF()
        {
            var lista = await _articuloService.ListarAsync(); 
            var pdf = PdfGenerator.CrearListadoArticulos(lista.ToList());

            return File(pdf, "application/pdf", "Listado_Articulos.pdf");
        }

       
    }
}