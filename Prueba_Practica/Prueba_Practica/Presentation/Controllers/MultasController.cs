using Microsoft.AspNetCore.Mvc;
using Prueba_Practica.Business.Interfaces;

namespace Prueba_Practica.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MultasController : ControllerBase
    {
        private readonly IMultaService _multaService;
        public MultasController(IMultaService multaService)
        {
            _multaService = multaService;
        }
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var multas = await _multaService.ListarMultasAsync();
            return Ok(multas);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var multa = await _multaService.ObtenerMultaPorIdAsync(id);
            if (multa == null) return NotFound();
            return Ok(multa);
        }
        [HttpPut("{id}/pagar")]
        public async Task<IActionResult> PagarMulta(int id)
        {
            var multa = await _multaService.ObtenerMultaPorIdAsync(id);
            if (multa == null)
                return NotFound(new { mensaje = "Multa no encontrada." });
            if (multa.Pagado)
                return BadRequest(new { mensaje = "La multa ya está pagada." });
            multa.Pagado = true;
            var resultado = await _multaService.ActualizarMultaAsync(multa);
            if (!resultado)
                return StatusCode(500, new { mensaje = "Error al actualizar la multa." });

            return Ok(new { mensaje = "Multa marcada como pagada." });
        }
    }
}
