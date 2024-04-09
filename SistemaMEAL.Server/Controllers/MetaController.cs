using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using SistemaMEAL.Modulos;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;

namespace SistemaMEAL.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MetaController : ControllerBase
    {
        private readonly MetaDAO _metas;
        private readonly UsuarioDAO _usuarios;

        public MetaController(MetaDAO metas, UsuarioDAO usuarios)
        {
            _metas = metas;
            _usuarios = usuarios;
        }



        [HttpGet]
        [Route("{subProAno}/{subProCod}/{metAnoPlaTec}")]
        public dynamic BuscarMonitoreoForm(string subProAno, string subProCod, string metAnoPlaTec)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var result = _metas.BuscarMetasPorSubProyecto(identity, subProAno, subProCod, metAnoPlaTec);
            return Ok(result);
        }

        [HttpPost]
        public dynamic ActualizarMetas(MetasDto metasDto)
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
            if (!_usuarios.TienePermiso(usuario.UsuAno, usuario.UsuCod, "INSERTAR ESTADO") && usuario.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para insertar estados",
                    result = ""
                };
            }

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

            dynamic data = rToken.result;
            Usuario usuario = new Usuario
            {
                UsuAno = data.UsuAno,
                UsuCod = data.UsuCod,
                RolCod = data.RolCod
            };
            if (!_usuarios.TienePermiso(usuario.UsuAno, usuario.UsuCod, "INSERTAR ESTADO") && usuario.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para insertar estados",
                    result = ""
                };
            }

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


    }
}
