using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class ObjetivoEspecifico
    {
        [Key, Column(Order = 0)]
        public String? ObjEspAno { get; set; }
        [Key, Column(Order = 1)]
        public String? ObjEspCod { get; set; }
        public String? ObjEspNom { get; set; }
        public String? ObjEspNum { get; set; }
        public String? UsuIng { get; set; }

        public DateTime? FecIng { get; set; }

        public String? UsuMod { get; set; }

        public DateTime? FecMod { get; set; }

        public char EstReg { get; set; }

        [ForeignKey("Objetivo")]
        public String? ObjAno { get; set; }
        [ForeignKey("Objetivo")]
        public String? ObjCod { get; set; }
        public String? ObjNum { get; set; }
        public String? ObjNom { get; set; }
        public String? SubProNom { get; set; }
        public String? ProNom { get; set; }
        public List<Resultado>? Resultados { get; set; }
    }
}
