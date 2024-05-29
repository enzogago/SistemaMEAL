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
        public String? ProCod { get; set; }
        public String? ProIde { get; set; }
        public String? ProNom { get; set; }
        public String? SubProRes { get; set; }
        public String? SubProPerAnoIni { get; set; }
        public String? SubProPerMesIni { get; set; }
        public String? SubProPerAnoFin { get; set; }
        public String? SubProPerMesFin { get; set; }
        public String? SubProInvSubAct { get; set; }
        [ForeignKey("Usuario")]
        public String? UsuAno { get; set; }
        public String? UsuCod { get; set; }
        public String? UsuNom { get; set; }
        public String? UsuApe { get; set; }
        public List<Objetivo>? Objetivos { get; set; }
    }
}
