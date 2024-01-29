using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using SistemaMEAL.Modulos;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;

namespace SistemaMEAL.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MonitoreoController : ControllerBase
    {
        private readonly MonitoreoDAO _monitoreos;
        private readonly UsuarioDAO _usuarios;

        public MonitoreoController(MonitoreoDAO monitoreos, UsuarioDAO usuarios)
        {
            _monitoreos = monitoreos;
            _usuarios = usuarios;
        }

        [HttpGet]
        public dynamic Listado()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var monitoreos = _monitoreos.Listado();
            Console.WriteLine(monitoreos);
            return Ok(monitoreos);
        }
    }
}