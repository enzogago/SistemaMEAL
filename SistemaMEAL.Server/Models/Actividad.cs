using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class Actividad
    {
        [Key, Column(Order = 0)]
        public String? ActAno { get; set; }
        [Key, Column(Order = 1)]
        public String? ActCod { get; set; }
        public String? ActNom { get; set; }
        public String? ActNum { get; set; }
        public String? UsuIng { get; set; }

        public DateTime? FecIng { get; set; }

        public String? UsuMod { get; set; }

        public DateTime? FecMod { get; set; }

        public char EstReg { get; set; }

        [ForeignKey("Resultado")]
        public String? ResAno { get; set; }

        [ForeignKey("Resultado")]
        public String? ResCod { get; set; }
        public String? ResNom { get; set; }
        public String? ResNum { get; set; }
        public String? ObjEspNom { get; set; }
        public String? ObjEspNum { get; set; }
        public String? ObjNum { get; set; }
        public String? ObjNom { get; set; }
        public String? SubProNom { get; set; }
        public String? SubProSap { get; set; }
        public String? ProNom { get; set; }
        public String? ProRes { get; set; }
        public String? ProPerAnoIni { get; set; }
        public String? ProPerMesIni { get; set; }
        public String? ProPerAnoFin { get; set; }
        public String? ProPerMesFin { get; set; }
        public List<Indicador>? Indicadores { get; set; }
    }
}
