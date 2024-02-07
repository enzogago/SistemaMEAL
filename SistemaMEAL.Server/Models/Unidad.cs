using System.ComponentModel.DataAnnotations;

namespace SistemaMEAL.Server.Models
{
    public class Unidad
    {
        [Key]
        public String? UniCod { get; set; }
        public String? UniNom{ get; set; }
        public String? UniInvPer{ get; set; }
        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public Char? EstReg { get; set; }
    }
}
