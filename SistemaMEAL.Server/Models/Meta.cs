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
        [ForeignKey("Financiador")]
        public String? FinCod { get; set; }
        public String? FinNom { get; set; }
        public String? FinIde { get; set; }
        [ForeignKey("Implementador")]
        public String? ImpCod { get; set; }
        public String? ImpNom { get; set; }

        [ForeignKey("Ubicacion")]
        public String? UbiAno { get; set; }
        public String? UbiCod { get; set; }
        public String? UbiNom { get; set; }
        [ForeignKey("Indicador")]
        public String? IndAno { get; set; }
        public String? IndCod { get; set; }
        public String? IndNom { get; set; }
        public String? IndNum { get; set; }
        public String? IndTipInd { get; set; }
        public String? UsuAno { get; set; }
        public String? UsuCod { get; set; }
        public String? UsuNom { get; set; }
        public String? UsuApe { get; set; }
        public String? UniNom { get; set; }
        public String? UniInvPer { get; set; }

        public String? ProAno { get; set; }
        public String? ProCod { get; set; }
        public String? ProNom { get; set; }
        public String? ProIde { get; set; }
        public String? ProLinInt { get; set; }

        public String? SubProAno { get; set; }
        public String? SubProCod { get; set; }
        public String? SubProNom { get; set; }
        public String? SubProSap { get; set; }

        public String? ObjCod { get; set; }
        public String? ObjAno { get; set; }
        public String? ObjNum { get; set; }
        public String? ObjNom { get; set; }
        
        public String? ObjEspAno { get; set; }
        public String? ObjEspCod { get; set; }
        public String? ObjEspNum { get; set; }
        public String? ObjEspNom { get; set; }

        public String? ResAno { get; set; }
        public String? ResCod { get; set; }
        public String? ResNum { get; set; }
        public String? ResNom { get; set; }
        public String? ActAno { get; set; }
        public String? ActCod { get; set; }
        public String? ActNum { get; set; }
        public String? ActNom { get; set; }

        public String? TipValCod { get; set; }
        public String? TipValNom { get; set; }

        public String? SubActResAno { get; set; }
        public String? SubActResCod { get; set; }
        public String? SubActResNom { get; set; }

        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public char EstReg { get; set; }

    }
}
