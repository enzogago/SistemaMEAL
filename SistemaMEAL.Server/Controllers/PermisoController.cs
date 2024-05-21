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

        [HttpPost("agregar")]
        public IActionResult AgregarPermisoUsuario([FromBody] List<PermisoUsuario> permisosAgregar)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            foreach (var permisoUsuario in permisosAgregar)
            {
                bool result = _permisos.InsertarPermisoUsuario(identity, permisoUsuario.UsuAno, permisoUsuario.UsuCod, permisoUsuario.PerCod);
                if (!result)
                {
                    return BadRequest("Error al agregar el permiso al usuario");
                }
            }

            return Ok("Permisos agregados correctamente");
        }

        [HttpPost("eliminar")]
        public IActionResult EliminarPermisoUsuario([FromBody] List<PermisoUsuario> permisosEliminar)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            foreach (var permisoUsuario in permisosEliminar)
            {
                bool result = _permisos.EliminarPermisoUsuario(identity, permisoUsuario.UsuAno, permisoUsuario.UsuCod, permisoUsuario.PerCod);
                if (!result)
                {
                    return BadRequest("Error al eliminar el permiso del usuario");
                }
            }

            return Ok("Permisos eliminados correctamente");
        }

        [HttpGet]
        public dynamic Listado()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var permisos = _permisos.Listado(identity);
            return Ok(permisos);
        }

        [HttpGet("{usuAno}/{usuCod}")]
        public IActionResult ListadoPermisoPorUsuario(string usuAno, string usuCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var permiso = _permisos.ListadoPermisoPorUsuario(identity, usuAno:usuAno, usuCod:usuCod);
            return Ok(permiso);
        }

        [HttpPost]
        public dynamic Insertar(Permiso permiso)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

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
            var rToken = Jwt.validarToken(identity, _usuarios);

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
            var rToken = Jwt.validarToken(identity, _usuarios);

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
