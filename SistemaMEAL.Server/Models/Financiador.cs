using System.ComponentModel.DataAnnotations;

namespace SistemaMEAL.Server.Models
{
    public class Financiador
    {
        [Key]
        public String? FinCod { get; set; }
        public String? FinNom { get; set; }
        public String? FinIde { get; set; }
        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public Char? EstReg { get; set; }
    }
}
