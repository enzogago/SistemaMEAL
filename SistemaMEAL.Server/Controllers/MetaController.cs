using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using SistemaMEAL.Modulos;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;
using Microsoft.SharePoint.Client;
using System.IO;
using System.Net;

namespace SistemaMEAL.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MetaController : ControllerBase
    {
        private readonly MetaDAO _metas;
        private readonly UsuarioDAO _usuarios;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public MetaController(MetaDAO metas, UsuarioDAO usuarios, IWebHostEnvironment hostingEnvironment)
        {
            _metas = metas;
            _usuarios = usuarios;
            _hostingEnvironment = hostingEnvironment;
        }


        [HttpGet]
        [Route("{metAno}/{metCod}")]
        public dynamic Buscar(string metAno, string metCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var result = _metas.Buscar(identity, metAno: metAno, metCod: metCod);
            return Ok(result.FirstOrDefault());
        }

        [HttpGet]
        [Route("{subProAno}/{subProCod}/{metAnoPlaTec}")]
        public dynamic BuscarMonitoreoForm(string subProAno, string subProCod, string metAnoPlaTec)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var result = _metas.Buscar(identity, subProAno:subProAno, subProCod:subProCod, metAnoPlaTec:metAnoPlaTec);
            return Ok(result);
        }

        [HttpGet]
        [Route("executing/{metAno}/{metCod}")]
        public dynamic BuscarMetaEjecucion(string metAno, string metCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var result = _metas.BuscarMetaEjecucion(identity, metAno: metAno, metCod: metCod);
            return Ok(result);
        }

        [HttpPost]
        public dynamic ActualizarMetas(MetasDto metasDto)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            var (message, messageType) = _metas.ActualizarMetas(identity, metasDto.Metas,metasDto.MetasEliminar);
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

        [HttpPut]
        public dynamic ActualizarMetasPresupuesto(List<Meta> metas)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return rToken;

            var (message, messageType) = _metas.ActualizarMetasPresupuesto(identity, metas);
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

        [HttpPut]
        [Route("ejecucion-presupuesto")]
        public dynamic ActualizarEjecucionPresupuesto(List<Meta> metas)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return rToken;

            var (message, messageType) = _metas.ActualizarEjecucionPresupuesto(identity, metas);
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
        [Route("save-file")]
        public async Task<IActionResult> SubirArchivo(MetasFuenteDto metasFuenteDto)
        {
            // var identity = HttpContext.User.Identity as ClaimsIdentity;
            // var rToken = Jwt.validarToken(identity, _usuarios);
            // if (!rToken.success) 
            // {
            //     return Unauthorized(new { success = false, message = rToken.message });
            // }

            string uploadsDirectory;

            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
            {
                uploadsDirectory = Path.Combine(_hostingEnvironment.ContentRootPath, "uploads");
            }
            else
            {
                uploadsDirectory = Path.Combine(_hostingEnvironment.WebRootPath, "uploads");
            }

            var (message, messageType) = await _metas.SubirArchivo(metasFuenteDto.MetaFuente, metasFuenteDto.FileData, uploadsDirectory);
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
        public async Task<IActionResult> EliminarArchivo(MetasFuenteDto metasFuenteDto)
        {
            // var identity = HttpContext.User.Identity as ClaimsIdentity;
            // var rToken = Jwt.validarToken(identity, _usuarios);
            // if (!rToken.success) 
            // {
            //     return Unauthorized(new { success = false, message = rToken.message });
            // }

            string uploadsDirectory;

            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
            {
                uploadsDirectory = Path.Combine(_hostingEnvironment.ContentRootPath, "uploads");
            }
            else
            {
                uploadsDirectory = Path.Combine(_hostingEnvironment.WebRootPath, "uploads");
            }

            var (message, messageType) = await _metas.EliminarArchivo(metasFuenteDto.MetaFuente, metasFuenteDto.FileData, uploadsDirectory);
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
        [Route("files/{metAno}/{metCod}")]
        public dynamic BuscarArchivosPorMeta(string metAno, string metCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var result = _metas.BuscarArchivosPorMeta(identity, metAno, metCod);
            return Ok(result);
        }

        [HttpGet]
        [Route("access/{usuAno}/{usuCod}")]
        public dynamic BuscarMetasUsuario(string usuAno, string usuCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var result = _metas.BuscarMetasUsuario(identity, usuAno:usuAno, usuCod:usuCod);
            return Ok(result);
        }

        [HttpPost]
        [Route("access")]
        public dynamic InsertarMetaUsuario(MetaUsuarioDto metaUsuarioDto)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            var (message, messageType) = _metas.InsertarMetaUsuario(identity, metaUsuarioDto.MetasInsertar, metaUsuarioDto.MetasEliminar);
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

    }
}
