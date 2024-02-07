using System.ComponentModel.DataAnnotations;

namespace SistemaMEAL.Server.Models
{
    public class Genero
    {
        [Key]
        public String? GenCod { get; set; }

        public String? GenNom { get; set; }

        public String? UsuIng { get; set; }

        public DateTime? FecIng { get; set; }

        public String? UsuMod { get; set; }

        public DateTime? FecMod { get; set; }

        public char EstReg { get; set; }
    }
}
