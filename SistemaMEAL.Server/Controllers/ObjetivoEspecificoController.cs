using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using SistemaMEAL.Modulos;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;


namespace SistemaMEAL.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ObjetivoEspecificoController : ControllerBase
    {
        private readonly ObjetivoEspecificoDAO _objetivosEspecificos;
        private readonly UsuarioDAO _usuarios;

        public ObjetivoEspecificoController(ObjetivoEspecificoDAO objetivosEspecificos, UsuarioDAO usuarios)
        {
            _objetivosEspecificos = objetivosEspecificos;
            _usuarios = usuarios;
        }

        [HttpGet]
        public dynamic Buscar()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _objetivosEspecificos.Buscar(identity);
            return Ok(data);
        }

        [HttpGet("objetivo/{objAno}/{objCod}")]
        public dynamic BuscarObjetivosPorSubproyecto(string objAno, string objCod )
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _objetivosEspecificos.Buscar(identity, objAno:objAno, objCod:objCod);
            return Ok(data);
        }

        [HttpPost]
        public dynamic Insertar(ObjetivoEspecifico objetivoEspecifico)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return rToken;

            var (ano, cod, message, messageType) = _objetivosEspecificos.Insertar(identity, objetivoEspecifico);
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
                return new OkObjectResult(new { ano, cod, success = true, message });
            }
        }

        [HttpPut]
        public dynamic Modificar(ObjetivoEspecifico objetivoEspecifico)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return rToken;

            var (message, messageType) = _objetivosEspecificos.Modificar(identity, objetivoEspecifico);
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
        public dynamic Eliminar(ObjetivoEspecifico objetivoEspecifico)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return rToken;

            var (message, messageType) = _objetivosEspecificos.Eliminar(identity, objetivoEspecifico);
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
