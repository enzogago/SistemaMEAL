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

            var data = _subproyectos.Buscar(proAno:proAno, proCod:proCod);
            return Ok(data);
        }

        [HttpGet]
        public dynamic BuscarSubproyecto()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _subproyectos.Buscar();
            return Ok(data);
        }
        
        [HttpGet]
        [Route("{subProAno}/{subProCod}")]
        public dynamic BuscarSubproyecto(string subProAno, string subProCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _subproyectos.Buscar(subProAno:subProAno, subProCod:subProCod);
            return Ok(data.FirstOrDefault());
        }

        // [HttpPost]
        // public dynamic Insertar(SubProyecto subProyecto)
        // {
        //     var identity = HttpContext.User.Identity as ClaimsIdentity;
        //     var rToken = Jwt.validarToken(identity, _usuarios);

        //     if (!rToken.success) return rToken;

        //     dynamic data = rToken.result;
        //     Usuario usuarioActual = new Usuario
        //     {
        //         UsuAno = data.UsuAno,
        //         UsuCod = data.UsuCod,
        //         RolCod = data.RolCod
        //     };
        //     if (usuarioActual.RolCod != "01")
        //     {
        //         return new
        //         {
        //             success = false,
        //             message = "No tienes permisos para realizar esta accion",
        //             result = ""
        //         };
        //     }

        //     var (subProAno, subProCod, message, messageType) = _subproyectos.Insertar(subProyecto);
        //     if (messageType == "1") // Error
        //     {
        //         return new BadRequestObjectResult(new { success = false, message });
        //     }
        //     else if (messageType == "2") // Registro ya existe
        //     {
        //         return new ConflictObjectResult(new { success = false, message });
        //     }
        //     else // Registro modificado correctamente
        //     {
        //         return new OkObjectResult(new { subProAno, subProCod, success = true, message });
        //     }
        // }

        [HttpPut]
        public dynamic Modificar(SubProyecto subProyecto)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return rToken;

            dynamic data = rToken.result;
            Usuario usuarioActual = new Usuario
            {
                UsuAno = data.UsuAno,
                UsuCod = data.UsuCod,
                RolCod = data.RolCod
            };
            if (usuarioActual.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para realizar esta accion",
                    result = ""
                };
            }

            var (message, messageType) = _subproyectos.Modificar(subProyecto);
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

            dynamic data = rToken.result;
            Usuario usuarioActual = new Usuario
            {
                UsuAno = data.UsuAno,
                UsuCod = data.UsuCod,
                RolCod = data.RolCod
            };
            if (usuarioActual.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para realizar esta accion",
                    result = ""
                };
            }

            var (message, messageType) = _subproyectos.Eliminar(subProyecto);
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

            dynamic data = rToken.result;
            Usuario usuarioActual = new Usuario
            {
                UsuAno = data.UsuAno,
                UsuCod = data.UsuCod,
                RolCod = data.RolCod
            };
            if (usuarioActual.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para insertar usuarios",
                    result = ""
                };
            }
            var (message, messageType) = _subproyectos.InsertarSubProyectoImplementadorUbicacion(subProyectoImplementadorUbicacionDto.SubProyecto, subProyectoImplementadorUbicacionDto.Implementadores, subProyectoImplementadorUbicacionDto.Ubicaciones);
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
