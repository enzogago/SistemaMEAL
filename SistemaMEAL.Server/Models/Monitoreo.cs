using System.ComponentModel.DataAnnotations;

namespace SistemaMEAL.Server.Models
{
    public class Monitoreo
    {
        public String? ProAno { get; set; }
        public String? ProCod { get; set; }
        public String? ProNom { get; set; }
        public String? ProIde { get; set; }

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

        public String? TipInd { get; set; }
        public String? IndTipInd { get; set; }
        public String? MetIndTipInd { get; set; }

        public String? IndActResAno { get; set; }
        public String? IndActResCod { get; set; }
        public String? IndActResNum { get; set; }
        public String? IndActResNom { get; set; }
        public String? IndAno { get; set; }
        public String? IndCod { get; set; }
        public String? IndNum { get; set; }
        public String? IndNom { get; set; }
        public String? IndFor { get; set; }
        public String? TipValCod { get; set; }
        public String? TipValNom { get; set; }

        public String? SubActResAno { get; set; }
        public String? SubActResCod { get; set; }
        public String? SubActResNom { get; set; }

        public String? EstCod { get; set; }
        public String? EstNom { get; set; }
        public String? EstCol { get; set; }

        public String? MetAno { get; set; }
        public String? MetCod { get; set; }
        public String? MetMetTec { get; set; }
        public String? MetEjeTec { get; set; }
        public String? MetPorAvaTec { get; set; }
        public String? MetMetPre { get; set; }
        public String? MetEjePre { get; set; }
        public String? MetPorAvaPre { get; set; }
        public String? MetMesPlaTec { get; set; }
        public String? MetAnoPlaTec { get; set; }
        public String? MetMesPlaPre { get; set; }
        public String? MetAnoPlaPre { get; set; }
        
        public String? MetBenMesEjeTec { get; set; }
        public String? MetBenAnoEjeTec { get; set; }

        public String? FinCod { get; set; }
        public String? FinNom { get; set; }
        public String? UniCod { get; set; }
        public String? UniNom { get; set; }
        public String? UniInvPer { get; set; }

        public String? UbiAno { get; set; }
        public String? UbiCod { get; set; }
        public String? UbiNom { get; set; }
        public String? UbiTip { get; set; }

        public String? ImpCod { get; set; }
        public String? ImpNom { get; set; }
        public String? UsuNom { get; set; }
        public String? UsuApe { get; set; }


        public String? Cantidad { get; set; }
        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public Char? EstReg { get; set; }
    }
}