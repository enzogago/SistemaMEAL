using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class MenuUsuario
    {
        [Key, Column(Order = 0)]
        public String? MenAno { get; set; }

        [Key, Column(Order = 1)]
        public String? MenCod { get; set; }
        [Key, Column(Order = 2)]
        public String? UsuAno { get; set; }

        [Key, Column(Order = 3)]
        public String? UsuCod { get; set; }
        public String? MenCodPad { get; set; }
        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public Char? EstReg { get; set; }
        public String? MenIco { get; set; }
    }
}