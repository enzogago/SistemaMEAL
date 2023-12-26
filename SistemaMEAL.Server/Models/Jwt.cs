using SistemaMEAL.Server.Modulos;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace SistemaMEAL.Server.Models
{
    public class Jwt
    {
        public String? Key { get; set; }
        public String? Issuer { get; set; }
        public String? Audience { get; set; }
        public String? Subject { get; set; }

        public static dynamic validarToken(ClaimsIdentity identity, UsuarioDAO usuarios)
        {
            try
            {
                if (identity.Claims.Count() == 0)
                {
                    return new
                    {
                        success = false,
                        message = "Verificar si estas enviando un token válido",
                        result = ""
                    };
                }

                var expClaim = identity.Claims.FirstOrDefault(x => x.Type == "exp");
                if (expClaim != null)
                {
                    var expValue = expClaim.Value;
                    var expDate = DateTimeOffset.FromUnixTimeSeconds(long.Parse(expValue)).UtcDateTime;

                    if (expDate < DateTime.UtcNow)
                    {
                        return new
                        {
                            success = false,
                            message = "La sesión ha expirado",
                            result = "expired"
                        };
                    }
                }

                var ano = identity.Claims.FirstOrDefault(x => x.Type == "ANO").Value;
                var cod = identity.Claims.FirstOrDefault(x => x.Type == "COD").Value;

                // Buscar usuario
                var usuario = usuarios.BuscarUsuario(ano, cod);
                if (usuario == null)
                {
                    return new
                    {
                        success = false,
                        message = "Usuario no encontrado",
                        result = ""
                    };
                }

                return new
                {
                    success = true,
                    message = "Usuario autenticado correctamente",
                    result = usuario
                };
            }
            catch (Exception ex)
            {
                return new
                {
                    success = false,
                    message = "Catch: " + ex.Message,
                    result = ""
                };
            }
        }

    }
}
