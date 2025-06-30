using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Prueba_Practica.Business.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Prueba_Practica.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class CuentaController : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;

        public CuentaController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var usuario = await _usuarioService.LoginAsync(request.Email, request.Password);
            if (usuario == null)
            {
                return Unauthorized(new { mensaje = "Credenciales inválidas" });
            }
            return Ok(new
            {
                id = usuario.Id,
                nombre = usuario.Nombre,
                email = usuario.Email,
                rol = usuario.Rol.Nombre
            });
        }

        [HttpPost("registro")]
        public async Task<IActionResult> Registro([FromBody] RegistroRequest request)
        {
            var exito = await _usuarioService.RegistrarAsync(request.Nombre, request.Email, request.Password);
            if (!exito)
            {
                return Conflict(new { mensaje = "El email ya está registrado" });
            }
            return Ok(new { mensaje = "Usuario registrado correctamente" });
        }
        [HttpGet("listar")]
        public async Task<IActionResult> ListarUsuarios()
        {
            var usuarios = await _usuarioService.ObtenerUsuariosAsync();
            var resultado = usuarios.Select(u => new { u.Id, u.Nombre });
            return Ok(resultado);
        }
    }
    public class LoginRequest
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }
    public class RegistroRequest
    {
        public string Nombre { get; set; } = "";
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }
}
