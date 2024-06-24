using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class MetaBeneficiario
    {
        
        public String? MetAnoOri { get; set; }
        public String? MetCodOri { get; set; }
        public String? BenAnoOri { get; set; }
        public String? BenCodOri { get; set; }
        public String? UbiAnoOri { get; set; }
        public String? UbiCodOri { get; set; }
        public String? MetBenMesEjeTecOri { get; set; }
        public String? MetBenAnoEjeTecOri { get; set; }
        
        [Key, Column(Order = 0)]
        public String? MetAno { get; set; }
        [Key, Column(Order = 1)]
        public String? MetCod { get; set; }
        [Key, Column(Order = 2)]
        public String? BenAno { get; set; }
        [Key, Column(Order = 3)]
        public String? BenCod { get; set; }
        public String? UbiAno { get; set; }
        public String? UbiCod { get; set; }
        public String? UbiNom { get; set; }
        public String? MetMetTec { get; set; }
        public String? MetEjeTec { get; set; }
        public String? MetPorAvaTec { get; set; }
        public String? MetBenEda { get; set; }
        public String? MetBenMesEjeTec { get; set; }
        public String? MetBenAnoEjeTec { get; set; }

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

        public String? BenCodUni { get; set; }
        public String? BenNom { get; set; }
        public String? BenApe { get; set; }
        public String? BenNomApo { get; set; }
        public String? BenApeApo { get; set; }
        public String? BenFecNac { get; set; }
        public String? BenSex { get; set; }
        public String? GenCod { get; set; }
        public String? GenNom { get; set; }
        public String? BenCorEle { get; set; }
        public String? BenTel { get; set; }
        public String? BenTelCon { get; set; }
        public String? NacCod { get; set; }
        public String? NacNom { get; set; }
        public String? BenDir { get; set; }
        public String? BenAut { get; set; }

        
        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public Char? EstReg { get; set; }
    }
}