using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using SistemaMEAL.Modulos;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;

namespace SistemaMEAL.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FinanciadorController : ControllerBase
    {
        private readonly FinanciadorDAO _financiadores;
        private readonly UsuarioDAO _usuarios;

        public FinanciadorController(FinanciadorDAO financiadores, UsuarioDAO usuarios)
        {
            _financiadores = financiadores;
            _usuarios = usuarios;
        }

        [HttpGet]
        public dynamic Listado()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var financiadores = _financiadores.Listado(identity);
            return Ok(financiadores);
        }

        [HttpGet("subproyecto/{subProAno}/{subProCod}")]
        public dynamic BuscarFinanciadoresSubProyecto(string subProAno, string subProCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);
            
            var result = _financiadores.BuscarFinanciadoresSubProyecto(identity, subProAno:subProAno, subProCod:subProCod);
            return Ok(result);
        }

        [HttpPost]
        public dynamic Insertar(Financiador financiador)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return rToken;

            var (message, messageType) = _financiadores.Insertar(identity, financiador);
            if (messageType == "1") // Error
            {
                return new BadRequestObjectResult(new { success = false, message });
            }
            else if (messageType == "2") // Registro ya existe
            {
                return new ConflictObjectResult(new { success = false, message });
            }
            else // Registro modificado correctamente
            {
                return new OkObjectResult(new { success = true, message });
            }
        }

        [HttpPut]
        public dynamic Modificar(Financiador financiador)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return rToken;

            var (message, messageType) = _financiadores.Modificar(identity, financiador);
            if (messageType == "1") // Error
            {
                return new BadRequestObjectResult(new { success = false, message });
            }
            else if (messageType == "2") // Registro ya existe
            {
                return new ConflictObjectResult(new { success = false, message });
            }
            else // Registro modificado correctamente
            {
                return new OkObjectResult(new { success = true, message });
            }
        }


        [HttpDelete]
        public dynamic Eliminar(Financiador financiador)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return rToken;

            var (message, messageType) = _financiadores.Eliminar(identity, financiador);
            if (messageType == "1") // Error
            {
                return new BadRequestObjectResult(new { success = false, message });
            }
            else if (messageType == "2") // Registro ya existe
            {
                return new ConflictObjectResult(new { success = false, message });
            }
            else // Registro modificado correctamente
            {
                return new OkObjectResult(new { success = true, message });
            }
        }


    }
}
