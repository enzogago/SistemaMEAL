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
        public String? MetBenEda { get; set; }
        public String? MetBenMesEjeTec { get; set; }
        public String? MetBenAnoEjeTec { get; set; }
        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public Char? EstReg { get; set; }
    }
}