using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class MetaIndicador
    {
        // Atributos para caso de Ediciòn de esta TABLA VINCULO
        public String? MetAnoOri { get; set; }
        public String? MetCodOri { get; set; }
        public String? IndAnoOri { get; set; }
        public String? IndCodOri { get; set; }
        public String? IndTipIndOri { get; set; }
        // Atributos Propios
        public String? MetAno { get; set; }
        public String? MetCod { get; set; }
        public String? MetMetTec { get; set; }
        public String? MetMesPlaTec { get; set; }
        public String? MetAnoPlaTec { get; set; }
        public String? MetMetPre { get; set; }
        public String? ImpCod { get; set; }
        public String? FinCod { get; set; }
        public String? UbiAno { get; set; }
        public String? UbiCod { get; set; }
        public String? EstCod { get; set; }
        //
        public String? IndAno { get; set; }
        public String? IndCod { get; set; }
        public String? IndTipInd { get; set; }

        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public Char? EstReg { get; set; }
    }
}