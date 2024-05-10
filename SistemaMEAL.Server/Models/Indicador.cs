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
        public String? IndTotPre { get; set; }
        public String? IndLinBas { get; set; }
        public String? IndFor{ get; set; }
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
       public String? ResAno { get; set; }
       public String? ResCod { get; set; }
       public String? ResNom { get; set; }
        public String? ResNum { get; set; }
        public String? ObjEspAno { get; set; }
        public String? ObjEspCod { get; set; }
        public String? ObjEspNom { get; set; }
        public String? ObjEspNum { get; set; }
        public String? ObjAno { get; set; }
        public String? ObjCod { get; set; }
        public String? ObjNum { get; set; }
        public String? ObjNom { get; set; }
        public String? SubProAno { get; set; }
        public String? SubProCod { get; set; }
        public String? SubProNom { get; set; }
        public String? SubProSap { get; set; }
        public String? ProAno { get; set; }
        public String? ProCod { get; set; }
        public String? ProNom { get; set; }
        public String? ProIde { get; set; }
        public String? SubProRes { get; set; }
        public String? SubProPerAnoIni { get; set; }
        public String? SubProPerMesIni { get; set; }
        public String? SubProPerAnoFin { get; set; }
        public String? SubProPerMesFin { get; set; }
        public String? SubProInvSubAct { get; set; }
         public List<Meta>? Metas { get; set; }
    }
}
