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
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return rToken;

            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(usuario.UsuPas.ToLower()));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                usuario.UsuPas = builder.ToString();
            }

            var (usuAno, usuCod, message, messageType) = _usuarios.Insertar(identity, usuario);
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
                return new OkObjectResult(new { usuAno, usuCod, success = true, message });
            }
        }

        [HttpPut("{usuAno}/{usuCod}")]
        public dynamic Modificar(string usuAno, string usuCod, [FromBody] Usuario usuario)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return rToken;
            
            usuario.UsuAno = usuAno;
            usuario.UsuCod = usuCod;
            var (message, messageType) = _usuarios.Modificar(identity, usuario);
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

        [HttpPut("profile")]
        public dynamic ModificarPerfilUsuario(Usuario usuario)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return rToken;

            var (message, messageType, user) = _usuarios.ModificarPerfilUsuario(identity, usuario);
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
                return new OkObjectResult(new { success = true, message, user });
            }
        }

        [HttpPut("update-avatar")]
        public dynamic ModificarAvatarUsuario(Usuario usuario)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return rToken;

            var (message, messageType, user) = _usuarios.ModificarAvatarUsuario(identity, usuario);
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
                return new OkObjectResult(new { success = true, message, user });
            }
        }


        [HttpPut]
        [Route("restablecerPassword")]
        public dynamic RestablecerPassword(Usuario usuario)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return rToken;

            dynamic data = rToken.result;
            Usuario usuarioActual = new Usuario
            {
                UsuAno = data.UsuAno,
                UsuCod = data.UsuCod,
                RolCod = data.RolCod
            };
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
            var (message, messageType) = _usuarios.RestablecerPassword(identity, usuario);
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
                return new OkObjectResult(new {success = true, message });
            }
        }

        [HttpPut]
        [Route("forgot-restablecer")]
        public dynamic RestablecerPasswordOlvidada(Usuario usuario)
        {
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
            var (message, messageType) = _usuarios.RestablecerPasswordOlvidada(usuario);
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
                return new OkObjectResult(new {success = true, message });
            }
        }


        [HttpGet]
        public dynamic Listado()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

           
            var usuarios = _usuarios.Listado(identity);
            return Ok(usuarios);
        }

        [HttpGet]
        [Route("tecnico/{usuAccAno}/{usuAccCod}")]
        public dynamic BuscarUsuariosTecnico(string usuAccAno, string usuAccCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var usuarios = _usuarios.BuscarUsuariosMeta(identity, rolCod: "04", usuAccAno:usuAccAno, usuAccCod:usuAccCod, usuAccTip: "SUB_PROYECTO");
            return Ok(usuarios);
        }

        [HttpGet]
        [Route("coordinador")]
        public dynamic BuscarUsuariosCoordinador()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var usuarios = _usuarios.Listado(identity, rolCod: "02");
            return Ok(usuarios);
        }

        [HttpGet]
        [Route("forgot-password/{usuCorEle}")]
        public dynamic BuscarUsuarioPorCorreo(string usuCorEle)
        {
            var result = _usuarios.Listado(usuCorEle:usuCorEle);
            return Ok(result.FirstOrDefault());
        }

        [HttpGet]
        [Route("{usuAno}/{usuCod}")]
        public dynamic ObtenerUsuario(string usuAno, string usuCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);
           
            var usuarios = _usuarios.Listado(identity, usuAno:usuAno, usuCod:usuCod);
            var usuarioData = usuarios.FirstOrDefault();
            return Ok(usuarioData);
        }


        [HttpPost]
        [Route("login")]
        public dynamic IniciarSesion([FromBody] Object optData)
        {
            var data = JsonConvert.DeserializeObject<dynamic>(optData.ToString());

            string? email = data?.email.ToString();
            string? password = data?.password.ToString();
            string? clientIp = data?.clientIp.ToString();
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
            var usuario = _usuarios.Listado(usuCorEle: email, usuPas: password).FirstOrDefault();
            if (usuario == null)
            {
                return new
                {
                    success = false,
                    message = "Credenciales incorrectas o usuario inactivo",
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
                new Claim("USUANO", usuario.UsuAno),
                new Claim("USUCOD", usuario.UsuCod),
                new Claim("USUIP", clientIp),
                new Claim("USUNOM", usuario.UsuNom),
                new Claim("USUAPE", usuario.UsuApe),
                new Claim("USUNOMUSU", usuario.UsuNomUsu)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key));
            var singIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                jwt.Issuer,
                jwt.Audience,
                claims,
                expires: DateTime.Now.AddMonths(1),
                signingCredentials: singIn
            );

            return new
            {
                success = true,
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

            if (!rToken.success) // Error
            {
                return new UnauthorizedObjectResult(rToken);
            } 
            else // Registro modificado correctamente
            {
                return new OkObjectResult(rToken);
            }
        }

        [HttpDelete]
        [Route("{usuAno}/{usuCod}")]
        public dynamic Eliminar(string usuAno, string usuCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return rToken;

            var (message, messageType) = _usuarios.Eliminar(identity, usuAno, usuCod);
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
                return new OkObjectResult(new {success = true, message });
            }
        }

        [HttpGet]
        [Route("access/{usuAno}/{usuCod}")]
        public dynamic BuscarMetasUsuario(string usuAno, string usuCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var result = _usuarios.BuscarUsuarioAcceso(identity, usuAno:usuAno, usuCod:usuCod);
            return Ok(result);
        }

        [HttpPost]
        [Route("access")]
        public dynamic InsertarMetaUsuario(UsuarioAccesoDto usuarioAccesoDto)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.ValidateToken(identity);

            if (!rToken.success) return Unauthorized(rToken);

            var (message, messageType) = _usuarios.InsertarUsuarioAcceso(identity, usuarioAccesoDto.AccesosInsertar, usuarioAccesoDto.AccesosEliminar);
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
