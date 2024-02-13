using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class DocumentoBeneficiario
    {
        [Key, Column(Order = 0)]
        public String? DocIdeCod { get; set; }

        [Key, Column(Order = 1)]
        public String? BenAno { get; set; }
        [Key, Column(Order = 2)]
        public String? BenCod { get; set; }
        public String? DocIdeBenNum { get; set; }
        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public Char? EstReg { get; set; }
    }
}