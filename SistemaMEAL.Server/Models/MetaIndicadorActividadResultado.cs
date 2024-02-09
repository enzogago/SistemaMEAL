using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class MetaIndicadorActividadResultado
    {
        [Key, Column(Order = 0)]
        public String? MetAno { get; set; }
        [Key, Column(Order = 1)]
        public String? MetCod { get; set; }
        [Key, Column(Order = 2)]
        public String? MetIndActResAno { get; set; }
        [Key, Column(Order = 3)]
        public String? MetIndActResCod { get; set; }
        [Key, Column(Order = 4)]
        public String? MetIndActResTipInd { get; set; }
        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public Char? EstReg { get; set; }
    }
}