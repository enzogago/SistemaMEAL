using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using SistemaMEAL.Modulos;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;

namespace SistemaMEAL.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UbicacionController : ControllerBase
    {
        private readonly UbicacionDAO _ubicaciones;
        private readonly UsuarioDAO _usuarios;

        public UbicacionController(UbicacionDAO ubicaciones, UsuarioDAO usuarios)
        {
            _ubicaciones = ubicaciones;
            _usuarios = usuarios;
        }

        [HttpGet]
        public dynamic ListadoPaises()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var paises = _ubicaciones.ListadoPaises();
            return Ok(paises);
        }


        [HttpGet("{ubiAno}/{ubiCod}")]
        public dynamic ListadoJerarquiaUbicacion(string ubiAno, string ubiCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var ubicaciones = _ubicaciones.ListadoJerarquiaUbicacion(ubiAno, ubiCod);
            return Ok(ubicaciones);
        }

        [HttpGet("select/{ubiAno}/{ubiCod}")]
        public dynamic ListadoUbicacioSelect(string ubiAno, string ubiCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var ubicaciones = _ubicaciones.ListadoUbicacioSelect(ubiAno, ubiCod);
            return Ok(ubicaciones);
        }


    }

}