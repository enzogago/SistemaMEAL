using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class CadenaUbicacion
    {
        [Key, Column(Order = 0)]
        public String? IndAno { get; set; }
        [Key, Column(Order = 1)]
        public String? IndCod { get; set; }
        [Key, Column(Order = 2)]
        public String? UbiAno { get; set; }
        [Key, Column(Order = 3)]
        public String? UbiCod { get; set; }
        public String? CadResUbiMetTec { get; set; }
        public String? CadResUbiMetPre { get; set; }
        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public Char? EstReg { get; set; }
    }
}