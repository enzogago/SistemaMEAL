using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class Meta
    {
        [Key, Column(Order = 0)]
        public String? MetAno { get; set; }
        [Key, Column(Order = 1)]
        public String? MetCod { get; set; }
        [ForeignKey("Estado")]
        public String? EstCod { get; set; }
        public String? EstNom { get; set; }
        public String? EstCol { get; set; }
        public String? MetMetTec { get; set; }
        public String? MetEjeTec { get; set; }
        public String? MetPorAvaTec { get; set; }
        public String? MetMesPlaTec { get; set; }
        public String? MetAnoPlaTec { get; set; }
        public String? MetMetPre { get; set; }
        public String? MetEjePre { get; set; }
        public String? MetPorAvaPre { get; set; }
        public String? MetMesPlaPre { get; set; }
        public String? MetAnoPlaPre { get; set; }

        [ForeignKey("Implementador")]
        public String? ImpCod { get; set; }
        public String? ImpNom { get; set; }

        [ForeignKey("Ubicacion")]
        public String? UbiAno { get; set; }
        public String? UbiCod { get; set; }
        [ForeignKey("Indicador")]
        public String? IndAno { get; set; }
        public String? IndCod { get; set; }
        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public char EstReg { get; set; }

    }
}
