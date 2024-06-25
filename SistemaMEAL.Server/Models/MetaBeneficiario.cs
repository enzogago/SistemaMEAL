namespace SistemaMEAL.Server.Models
{
    public class MetaBeneficiario
    {
        // TV_META_BENEFICIARIO
        public String? MetAnoOri { get; set; }
        public String? MetCodOri { get; set; }
        public String? BenAnoOri { get; set; }
        public String? BenCodOri { get; set; }
        public String? UbiAnoOri { get; set; }
        public String? UbiCodOri { get; set; }
        public String? MetBenMesEjeTecOri { get; set; }
        public String? MetBenAnoEjeTecOri { get; set; }
        public String? MetAno { get; set; }
        public String? MetCod { get; set; }
        public String? BenAno { get; set; }
        public String? BenCod { get; set; }
        public String? UbiAno { get; set; }
        public String? UbiCod { get; set; }
        public String? MetBenMesEjeTec { get; set; }
        public String? MetBenAnoEjeTec { get; set; }
        public String? MetBenEda { get; set; }
        // TM_META
        public String? MetMetTec { get; set; }
        public String? MetEjeTec { get; set; }
        public String? MetPorAvaTec { get; set; }
        // TM_UBICACION
        public String? UbiNom { get; set; }
        // TM_INDICADOR
        public String? IndAno { get; set; }
        public String? IndCod { get; set; }
        public String? IndNom { get; set; }
        public String? IndNum { get; set; }
        public String? IndTipInd { get; set; }
        // TM_PROYECTO
        public String? ProAno { get; set; }
        public String? ProCod { get; set; }
        public String? ProNom { get; set; }
        public String? ProIde { get; set; }
        public String? ProLinInt { get; set; }
        // TM_SUB_PROYECTO
        public String? SubProAno { get; set; }
        public String? SubProCod { get; set; }
        public String? SubProNom { get; set; }
        public String? SubProSap { get; set; }
        // TM_OBJETIVO
        public String? ObjCod { get; set; }
        public String? ObjAno { get; set; }
        public String? ObjNum { get; set; }
        public String? ObjNom { get; set; }
        // TM_OBJETIVO_ESPECIFICO
        public String? ObjEspAno { get; set; }
        public String? ObjEspCod { get; set; }
        public String? ObjEspNum { get; set; }
        public String? ObjEspNom { get; set; }
        // TM_RESULTADO
        public String? ResAno { get; set; }
        public String? ResCod { get; set; }
        public String? ResNum { get; set; }
        public String? ResNom { get; set; }
        // TM_ACTIVIDAD
        public String? ActAno { get; set; }
        public String? ActCod { get; set; }
        public String? ActNum { get; set; }
        public String? ActNom { get; set; }
        // TB_TIPO_VALOR
        public String? TipValCod { get; set; }
        public String? TipValNom { get; set; }
        // TM_BENEFICIARIO
        public String? BenCodUni { get; set; }
        public String? BenNom { get; set; }
        public String? BenApe { get; set; }
        public String? BenNomApo { get; set; }
        public String? BenApeApo { get; set; }
        public String? BenFecNac { get; set; }
        public String? BenSex { get; set; }
        public String? BenCorEle { get; set; }
        public String? BenTel { get; set; }
        public String? BenTelCon { get; set; }
        public String? BenDir { get; set; }
        public String? BenAut { get; set; }
        // TB_GENERO
        public String? GenCod { get; set; }
        public String? GenNom { get; set; }
        // TB_NACIONALIDAD
        public String? NacCod { get; set; }
        public String? NacNom { get; set; }
        // TB_DOCUMENTO_IDENTIDAD
        public String? DocIdeCod { get; set; }
        public String? DocIdeNom { get; set; }
        public String? DocIdeAbr { get; set; }
        // TM_USUARIO
        public String? UsuAno { get; set; }
        public String? UsuCod { get; set; }
        public String? UsuNom { get; set; }
        public String? UsuApe { get; set; }
        public String? UniNom { get; set; }
        // TB_UBIDAD
        public String? UniInvPer { get; set; }
        // AUDITORIA
        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public Char? EstReg { get; set; }
    }
}