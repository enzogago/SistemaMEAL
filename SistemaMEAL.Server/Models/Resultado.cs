using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class Resultado
    {
        [Key, Column(Order = 0)]
        public String? ResAno { get; set; }
        [Key, Column(Order = 1)]
        public String? ResCod { get; set; }
        [ForeignKey("ObjetivoEspecifico")]
        public String? ObjEspAno { get; set; }

        [ForeignKey("ObjetivoEspecifico")]
        public String? ObjEspCod { get; set; }
        public String? ResNom { get; set; }
        public String? ResNum { get; set; }
        public String? ResPre { get; set; }
        public String? UsuIng { get; set; }

        public DateTime? FecIng { get; set; }

        public String? UsuMod { get; set; }

        public DateTime? FecMod { get; set; }

        public char EstReg { get; set; }

        public List<Indicador>? Indicadores { get; set; }
    }
}
