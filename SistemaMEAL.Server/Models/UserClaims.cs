using System.Security.Claims;

namespace SistemaMEAL.Server.Models
{
    public class UserClaims
    {
        public string? UsuAno { get; set; }
        public string? UsuCod { get; set; }
        public string? UsuIp { get; set; }
        public string? UsuNom { get; set; }
        public string? UsuApe { get; set; }
        public string? UsuNomUsu { get; set; }

        public UserClaims GetClaimsFromIdentity(ClaimsIdentity? identity)
        {
            if (identity != null)
            {
                return new UserClaims
                {
                    UsuAno = identity.Claims.FirstOrDefault(x => x.Type == "USUANO")?.Value,
                    UsuCod = identity.Claims.FirstOrDefault(x => x.Type == "USUCOD")?.Value,
                    UsuIp = identity.Claims.FirstOrDefault(x => x.Type == "USUIP")?.Value,
                    UsuNom = identity.Claims.FirstOrDefault(x => x.Type == "USUNOM")?.Value,
                    UsuApe = identity.Claims.FirstOrDefault(x => x.Type == "USUAPE")?.Value,
                    UsuNomUsu = identity.Claims.FirstOrDefault(x => x.Type == "USUNOMUSU")?.Value
                };
            }
            else
            {
                // Maneja el caso en que identity es null, por ejemplo, devolviendo un UserClaims vacío
                return new UserClaims();
            }
        }
    }
}
