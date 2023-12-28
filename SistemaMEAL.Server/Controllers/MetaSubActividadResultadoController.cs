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

            dynamic data = rToken.result;
            Usuario usuario = new Usuario
            {
                UsuAno = data.UsuAno,
                UsuCod = data.UsuCod,
                RolCod = data.RolCod
            };
            if (!_usuarios.TienePermiso(usuario.UsuAno, usuario.UsuCod, "LISTAR MONITOREO") && usuario.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para listar monitoreos",
                    result = ""
                };
            }
            var monitoreos = _monitoreos.Listado();
            Console.WriteLine(monitoreos);
            return Ok(monitoreos);
        }
    }
}