using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class Proyecto
    {
        [Key, Column(Order = 0)]
        public String? ProAno { get; set; }

        [Key, Column(Order = 1)]
        public String? ProCod { get; set; }

        public String? ProNom { get; set; }

        public String? ProDes { get; set; }

        public String? ProRes { get; set; }

        public String? ProPer { get; set; }

        public String? UsuIng { get; set; }

        public DateTime? FecIng { get; set; }

        public String? UsuMod { get; set; }

        public DateTime? FecMod { get; set; }

        public char EstReg { get; set; }

        public List<SubProyecto>? SubProyecto { get; set; }
    }
}
