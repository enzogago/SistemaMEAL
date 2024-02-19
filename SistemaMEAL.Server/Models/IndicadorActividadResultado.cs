using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class IndicadorActividadResultado
    {
        [Key, Column(Order = 0)]
        public String? IndActResAno { get; set; }
        [Key, Column(Order = 1)]
        public String? IndActResCod { get; set; }
        [ForeignKey("Resultado")]
        public String? ResAno { get; set; }

        [ForeignKey("Resultado")]
        public String? ResCod { get; set; }
        public String? IndActResNom { get; set; }
        public String? IndActResNum { get; set; }
        public String? IndActResTip { get; set; }
        public String? UsuIng { get; set; }

        public DateTime? FecIng { get; set; }

        public String? UsuMod { get; set; }

        public DateTime? FecMod { get; set; }

        public char EstReg { get; set; }

    }
}
