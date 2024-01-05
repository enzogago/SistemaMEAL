using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using SistemaMEAL.Modulos;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;

namespace SistemaMEAL.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TipoValorController : ControllerBase
    {
        private readonly TipoValorDAO _tipos;
        private readonly UsuarioDAO _usuarios;

        public TipoValorController(TipoValorDAO tipos, UsuarioDAO usuarios)
        {
            _tipos = tipos;
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
            if (!_usuarios.TienePermiso(usuario.UsuAno, usuario.UsuCod, "LISTAR TIPO_VALOR") && usuario.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para listar tipos valor",
                    result = ""
                };
            }
            var tipos = _tipos.Listado();
            Console.WriteLine(tipos);
            return Ok(tipos);
        }

        [HttpPost]
        public dynamic Insertar(TipoValor tipoValor)
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
            if (!_usuarios.TienePermiso(usuario.UsuAno, usuario.UsuCod, "CREAR TIPO_VALOR") && usuario.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para insertar tipos valor",
                    result = ""
                };
            }

            var (message, messageType) = _tipos.Insertar(tipoValor);
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

        [HttpPut("{tipValCod}")]
        public dynamic Modificar(string tipValCod, TipoValor tipoValor)
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
            if (!_usuarios.TienePermiso(usuario.UsuAno, usuario.UsuCod, "MODIFICAR TIPO_VALOR") && usuario.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para modificar estados",
                    result = ""
                };
            }

            tipoValor.TipValCod = tipValCod; // Asegúrate de que el código del estado en el objeto estado sea el correcto
            var (message, messageType) = _tipos.Modificar(tipoValor);
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


        [HttpDelete("{tipValCod}")]
        public dynamic Eliminar(string tipValCod)
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
            if (!_usuarios.TienePermiso(usuario.UsuAno, usuario.UsuCod, "ELIMINAR TIPO_VALOR") && usuario.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para eliminar tipos valor",
                    result = ""
                };
            }

            var (message, messageType) = _tipos.Eliminar(tipValCod);
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
