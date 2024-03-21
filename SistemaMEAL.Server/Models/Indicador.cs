using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class Indicador
    {
        [Key, Column(Order = 0)]
        public String? IndAno { get; set; }
        [Key, Column(Order = 1)]
        public String? IndCod { get; set; }
        public String? IndNom { get; set; }
        public String? IndNum { get; set; }
        public String? UniCod { get; set; }
        public String? UniNom { get; set; }
        public String? TipValCod { get; set; }
        public String? TipValNom { get; set; }
        public String? IndTipInd { get; set; }
        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public char EstReg { get; set; }

        [ForeignKey("Actividad")]
        public String? ActAno { get; set; }
        [ForeignKey("Actividad")]
        public String? ActCod { get; set; }
        public String? ActNom { get; set; }
        public String? ActNum { get; set; }
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
    }
}
