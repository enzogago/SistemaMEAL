using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using SistemaMEAL.Modulos;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;

namespace SistemaMEAL.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PermisoController : ControllerBase
    {
        private readonly PermisoDAO _permisos;
        private readonly UsuarioDAO _usuarios;

        public PermisoController(PermisoDAO permisos, UsuarioDAO usuarios)
        {
            _permisos = permisos;
            _usuarios = usuarios;
        }

        [HttpPost("usuario")]
        public dynamic InsertarPermisoUsuario(PermisoUsuarioDto permisoUsuarioDto)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return rToken;

            var (message, messageType) = _permisos.InsertarPermisoUsuario(identity, permisoUsuarioDto.Usuario, permisoUsuarioDto.PermisoUsuarioInsertar, permisoUsuarioDto.PermisoUsuarioEliminar);
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


        [HttpGet]
        public dynamic Listado()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var permisos = _permisos.Buscar(identity);
            return Ok(permisos);
        }

        [HttpGet("{usuAno}/{usuCod}/{perRef}")]
        public IActionResult ListadoPermisoPorUsuario(string usuAno, string usuCod, string perRef)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var permiso = _permisos.ListadoPermisoPorUsuario(identity, usuAno:usuAno, usuCod:usuCod, perRef:perRef);
            return Ok(permiso);
        }

        [HttpGet("{perRef}")]
        public IActionResult BuscarPermisoPorReferencia(string perRef)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var permiso = _permisos.Buscar(identity, perRef:perRef);
            return Ok(permiso);
        }

        [HttpPost]
        public dynamic Insertar(Permiso permiso)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return rToken;

            var (message, messageType) = _permisos.Insertar(identity, permiso);
            if (messageType == "1") // Error
            {
                return BadRequest(message);
            }
            else if (messageType == "2") // Registro ya existe
            {
                return Conflict(message);
            }
            else // Registro insertado correctamente
            {
                return Ok(message);
            }
        }

        [HttpPut("{perCod}")]
        public dynamic Modificar(string perCod, Permiso permiso)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return rToken;

            permiso.PerCod = perCod; 
            var (message, messageType) = _permisos.Modificar(identity, permiso);
            if (messageType == "1") // Error
            {
                return BadRequest(message);
            }
            else if (messageType == "2") // Registro ya existe
            {
                return Conflict(message);
            }
            else // Registro modificado correctamente
            {
                return Ok(message);
            }
        }


        [HttpDelete("{perCod}")]
        public dynamic Eliminar(string perCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return rToken;

            var (message, messageType) = _permisos.Eliminar(identity, perCod);
            if (messageType == "1") // Error
            {
                return BadRequest(message);
            }
            else if (messageType == "2") // Registro ya existe
            {
                return Conflict(message);
            }
            else // Registro eliminado correctamente
            {
                return Ok(message);
            }
        }


    }
}
