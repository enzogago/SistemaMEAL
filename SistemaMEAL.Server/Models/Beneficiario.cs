using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class Beneficiario
    {
        [Key, Column(Order = 0)]
        public String? BenAno { get; set; }
        [Key, Column(Order = 1)]
        public String? BenCod { get; set; }
        [ForeignKey("DocumentoIdentidad")]
        public String? DocIdeCod { get; set; }
        public String? DocIdeNom { get; set; }
        public String? DocIdeAbr { get; set; }
        public String? BenCodUni { get; set; }
        public String? BenNom { get; set; }
        public String? BenApe { get; set; }
        public String? BenNomApo { get; set; }
        public String? BenApeApo { get; set; }
        public String? BenFecNac { get; set; }
        public Char? BenSex { get; set; }
        [ForeignKey("Genero")]
        public String? GenCod { get; set; }
        public String? GenNom { get; set; }
        public String? BenCorEle { get; set; }
        public String? BenTel { get; set; }
        public String? BenTelCon { get; set; }
        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public char EstReg { get; set; }
        public virtual DocumentoIdentidad? DocumentoIdentidad { get; set; }


    }
}
