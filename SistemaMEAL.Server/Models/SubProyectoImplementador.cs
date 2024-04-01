using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class SubProyectoImplementador
    {
        [Key, Column(Order = 0)]
        public String? SubProAno { get; set; }
        [Key, Column(Order = 1)]
        public String? SubProCod { get; set; }
        [Key, Column(Order = 2)]
        public String? ImpCod { get; set; }
        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public Char? EstReg { get; set; }
    }
}