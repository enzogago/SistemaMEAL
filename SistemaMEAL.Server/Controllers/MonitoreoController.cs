using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using SistemaMEAL.Modulos;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;

namespace SistemaMEAL.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MonitoreoController : ControllerBase
    {
        private readonly MonitoreoDAO _monitoreos;
        private readonly UsuarioDAO _usuarios;

        public MonitoreoController(MonitoreoDAO monitoreos, UsuarioDAO usuarios)
        {
            _monitoreos = monitoreos;
            _usuarios = usuarios;
        }

        [HttpGet]
        [Route("Filter/{tags}/{periodoInicio}/{periodoFin}")]
        public dynamic Listado(string? tags = null, string? periodoInicio = null, string? periodoFin = null)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var monitoreos = _monitoreos.Listado(identity, tags, periodoInicio, periodoFin);
            return Ok(monitoreos);
        }


        [HttpGet]
        [Route("beneficiario/{benAno}/{benCod}")]
        public dynamic BuscarMonitoreoPorBeneficiario(string benAno, string benCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var resultData = _monitoreos.BuscarMonitoreoPorBeneficiario(benAno,benCod);
            return Ok(resultData);
        }

        [HttpPost]
        public dynamic Insertar(BeneficiarioMonitoreo beneficiarioMonitoreo)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var (message, messageType) = _monitoreos.InsertarBeneficiarioMonitoreo(identity, beneficiarioMonitoreo.Beneficiario, beneficiarioMonitoreo.MetaBeneficiario, beneficiarioMonitoreo.DocumentoBeneficiario);
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
        [Route("existe")]
        public dynamic InsertarMetaBeneficiarioExiste(MetaBeneficiario metaBeneficiario)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var (message, messageType) = _monitoreos.InsertarMetaBeneficiarioExiste(identity, metaBeneficiario);
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
        [Route("execution")]
        public dynamic InsertarMetaEjecucion(MetaEjecucion metaEjecucion)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var (message, messageType) = _monitoreos.InsertarMetaEjecucion(identity, metaEjecucion);
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

        [HttpDelete]
        [Route("eliminar-beneficiario")]
        public dynamic EliminarBeneficiarioMonitoreo(MetaBeneficiario metaBeneficiario)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return rToken;


            var (message, messageType) = _monitoreos.EliminarBeneficiarioMonitoreo(identity, metaBeneficiario);
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
                return new OkObjectResult(new {success = true, message });
            }
        }

        [HttpGet]
        [Route("todos-home/{tags}/{periodoInicio}/{periodoFin}")]
        public dynamic BuscarPaisesHome (string? tags = null, string? periodoInicio = null, string? periodoFin = null)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var reult = _monitoreos.BuscarPaisesHome(identity, tags, periodoInicio, periodoFin);
            return Ok(reult);
        }
        [HttpGet]
        [Route("ecuador-home/{tags}/{periodoInicio}/{periodoFin}")]
        public dynamic BuscarEcuadorHome (string? tags = null, string? periodoInicio = null, string? periodoFin = null)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var reult = _monitoreos.BuscarEcuadorHome(identity, tags, periodoInicio, periodoFin);
            return Ok(reult);
        }
        [HttpGet]
        [Route("peru-home/{tags}/{periodoInicio}/{periodoFin}")]
        public dynamic BuscarPeruHome (string? tags = null, string? periodoInicio = null, string? periodoFin = null)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var reult = _monitoreos.BuscarPeruHome(identity, tags, periodoInicio, periodoFin);
            return Ok(reult);
        }
        [HttpGet]
        [Route("colombia-home/{tags}/{periodoInicio}/{periodoFin}")]
        public dynamic BuscarColombiaHome (string? tags = null, string? periodoInicio = null, string? periodoFin = null)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var reult = _monitoreos.BuscarColombiaHome(identity, tags, periodoInicio, periodoFin);
            return Ok(reult);
        }

        [HttpGet]
        [Route("meta-form/{metAno}/{metCod}/{benAno}/{benCod}/{ubiAno}/{ubiCod}/{metBenAnoEjeTec}/{metBenMesEjeTec}")]
        public dynamic BuscarMonitoreoForm(string metAno, string metCod, string benAno, string benCod, string ubiAno, string ubiCod, string metBenAnoEjeTec, string metBenMesEjeTec)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var monitoreos = _monitoreos.BuscarMonitoreoForm(identity, metAno:metAno, metCod:metCod, benAno:benAno, benCod:benCod, ubiAno:ubiAno, ubiCod:ubiCod, metBenAnoEjeTec:metBenAnoEjeTec, metBenMesEjeTec:metBenMesEjeTec);
            var monitoreo = monitoreos.FirstOrDefault();
            return Ok(monitoreo);
        }

        [HttpPut]
        public dynamic Modificar(MetaBeneficiario? metaBeneficiario)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return rToken;


            var (message, messageType) = _monitoreos.ModificarMetaBeneficiario(identity, metaBeneficiario);
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
        [Route("meta-beneficiario")]
        public dynamic MoficiarMetaBeneficiario(BeneficiarioMonitoreo beneficiarioMonitoreo)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return rToken;

            var (message, messageType) = _monitoreos.ModificarBeneficiarioMonitoreo(identity, beneficiarioMonitoreo.Beneficiario, beneficiarioMonitoreo.MetaBeneficiario);
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
        [Route("meta-indicador")]
        public dynamic InsertarMetaIndicador(MetaIndicadorDto? metaIndicadorDto)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return rToken;

            var (message, messageType) = _monitoreos.InsertarMetaMonitoreo(identity, metaIndicadorDto.Meta, metaIndicadorDto.MetaIndicador);
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
        [Route("meta-indicador/{metAno}/{metCod}/{indAno}/{indCod}")]
        public dynamic BuscarMetaIndicador(string metAno, string metCod, string indAno, string indCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _monitoreos.BuscarMetaIndicador(identity, metAno, metCod, indAno, indCod);
            
            return Ok(data.FirstOrDefault());
        }

        [HttpDelete]
        [Route("meta-indicador/{metAno}/{metCod}/{metIndAno}/{metIndCod}")]
        public dynamic EliminarMetaIndicador(string metAno, string metCod, string metIndAno, string metIndCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return rToken;

            var (message, messageType) = _monitoreos.EliminarMetaIndicador(identity, metAno, metCod, metIndAno, metIndCod);
            if (messageType == "1")
            {
                return BadRequest(message);
            }
            else if (messageType == "2")
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