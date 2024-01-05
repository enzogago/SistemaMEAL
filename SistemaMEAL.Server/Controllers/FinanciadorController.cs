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
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            dynamic data = rToken.result;
            Usuario usuario = new Usuario
            {
                UsuAno = data.UsuAno,
                UsuCod = data.UsuCod,
                RolCod = data.RolCod
            };
            if (!_usuarios.TienePermiso(usuario.UsuAno, usuario.UsuCod, "LISTAR FINANCIADOR") && usuario.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para listar financiadores",
                    result = ""
                };
            }
            var financiadores = _financiadores.Listado();
            Console.WriteLine(financiadores);
            return Ok(financiadores);
        }

        [HttpPost]
        public dynamic Insertar(Financiador financiador)
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
            if (!_usuarios.TienePermiso(usuario.UsuAno, usuario.UsuCod, "CREAR FINANCIADOR") && usuario.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para insertar financiadores",
                    result = ""
                };
            }

            var (message, messageType) = _financiadores.Insertar(financiador);
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

        [HttpPut("{finCod}")]
        public dynamic Modificar(string finCod, Financiador financiador)
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
            if (!_usuarios.TienePermiso(usuario.UsuAno, usuario.UsuCod, "MODIFICAR FINANCIADOR") && usuario.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para modificar financiadores",
                    result = ""
                };
            }

            financiador.FinCod = finCod; 
            var (message, messageType) = _financiadores.Modificar(financiador);
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


        [HttpDelete("{finCod}")]
        public dynamic Eliminar(string finCod)
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
            if (!_usuarios.TienePermiso(usuario.UsuAno, usuario.UsuCod, "ELIMINAR FINANCIADOR") && usuario.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para eliminar financiadores",
                    result = ""
                };
            }

            var (message, messageType) = _financiadores.Eliminar(finCod);
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
