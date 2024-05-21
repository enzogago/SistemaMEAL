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
            var generos = _generos.Listado(identity);
            
            return Ok(generos);
        }


        [HttpPost]
        public dynamic Insertar(Genero genero)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return rToken;

            var (message, messageType) = _generos.Insertar(identity, genero);
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
        public dynamic Modificar(Genero genero)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return rToken;

            var (message, messageType) = _generos.Modificar(identity, genero);
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
        public dynamic Eliminar(Genero genero)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return rToken;

            var (message, messageType) = _generos.Eliminar(identity, genero);
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
