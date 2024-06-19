using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using SistemaMEAL.Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Security.Cryptography;
using SistemaMEAL.Server.Modulos;

namespace SistemaMEAL.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BeneficiarioController : ControllerBase
    {
        private readonly BeneficiarioDAO _beneficiarios;
        private readonly UsuarioDAO _usuarios;

        public BeneficiarioController(BeneficiarioDAO beneficiarios, UsuarioDAO usuarios)
        {
            _beneficiarios = beneficiarios;
            _usuarios = usuarios;
        }

        [HttpGet]
        public dynamic Listado()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);
           
            // var resultado = _beneficiarios.Listado(identity);
            var resultado = _beneficiarios.ListadoNormal(identity);
            return Ok(resultado);
        }

        [HttpGet]
        [Route("{benAno}/{benCod}")]
        public dynamic Buscar(string benAno, string benCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            dynamic data = rToken.result;
            Usuario usuario = new Usuario
            {
                UsuAno = data.UsuAno,
                UsuCod = data.UsuCod,
                RolCod = data.RolCod

            };
            if (usuario.RolCod != "01")
            {
                return StatusCode(403, new
                {
                    success = false,
                    message = "No tienes permisos para realizar esta acción",
                    result = ""
                });
            }
           
            var resultados = _beneficiarios.Listado(identity, benAno, benCod);
            var resultado = resultados.FirstOrDefault();
            return Ok(resultado);
        }

        [HttpGet]
        [Route("meta/{metAno}/{metCod}")]
        public dynamic BuscarMetaBeneficiario(string metAno, string metCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);
            var resultado = _beneficiarios.BuscarMetaBeneficiario(identity, metAno:metAno, metCod:metCod);
            return Ok(resultado);
        }

        [HttpPost]
        public dynamic Insertar(DocumentoBeneficiarioDto? documentoBeneficiarioDto)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return rToken;

            var (message, messageType) = _beneficiarios.InsertarBeneficiarioDocumento(identity, documentoBeneficiarioDto.Beneficiario, documentoBeneficiarioDto.DocumentoBeneficiario);
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
        [Route("masivo")]
        public dynamic InsertarMasivo(MetaBeneficiarioDto metaBeneficiarioDto)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return rToken;


            var (message, messageType) = _beneficiarios.InsertarBeneficiarioMasivo(identity, metaBeneficiarioDto.Beneficiarios, metaBeneficiarioDto.MetaBeneficiario);
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
        public dynamic Modificar(Beneficiario? beneficiario)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return rToken;

            var (message, messageType) = _beneficiarios.Modificar(identity, beneficiario);
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

        [HttpGet]
        [Route("documento/{docIdeCod}/{docIdeBenNum}")]
        public dynamic BuscarBeneficiarioPorDocumento(string docIdeCod, string docIdeBenNum)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);
           
            var beneficiarios = _beneficiarios.BuscarBeneficiarioPorDocumento(identity, docIdeCod:docIdeCod, docIdeBenNum:docIdeBenNum);
            var beneficiario = beneficiarios.FirstOrDefault();
            return Ok(beneficiario);
        }

         [HttpGet]
        [Route("nombres/{nombres}")]
        public dynamic BuscarBeneficiarioPorNombre(string nombres)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);
           
            var beneficiarios = _beneficiarios.BuscarBeneficiarioPorNombres(nombres);
            return Ok(beneficiarios);
        }

        [HttpGet]
        [Route("contar-home/{tags}/{periodoInicio}/{periodoFin}")]
        public dynamic ContarBeneficiariosHome(string? tags = null, string? periodoInicio = null, string? periodoFin = null)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var reult = _beneficiarios.ContarBeneficiariosHome(identity, tags, periodoInicio, periodoFin);
            return Ok(reult.FirstOrDefault());
        }
        
        [HttpGet]
        [Route("todos-home/{tags}/{periodoInicio}/{periodoFin}")]
        public dynamic BuscarBeneficiariosHome(string? tags = null, string? periodoInicio = null, string? periodoFin = null)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var reult = _beneficiarios.BuscarBeneficiariosHome(identity, tags, periodoInicio, periodoFin);
            return Ok(reult);
        }
        [HttpGet]
        [Route("ecuador-home/{tags}/{periodoInicio}/{periodoFin}")]
        public dynamic BuscarBeneficiariosEcuadorHome(string? tags = null, string? periodoInicio = null, string? periodoFin = null)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var reult = _beneficiarios.BuscarBeneficiariosEcuadorHome(identity, tags, periodoInicio, periodoFin);
            return Ok(reult);
        }
        [HttpGet]
        [Route("peru-home/{tags}/{periodoInicio}/{periodoFin}")]
        public dynamic BuscarBeneficiariosPerurHome(string? tags = null, string? periodoInicio = null, string? periodoFin = null)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var reult = _beneficiarios.BuscarBeneficiariosPerurHome(identity, tags, periodoInicio, periodoFin);
            return Ok(reult);
        }
        [HttpGet]
        [Route("colombia-home/{tags}/{periodoInicio}/{periodoFin}")]
        public dynamic BuscarBeneficiariosColombiaHome(string? tags = null, string? periodoInicio = null, string? periodoFin = null)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var reult = _beneficiarios.BuscarBeneficiariosColombiaHome(identity, tags, periodoInicio, periodoFin);
            return Ok(reult);
        }

        [HttpGet]
        [Route("sexo-home/{tags}/{periodoInicio}/{periodoFin}")]
        public dynamic BuscarSexoHome(string? tags = null, string? periodoInicio = null, string? periodoFin = null)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var reult = _beneficiarios.BuscarSexoHome(identity, tags, periodoInicio, periodoFin);
            return Ok(reult);
        }
        [HttpGet]
        [Route("rango-home/{tags}/{periodoInicio}/{periodoFin}")]
        public dynamic BuscarRangoHome(string? tags = null, string? periodoInicio = null, string? periodoFin = null)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var reult = _beneficiarios.BuscarRangoHome(identity, tags, periodoInicio, periodoFin);
            return Ok(reult);
        }

    }
}
