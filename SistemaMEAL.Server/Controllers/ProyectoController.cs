using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using SistemaMEAL.Modulos;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;


namespace SistemaMEAL.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProyectoController : ControllerBase
    {
        private readonly ProyectoDAO _proyectos;
        private readonly UsuarioDAO _usuarios;

        public ProyectoController(ProyectoDAO proyectos, UsuarioDAO usuarios)
        {
            _proyectos = proyectos;
            _usuarios = usuarios;
        }

        [HttpGet]
        public dynamic Listado()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var proyectos = _proyectos.Listado();
            Console.WriteLine(proyectos);
            return Ok(proyectos);
        }
    }
}
