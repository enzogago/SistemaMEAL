using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class CadenaIndicador
    {
        [Key, Column(Order = 0)]
        public String? IndAno { get; set; }

        [Key, Column(Order = 1)]
        public String? IndCod { get; set; }
        public String? IndNom { get; set; }
        public String? IndNum { get; set; }
        public String? ProNom { get; set; }
        [Key, Column(Order = 2)]
        public String? CadResPerAno { get; set; }
        public String? CadResPerMetTec { get; set; }
        public String? CadResPerMetPre { get; set; }
        public String? UbiAno { get; set; }
        public String? UbiCod { get; set; }
        public String? UbiNom { get; set; }
        public String? CadResUbiMetTec { get; set; }
        public String? CadResUbiMetPre { get; set; }
        public String? ImpCod { get; set; }
        public String? ImpNom { get; set; }
        public String? CadResImpMetTec { get; set; }
        public String? CadResImpMetPre { get; set; }
        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public Char? EstReg { get; set; }
    }
}