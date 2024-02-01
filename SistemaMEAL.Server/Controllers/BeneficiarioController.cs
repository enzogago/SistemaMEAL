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

        [HttpPost]
        public dynamic Insertar(Beneficiario beneficiario)
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

            var (benAno, benCod, message, messageType) = _beneficiarios.Insertar(beneficiario);
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
                return new OkObjectResult(new { benAno = benAno, benCod = benCod, success = true, message = message });
            }
        }

    }
}
