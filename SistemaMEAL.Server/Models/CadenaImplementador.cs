using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class CadenaImplementador
    {
        [Key, Column(Order = 0)]
        public String? IndAno { get; set; }
        [Key, Column(Order = 1)]
        public String? IndCod { get; set; }
        [Key, Column(Order = 2)]
        public String? ImpCod { get; set; }
        public String? CadResImpMetTec { get; set; }
        public String? CadResImpMetPre { get; set; }
        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public Char? EstReg { get; set; }
    }
}