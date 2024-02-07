using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using SistemaMEAL.Modulos;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;

namespace SistemaMEAL.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GeneroController : ControllerBase
    {
        private readonly GeneroDAO _generos;
        private readonly UsuarioDAO _usuarios;

        public GeneroController(GeneroDAO generos, UsuarioDAO usuarios)
        {
            _generos = generos;
            _usuarios = usuarios;
        }


       [HttpGet]
        public dynamic Listado()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);
            Console.WriteLine(rToken);
            if (!rToken.success) return Unauthorized(rToken);

            // Pasa los parámetros al método Listado
            var generos = _generos.Listado();
            
            return Ok(generos);
        }


        [HttpPost]
        public dynamic Insertar(Genero genero)
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
            if (!_usuarios.TienePermiso(usuario.UsuAno, usuario.UsuCod, "INSERTAR GENERO") && usuario.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para insertar generos",
                    result = ""
                };
            }

            var (message, messageType) = _generos.Insertar(genero);
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

        [HttpPut("{genCod}")]
        public dynamic Modificar(string genCod, Genero genero)
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
            if (!_usuarios.TienePermiso(usuario.UsuAno, usuario.UsuCod, "MODIFICAR GENERO") && usuario.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para modificar genero",
                    result = ""
                };
            }

            genero.GenCod = genCod; // Asegúrate de que el código del estado en el objeto estado sea el correcto
            var (message, messageType) = _generos.Modificar(genero);
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


        [HttpDelete("{genCod}")]
        public dynamic Eliminar(string genCod)
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
            if (!_usuarios.TienePermiso(usuario.UsuAno, usuario.UsuCod, "ELIMINAR GENERO") && usuario.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para eliminar generos",
                    result = ""
                };
            }

            var (message, messageType) = _generos.Eliminar(genCod);
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
