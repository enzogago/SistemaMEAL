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
        public String? BenCodUni { get; set; }
        public String? BenNom { get; set; }
        public String? BenApe { get; set; }
        public String? BenNomApo { get; set; }
        public String? BenApeApo { get; set; }
        public String? BenFecNac { get; set; }
        public String? BenSex { get; set; }
        [ForeignKey("Genero")]
        public String? GenCod { get; set; }
        public String? GenNom { get; set; }
        public String? BenCorEle { get; set; }
        public String? BenTel { get; set; }
        public String? BenTelCon { get; set; }
        [ForeignKey("Nacionalidad")]
        public String? NacCod { get; set; }
        public String? NacNom { get; set; }
        public String? BenDir { get; set; }
        public String? BenAut { get; set; }
        public String? UbiAno { get; set; }
        public String? UbiCod { get; set; }
        public String? UbiNom { get; set; }
        // Ayuda Home
        public String? EdaMin { get; set; }
        public String? EdaMax { get; set; }
        public String? Cantidad { get; set; }

        // Ayuda Meta Beneficiario Modal
        public String? DocIdeNom { get; set; }
        public String? DocIdeAbr { get; set; }
        public String? DocIdeBenNum { get; set; }


        public String? MetBenMesEjeTec { get; set; }
        public String? MetBenAnoEjeTec { get; set; }

        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public char EstReg { get; set; }

    }
}
