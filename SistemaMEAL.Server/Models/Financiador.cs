using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class Financiador
    {
        [Key]
        public String? FinCod { get; set; }
        public String? FinNom { get; set; }
        public String? FinIde { get; set; }
        public String? FinSap { get; set; }
        [ForeignKey("Moneda")]
        public String? MonCod { get; set; }
        public String? MonNom { get; set; }
        public String? MonAbr { get; set; }
        public String? MonSim { get; set; }
        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public Char? EstReg { get; set; }
    }
}
