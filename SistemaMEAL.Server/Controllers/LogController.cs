using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using SistemaMEAL.Modulos;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;

namespace SistemaMEAL.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LogController : ControllerBase
    {
        private readonly LogDAO _logs;
         private readonly UsuarioDAO _usuarios;

        public LogController(LogDAO logs, UsuarioDAO usuarios)
        {
            _logs = logs;
            _usuarios = usuarios;
        }

        [HttpGet]
        public dynamic ActividadesRecientes()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);
            Console.WriteLine(rToken);
            if (!rToken.success) return Unauthorized(rToken);

            dynamic data = rToken.result;
            Usuario usuarioActual = new Usuario
            {
                UsuAno = data.UsuAno,
                UsuCod = data.UsuCod,
                RolCod = data.RolCod
            };

            if (usuarioActual.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para insertar usuarios",
                    result = ""
                };
            }

            // Pasa los parámetros al método Listado
            var result = _logs.ActividadesRecientes();
            
            return Ok(result);
        }


    }
}