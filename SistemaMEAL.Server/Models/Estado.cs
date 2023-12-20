using System.ComponentModel.DataAnnotations;

namespace SistemaMEAL.Server.Models
{
    public class Estado
    {
        [Key]
        public String? EstCod { get; set; }
        public String? EstNom { get; set; }
        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public Char? EstReg { get; set; }
    }
}
