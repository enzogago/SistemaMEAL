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
            var rToken = Jwt.ValidateToken(identity);
            if (!rToken.success) return Unauthorized(rToken);

            // Pasa los parámetros al método Listado
            var result = _logs.ActividadesRecientes();
            
            return Ok(result);
        }


    }
}