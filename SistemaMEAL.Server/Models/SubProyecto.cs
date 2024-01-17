using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
   public class SubProyecto
    {
        [Key, Column(Order = 0)]
        public String? SubProAno { get; set; }

        [Key, Column(Order = 1)]
        public String? SubProCod { get; set; }

        [ForeignKey("Proyecto")]
        public String? ProAno { get; set; }

        [ForeignKey("Proyecto")]
        public String? ProCod { get; set; }

        public String? SubProNom { get; set; }

        public String? SubProPre { get; set; }

        public String? UsuIng { get; set; }

        public DateTime? FecIng { get; set; }

        public String? UsuMod { get; set; }

        public DateTime? FecMod { get; set; }

        public char EstReg { get; set; }

        public virtual Proyecto? Proyecto { get; set; }

        public List<Objetivo>? Objetivos { get; set; }
        public List<Resultado>? Resultados { get; set; }
    }
}
