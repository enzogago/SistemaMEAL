using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class CadenaFinanciador
    {
        [Key, Column(Order = 0)]
        public String? IndAno { get; set; }
        [Key, Column(Order = 1)]
        public String? IndCod { get; set; }
        [Key, Column(Order = 2)]
        public String? FinCod { get; set; }
        public String? CadResFinMetPre { get; set; }
        public String? FinNom { get; set; }
        public String? FinSap { get; set; }
        public String? FinIde { get; set; }
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