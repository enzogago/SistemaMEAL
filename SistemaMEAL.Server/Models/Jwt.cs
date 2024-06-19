using Microsoft.AspNetCore.Mvc;
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

        public static dynamic validarToken(ClaimsIdentity? identity, UsuarioDAO usuarios)
        {
            if (identity == null)
            {
                return new
                {
                    success = false,
                    message = "No se pudo obtener la identidad del usuario",
                    result = ""
                };
            }

            try
            {
                var tokenValidationResult = ValidateToken(identity);
                if (!tokenValidationResult.success)
                {
                    return tokenValidationResult; // Unauthorized
                }

                var userValidationResult = ValidateUser(identity, usuarios);
                if (!userValidationResult.success)
                {
                    return userValidationResult; // Not Found
                }
                return new
                {
                    success = true,
                    message = "Usuario autenticado correctamente",
                    result = userValidationResult.result
                };
            }
            catch (Exception ex)
            {
                return new
                {
                    success = false,
                    message = "Catch: " + ex.Message,
                    result = ex
                };
            }
        }

        public static dynamic ValidateToken(ClaimsIdentity? identity)
        {
            if (identity == null)
            {
                return new
                {
                    success = false,
                    message = "No se pudo obtener la identidad del usuario",
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

            return new
            {
                success = true,
                message = "Token validado correctamente",
                result = ""
            };
        }

        private static dynamic ValidateUser(ClaimsIdentity identity, UsuarioDAO usuarios)
        {
            var ano = identity.Claims.FirstOrDefault(x => x.Type == "USUANO")?.Value;
            var cod = identity.Claims.FirstOrDefault(x => x.Type == "USUCOD")?.Value;
            
            // Buscar usuario
            var usuario = usuarios.Listado(identity, usuAno: ano, usuCod: cod).FirstOrDefault();
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
                message = "Usuario validado correctamente",
                result = usuario
            };
        }

    }
}
