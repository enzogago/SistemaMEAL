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
        public dynamic Listado()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var monitoreos = _monitoreos.Listado();
            Console.WriteLine(monitoreos);
            return Ok(monitoreos);
        }

        [HttpGet]
        [Route("{metAno}/{metCod}")]
        public dynamic BuscarMonitoreo(string metAno, string metCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var monitoreos = _monitoreos.BuscarMonitoreo(metAno,metCod);
            var monitoreo = monitoreos.FirstOrDefault();
            return Ok(monitoreo);
        }

        [HttpGet]
        [Route("autocomplete/{proAno}/{proCod}")]
        public dynamic ListarIndicadorActividad(string proAno, string proCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _monitoreos.ListarIndicadorActividad(proAno,proCod);
            return Ok(data);
        }

        [HttpPost]
        public dynamic Insertar(BeneficiarioMonitoreo beneficiarioMonitoreo)
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
            var (message, messageType) = _monitoreos.InsertarBeneficiarioMonitoreo(beneficiarioMonitoreo.Beneficiario, beneficiarioMonitoreo.MetaBeneficiario);
            if (messageType == "1") // Error
            {
                return new BadRequestObjectResult(new { success = false, message = message });
            }
            else if (messageType == "2") // Registro ya existe
            {
                return new ConflictObjectResult(new { success = false, message = message });
            }
            else // Registro modificado correctamente
            {
                return new OkObjectResult(new { success = true, message = message });
            }
        }

    }

}