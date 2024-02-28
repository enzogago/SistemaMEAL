using System.ComponentModel.DataAnnotations;

namespace SistemaMEAL.Server.Models
{
    public class Nacionalidad
    {
        [Key]
        public String? NacCod { get; set; }
        public String? NacNom{ get; set; }
        public String? Cantidad{ get; set; }
        
        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public Char? EstReg { get; set; }
    }
}
