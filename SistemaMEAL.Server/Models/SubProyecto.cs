using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
   public class SubProyecto
    {
        [Key, Column(Order = 0)]
        public String? SubProAno { get; set; }

        [Key, Column(Order = 1)]
        public String? SubProCod { get; set; }

        public String? SubProNom { get; set; }

        public String? SubProSap { get; set; }

        public String? UsuIng { get; set; }

        public DateTime? FecIng { get; set; }

        public String? UsuMod { get; set; }

        public DateTime? FecMod { get; set; }

        public char EstReg { get; set; }

        [ForeignKey("Proyecto")]
        public String? ProAno { get; set; }

        [ForeignKey("Proyecto")]
        public String? ProCod { get; set; }
        public String? ProNom { get; set; }
        public String? ProRes { get; set; }
        public String? ProPerAnoIni { get; set; }
        public String? ProPerMesIni { get; set; }
        public String? ProPerAnoFin { get; set; }
        public String? ProPerMesFin { get; set; }
        public String? ProInvSubAct { get; set; }
        public List<Objetivo>? Objetivos { get; set; }
    }
}
