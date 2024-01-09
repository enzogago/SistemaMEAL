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
    [Route("usuario")]
    public class UsuarioController : ControllerBase
    {
        private readonly UsuarioDAO _usuarios;
        public IConfiguration _configuration { get; set; }

        public UsuarioController(IConfiguration configuration, UsuarioDAO usuarios) { 
            _configuration = configuration;
            _usuarios = usuarios;
        }


        [HttpPost]
        public dynamic Insertar(Usuario usuario)
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

            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(usuario.UsuPas));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                usuario.UsuPas = builder.ToString();
            }

            var (message, messageType) = _usuarios.Insertar(usuario);
            if (messageType == "1") // Error
            {
                return BadRequest(message);
            }
            else if (messageType == "2") // Registro ya existe
            {
                return Conflict(message);
            }
            else // Registro insertado correctamente
            {
                return Ok(message);
            }
        }

        [HttpPut("{usuAno}/{usuCod}")]
        public dynamic Modificar(string usuAno, string usuCod, [FromBody] Usuario usuario)
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
                    message = "No tienes permisos para modificar usuarios",
                    result = ""
                };
            }

            usuario.UsuAno = usuAno;
            usuario.UsuCod = usuCod;
            var (message, messageType) = _usuarios.Modificar(usuario);
            if (messageType == "1") // Error
            {
                return BadRequest(message);
            }
            else if (messageType == "2") // Registro ya existe
            {
                return Conflict(message);
            }
            else // Registro modificado correctamente
            {
                return Ok(message);
            }
        }


        [HttpGet]
        public dynamic Listado()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

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
           
            var usuarios = _usuarios.Listado();
            return Ok(usuarios);
        }


        [HttpPost]
        [Route("login")]
        public dynamic IniciarSesion([FromBody] Object optData)
        {
            var data = JsonConvert.DeserializeObject<dynamic>(optData.ToString());

            string email = data.email.ToString();
            string password = data.password.ToString();

            // Haz hash de la contraseña proporcionada
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                password = builder.ToString();
            }
            // Recorrer usuarios y validar si hay un usuario con ese email
            var usuario = _usuarios.ValidarUsuario(email, password);
            if (usuario == null)
            {
                return new
                {
                    success = false,
                    message = "Credenciales incorrectas",
                    result = ""
                };
            }

            var jwt = _configuration.GetSection("Jwt").Get<Jwt>();

            var now = DateTime.UtcNow;
            var secondsSinceEpoch = Math.Round((now - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalSeconds);


            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, jwt.Subject),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, secondsSinceEpoch.ToString(), ClaimValueTypes.Integer64),
                new Claim("ANO", usuario.UsuAno),
                new Claim("COD", usuario.UsuCod)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key));
            var singIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                    jwt.Issuer,
                    jwt.Audience,
                    claims,
                    expires: DateTime.Now.AddMinutes(30),
                    signingCredentials: singIn
                );
            return new
            {
                success = true,
                // token,
                result = new JwtSecurityTokenHandler().WriteToken(token),
                user = usuario,
                message = "Usuario autenticado correctamente"
            };

        }

        [HttpGet]
        [Route("perfil")]
        public dynamic ValidarUsuario()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            dynamic rToken = Jwt.validarToken(identity, _usuarios);
            Console.WriteLine("DESDE GRANDE"+rToken);

            if (!rToken.success) return Unauthorized(rToken);
            dynamic data = rToken.result;
            Console.WriteLine(data);

            return Ok(data);
        }

    }
}
