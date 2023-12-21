namespace SistemaMEAL.Server.Models
{
    public class Jwt
    {
        public String? Key { get; set; }
        public String? Issuer { get; set; }
        public String? Audience { get; set; }
        public String? Subject { get; set; }

    }
}
