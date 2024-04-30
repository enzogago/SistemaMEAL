using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class UsuarioAcceso
    {
        [Key, Column(Order = 0)]
        public String? UsuAno { get; set; }

        [Key, Column(Order = 1)]
        public String? UsuCod { get; set; }
        [Key, Column(Order = 2)]
        public String? UsuAccTip { get; set; }

        [Key, Column(Order = 3)]
        public String? UsuAccAno { get; set; }
        public String? UsuAccCod { get; set; }
        public String? UsuAccPad { get; set; }
        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public Char? EstReg { get; set; }
    }
}