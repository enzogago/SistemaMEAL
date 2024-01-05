using System.ComponentModel.DataAnnotations;

namespace SistemaMEAL.Server.Models
{
    public class Permiso
    {
        [Key]
        public String? PerCod { get; set; }
        public String? PerNom{ get; set; }
        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public Char? EstReg { get; set; }
    }
}
