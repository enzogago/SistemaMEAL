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
            if (!_usuarios.TienePermiso(usuario.UsuAno, usuario.UsuCod, "LISTAR PERMISO") && usuario.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para listar permisos",
                    result = ""
                };
            }
            var permisos = _permisos.Listado();
            Console.WriteLine(permisos);
            return Ok(permisos);
        }

        [HttpPost]
        public dynamic Insertar(Permiso permiso)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return rToken;

            dynamic data = rToken.result;
            Usuario usuario = new Usuario
            {
                UsuAno = data.UsuAno,
                UsuCod = data.UsuCod,
                RolCod = data.RolCod
            };
            if (!_usuarios.TienePermiso(usuario.UsuAno, usuario.UsuCod, "CREAR PERMISO") && usuario.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para insertar permisos",
                    result = ""
                };
            }

            var (message, messageType) = _permisos.Insertar(permiso);
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

            dynamic data = rToken.result;
            Usuario usuario = new Usuario
            {
                UsuAno = data.UsuAno,
                UsuCod = data.UsuCod,
                RolCod = data.RolCod
            };
            if (!_usuarios.TienePermiso(usuario.UsuAno, usuario.UsuCod, "MODIFICAR PERMISO") && usuario.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para modificar permisos",
                    result = ""
                };
            }

            permiso.PerCod = perCod; 
            var (message, messageType) = _permisos.Modificar(permiso);
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

            dynamic data = rToken.result;
            Usuario usuario = new Usuario
            {
                UsuAno = data.UsuAno,
                UsuCod = data.UsuCod,
                RolCod = data.RolCod
            };
            if (!_usuarios.TienePermiso(usuario.UsuAno, usuario.UsuCod, "ELIMINAR PERMISO") && usuario.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para eliminar permisos",
                    result = ""
                };
            }

            var (message, messageType) = _permisos.Eliminar(perCod);
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
