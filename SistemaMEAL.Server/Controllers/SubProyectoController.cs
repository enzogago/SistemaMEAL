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
        private readonly IWebHostEnvironment _hostingEnvironment;

        public SubProyectoController(SubProyectoDAO subproyectos, UsuarioDAO usuarios, IWebHostEnvironment hostingEnvironment)
        {
            _subproyectos = subproyectos;
            _usuarios = usuarios;
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpGet]
        [Route("proyecto/{proAno}/{proCod}")]
        public dynamic BuscarPorProyecto(string proAno, string proCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _subproyectos.Buscar(identity, proAno:proAno, proCod:proCod);
            return Ok(data);
        }

        [HttpGet]
        public dynamic Buscar()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _subproyectos.Buscar(identity);
            return Ok(data);
        }
        
        [HttpGet]
        [Route("{subProAno}/{subProCod}")]
        public dynamic BuscarSubproyecto(string subProAno, string subProCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _subproyectos.Buscar(identity, subProAno:subProAno, subProCod:subProCod);
            return Ok(data.FirstOrDefault());
        }

        [HttpPost]
        [Route("masivo")]
        public dynamic InsertarMasivo(SubProyectoImplementadorUbicacionDto subProyectoImplementadorUbicacionDto)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

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
            var rToken = Jwt.ValidateToken(identity);

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
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return rToken;

            var (message, messageType) = _subproyectos.InsertarSubProyectoImplementadorUbicacion(identity, subProyectoImplementadorUbicacionDto.SubProyecto, subProyectoImplementadorUbicacionDto.SubProyectoImplementadores, subProyectoImplementadorUbicacionDto.SubProyectoFinanciadores, subProyectoImplementadorUbicacionDto.SubProyectoUbicaciones);
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
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return rToken;

            var (message, messageType) = _subproyectos.ModificarSubProyectoImplementadorUbicacion(identity, subProyectoImplementadorUbicacionDto.SubProyecto, subProyectoImplementadorUbicacionDto.SubProyectoImplementadores, subProyectoImplementadorUbicacionDto.SubProyectoFinanciadores, subProyectoImplementadorUbicacionDto.SubProyectoUbicaciones);
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
        [Route("save-file")]
        public async Task<IActionResult> SubirArchivo(SubProyectoFuenteDto subProyectoFuenteDto)
        {
            // var identity = HttpContext.User.Identity as ClaimsIdentity;
            // var rToken = Jwt.ValidateToken(identity);
            // if (!rToken.success) 
            // {
            //     return Unauthorized(new { success = false, message = rToken.message });
            // }

            string uploadsDirectory;

            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
            {
                uploadsDirectory = Path.Combine(_hostingEnvironment.ContentRootPath, "fuentes", "sub-proyecto");
            }
            else
            {
                uploadsDirectory = Path.Combine(_hostingEnvironment.WebRootPath, "fuentes", "sub-proyecto");
            }

            var (message, messageType) = await _subproyectos.SubirArchivo(subProyectoFuenteDto.SubProyectoFuente, subProyectoFuenteDto.FileData, uploadsDirectory);
            if (messageType == "1")
            {
                return new BadRequestObjectResult(new { success = false, message });
            }
            else if (messageType == "2")
            {
                return new ConflictObjectResult(new { success = false, message });
            }
            else
            {
                return new OkObjectResult(new { success = true, message });
            }
        }

        [HttpPost]
        [Route("delete-file")]
        public async Task<IActionResult> EliminarArchivo(SubProyectoFuenteDto subProyectoFuenteDto)
        {
            // var identity = HttpContext.User.Identity as ClaimsIdentity;
            // var rToken = Jwt.ValidateToken(identity);
            // if (!rToken.success) 
            // {
            //     return Unauthorized(new { success = false, message = rToken.message });
            // }

            string uploadsDirectory;

            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
            {
                uploadsDirectory = Path.Combine(_hostingEnvironment.ContentRootPath, "fuentes", "sub-proyecto");
            }
            else
            {
                uploadsDirectory = Path.Combine(_hostingEnvironment.WebRootPath, "fuentes", "sub-proyecto");
            }

            var (message, messageType) = await _subproyectos.EliminarArchivo(subProyectoFuenteDto.SubProyectoFuente, subProyectoFuenteDto.FileData, uploadsDirectory);
            if (messageType == "1")
            {
                return new BadRequestObjectResult(new { success = false, message });
            }
            else if (messageType == "2")
            {
                return new ConflictObjectResult(new { success = false, message });
            }
            else
            {
                return new OkObjectResult(new { success = true, message });
            }
        }

        [HttpGet]
        [Route("files/{subProAno}/{subProCod}")]
        public dynamic BuscarArchivos(string subProAno, string subProCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var result = _subproyectos.BuscarArchivos(identity, subProAno, subProCod);
            return Ok(result);
        }

        
    }
}
