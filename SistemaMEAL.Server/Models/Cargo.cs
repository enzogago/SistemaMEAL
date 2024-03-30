using System.ComponentModel.DataAnnotations;

namespace SistemaMEAL.Server.Models
{
    public class Cargo
    {
        [Key]
        public String? CarCod { get; set; }
        public String? CarNom { get; set; }
        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public char EstReg { get; set; }
    }
}
