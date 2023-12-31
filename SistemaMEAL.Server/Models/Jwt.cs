﻿using Microsoft.AspNetCore.Mvc;
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

        private static dynamic ValidateToken(ClaimsIdentity identity)
        {
            if (identity.Claims.Count() == 0)
            {
                return new
                {
                    success = false,
                    message = "Sesion inválida",
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
                message = "Usuario validado correctamente",
                result = usuario
            };
        }

    }
}
