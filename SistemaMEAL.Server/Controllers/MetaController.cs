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


    }
}
