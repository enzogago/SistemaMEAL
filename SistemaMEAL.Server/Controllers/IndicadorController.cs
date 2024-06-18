using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using SistemaMEAL.Modulos;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;


namespace SistemaMEAL.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IndicadorController : ControllerBase
    {
        private readonly IndicadorDAO _indicadores;
        private readonly UsuarioDAO _usuarios;

        public IndicadorController(IndicadorDAO indicadores, UsuarioDAO usuarios)
        {
            _indicadores = indicadores;
            _usuarios = usuarios;
        }

        [HttpGet("sin-actividad")]
        public dynamic BuscarSinActividad()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _indicadores.BuscarSinActividad(identity);
            return Ok(data);
        }

        [HttpGet("tipo-actividad")]
        public dynamic BuscarSoloActividad()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _indicadores.Buscar(identity, indTipInd: "IAC");
            return Ok(data);
        }

        [HttpGet]
        public dynamic Buscar()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _indicadores.Buscar(identity);
            return Ok(data);
        }

        [HttpGet("jerarquia/{indAno}/{indCod}")]
        public dynamic BuscarIndicador(string indAno, string indCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _indicadores.Buscar(identity, indAno:indAno,indCod:indCod);
            return Ok(data.FirstOrDefault());
        }

        [HttpGet("subproyecto/{subProAno}/{subProCod}")]
        public dynamic BuscarIndicadorPorSubproyecto(string subProAno, string subProCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _indicadores.Buscar(identity, subProAno:subProAno, subProCod:subProCod);
            return Ok(data);
        }
        
        [HttpGet("cadena/{subProAno}/{subProCod}")]
        public dynamic BuscarCadenaPorPeriodo(string subProAno, string subProCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _indicadores.BuscarCadenaPorPeriodo(identity, subProAno:subProAno,subProCod:subProCod);
            return Ok(data);
        }

        [HttpGet("cadena/{subProAno}/{subProCod}/{carResPerAno}")]
        public dynamic BuscarCadenaPorPeriodoAno(string subProAno, string subProCod, string carResPerAno)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _indicadores.BuscarCadenaPorPeriodo(identity, subProAno:subProAno, subProCod:subProCod, carResPerAno:carResPerAno);
            return Ok(data);
        }

        [HttpGet("cadena-actividad/{subProAno}/{subProCod}/{carResPerAno}")]
        public dynamic BuscarCadenaPorPeriodoAnoActividad(string subProAno, string subProCod, string carResPerAno)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _indicadores.BuscarCadenaPorPeriodo(identity, subProAno:subProAno, subProCod:subProCod, carResPerAno:carResPerAno, indTipInd: "IAC");
            return Ok(data);
        }

        [HttpGet("implementador/{subProAno}/{subProCod}")]
        public dynamic BuscarCadenaPorImplementador(string subProAno, string subProCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _indicadores.BuscarCadenaPorImplementador(identity, subProAno:subProAno,subProCod:subProCod);
            return Ok(data);
        }
        [HttpGet("ubicacion/{subProAno}/{subProCod}")]
        public dynamic BuscarCadenaPorUbicacion(string subProAno, string subProCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _indicadores.BuscarCadenaPorUbicacion(identity, subProAno:subProAno,subProCod:subProCod);
            return Ok(data);
        }

        // CASO PRESUPUESTO
        [HttpGet("subproyecto-actividad/{subProAno}/{subProCod}")]
        public dynamic BuscarIndicadorPorSubproyectoActividad(string subProAno, string subProCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _indicadores.Buscar(identity, subProAno:subProAno ,subProCod:subProCod, indTipInd: "IAC");
            return Ok(data);
        }
        
        [HttpGet("cadena-actividad/{subProAno}/{subProCod}")]
        public dynamic BuscarCadenaPorPeriodoActividad(string subProAno, string subProCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _indicadores.BuscarCadenaPorPeriodo(identity, subProAno:subProAno,subProCod:subProCod, indTipInd: "IAC");
            return Ok(data);
        }

        [HttpGet("implementador-actividad/{subProAno}/{subProCod}")]
        public dynamic BuscarCadenaPorImplementadorActividad(string subProAno, string subProCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _indicadores.BuscarCadenaPorImplementador(identity, subProAno:subProAno,subProCod:subProCod, indTipInd: "IAC");
            return Ok(data);
        }
        [HttpGet("financiador-actividad/{subProAno}/{subProCod}")]
        public dynamic BuscarCadenaPorFinanciadorActividad(string subProAno, string subProCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _indicadores.BuscarCadenaPorFinanciador(identity, subProAno:subProAno, subProCod:subProCod, indTipInd: "IAC");
            return Ok(data);
        }
        [HttpGet("ubicacion-actividad/{subProAno}/{subProCod}")]
        public dynamic BuscarCadenaPorUbicacionActividad(string subProAno, string subProCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _indicadores.BuscarCadenaPorUbicacion(identity, subProAno:subProAno,subProCod:subProCod, indTipInd: "IAC");
            return Ok(data);
        }

        [HttpPost]
        public dynamic Insertar(Indicador indicador)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return rToken;

            var (ano, cod, message, messageType) = _indicadores.Insertar(identity, indicador);
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
                return new OkObjectResult(new { ano, cod, success = true, message });
            }
        }

        [HttpPut]
        public dynamic Modificar(Indicador indicador)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return rToken;

            var (message, messageType) = _indicadores.Modificar(identity, indicador);
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
        public dynamic Eliminar(Indicador indicador)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return rToken;

            var (message, messageType) = _indicadores.Eliminar(identity, indicador);
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

        [HttpPut("cadena-indicador-presupuesto")]
        public dynamic ModificarCadenaIndicadorPresupuesto(CadenaIndicadorDto cadenaIndicadorDto)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return rToken;

            var (message, messageType) = _indicadores.ModificarCadenaIndicadorPresupuesto(identity, cadenaIndicadorDto.CadenaPeriodos, cadenaIndicadorDto.CadenaImplementadores, cadenaIndicadorDto.CadenaFinanciadores, cadenaIndicadorDto.CadenaUbicaciones, cadenaIndicadorDto.Indicadores);
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

        [HttpPut("cadena-indicador-programatico")]
        public dynamic ModificarCadenaIndicadorTecnico(CadenaIndicadorDto cadenaIndicadorDto)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return rToken;

            var (message, messageType) = _indicadores.ModificarCadenaIndicadorTecnico(identity, cadenaIndicadorDto.CadenaPeriodos, cadenaIndicadorDto.CadenaImplementadores, cadenaIndicadorDto.CadenaUbicaciones, cadenaIndicadorDto.Indicadores);
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
