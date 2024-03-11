using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class MetaIndicadorActividadResultado
    {
        public String? MetAnoOri { get; set; }
        public String? MetCodOri { get; set; }
        public String? MetIndActResAnoOri { get; set; }
        public String? MetIndActResCodOri { get; set; }
        public String? MetIndActResTipIndOri { get; set; }
        public String? MetAno { get; set; }
        [Key, Column(Order = 1)]
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


        [Key, Column(Order = 2)]
        public String? MetIndActResAno { get; set; }
        [Key, Column(Order = 3)]
        public String? MetIndActResCod { get; set; }
        [Key, Column(Order = 4)]
        public String? MetIndActResTipInd { get; set; }
        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public Char? EstReg { get; set; }
    }
}