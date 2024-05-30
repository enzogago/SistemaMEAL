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

        [HttpGet("todos")]
        public dynamic Buscar()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var result = _ubicaciones.Buscar(identity);
            return Ok(result);
        }

        [HttpGet("activo")]
        public dynamic BuscarUbicacionesActivo()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var result = _ubicaciones.Buscar(identity, ubiEst:"A");
            return Ok(result);
        }

        [HttpGet]
        public dynamic BuscarPaises()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var result = _ubicaciones.Buscar(identity, ubiTip: "PAIS", ubiEst:"A");
            return Ok(result);
        }

        [HttpGet("subproyecto/{subProAno}/{subProCod}")]
        public dynamic BuscarUbicacionesSubProyecto(string subProAno, string subProCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);
            
            var implementadores = _ubicaciones.BuscarUbicacionesSubProyecto(identity, subProAno:subProAno, subProCod:subProCod);
            return Ok(implementadores);
        }


        [HttpGet("{ubiAno}/{ubiCod}")]
        public dynamic ListadoJerarquiaUbicacion(string ubiAno, string ubiCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var result = _ubicaciones.Buscar(identity, ubiAnoPad: ubiAno, ubiCodPad: ubiCod, ubiEst:"A");
            return Ok(result);
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

        [HttpPost]
        [Route("acceso")]
        public dynamic AccesoUbicaciones(UbicacionDto ubicacionDto)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var (message, messageType) = _ubicaciones.AccesoUbicaciones(identity, ubicacionDto.UbicacionActivo, ubicacionDto.UbicacionInactivo);
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