using Microsoft.AspNetCore.Mvc;
using Prueba_Practica.Business.Interfaces;
using Prueba_Practica.Entities;

namespace Prueba_Practica.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriaController : ControllerBase
    {
        private readonly ICategoriaService _categoriaService;
        public CategoriaController(ICategoriaService categoriaService)
        {
            _categoriaService = categoriaService;
        }
        [HttpGet("listar")]
        public async Task<IActionResult> Listar()
        {
            var categorias = await _categoriaService.GetCategoriasAsync();
            return Ok(categorias);
        }
        [HttpPost("crear")]
        public async Task<IActionResult> Crear([FromBody] Categoria categoria)
        {
            if (string.IsNullOrWhiteSpace(categoria.Nombre))
                return BadRequest(new { mensaje = "El nombre es obligatorio" });

            try
            {
                await _categoriaService.CrearCategoriaAsync(categoria);
                return Ok(categoria);
            }
            catch (Exception ex)
            {
                return Conflict(new { mensaje = ex.Message });
            }
        }
    }
}
