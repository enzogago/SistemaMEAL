using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using SistemaMEAL.Modulos;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;


namespace SistemaMEAL.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubProyectoController : ControllerBase
    {
        private readonly SubProyectoDAO _subproyectos;
        private readonly UsuarioDAO _usuarios;

        public SubProyectoController(SubProyectoDAO subproyectos, UsuarioDAO usuarios)
        {
            _subproyectos = subproyectos;
            _usuarios = usuarios;
        }

        [HttpGet]
        [Route("proyecto/{proAno}/{proCod}")]
        public dynamic BuscarPorProyecto(string proAno, string proCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _subproyectos.Buscar(identity, proAno:proAno, proCod:proCod);
            return Ok(data);
        }

        [HttpGet]
        public dynamic BuscarSubproyecto()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _subproyectos.Buscar(identity);
            return Ok(data);
        }
        
        [HttpGet]
        [Route("{subProAno}/{subProCod}")]
        public dynamic BuscarSubproyecto(string subProAno, string subProCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _subproyectos.Buscar(identity, subProAno:subProAno, subProCod:subProCod);
            return Ok(data.FirstOrDefault());
        }

        [HttpPost]
        [Route("masivo")]
        public dynamic InsertarMasivo(SubProyectoImplementadorUbicacionDto subProyectoImplementadorUbicacionDto)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return rToken;

            var (message, messageType) = _subproyectos.InsertarSubProyectoImplementadorUbicacionMasivo(identity,subProyectoImplementadorUbicacionDto.SubProyecto , subProyectoImplementadorUbicacionDto.SubProyectoImplementadores,subProyectoImplementadorUbicacionDto.SubProyectoUbicaciones);
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
        public dynamic Eliminar(SubProyecto subProyecto)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return rToken;

            var (message, messageType) = _subproyectos.Eliminar(identity, subProyecto);
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

        [HttpPost]
        public dynamic Insertar(SubProyectoImplementadorUbicacionDto subProyectoImplementadorUbicacionDto)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return rToken;

            var (message, messageType) = _subproyectos.InsertarSubProyectoImplementadorUbicacion(identity, subProyectoImplementadorUbicacionDto.SubProyecto, subProyectoImplementadorUbicacionDto.SubProyectoImplementadores, subProyectoImplementadorUbicacionDto.SubProyectoUbicaciones);
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
        public dynamic Modificar(SubProyectoImplementadorUbicacionDto subProyectoImplementadorUbicacionDto)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return rToken;

            var (message, messageType) = _subproyectos.ModificarSubProyectoImplementadorUbicacion(identity, subProyectoImplementadorUbicacionDto.SubProyecto, subProyectoImplementadorUbicacionDto.SubProyectoImplementadores, subProyectoImplementadorUbicacionDto.SubProyectoUbicaciones);
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
