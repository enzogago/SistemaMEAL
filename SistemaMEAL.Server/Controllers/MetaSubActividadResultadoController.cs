using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using SistemaMEAL.Modulos;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;

namespace SistemaMEAL.Server.Controllers
{
     [ApiController]
    [Route("api/monitoreo")]
    public class MetaSubActividadResultadoController : ControllerBase
    {
        private readonly MetaSubActividadResultadoDAO _monitoreos;
        private readonly UsuarioDAO _usuarios;

        public MetaSubActividadResultadoController(MetaSubActividadResultadoDAO monitoreos, UsuarioDAO usuarios)
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