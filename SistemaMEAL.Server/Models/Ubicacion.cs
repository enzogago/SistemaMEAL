using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class Ubicacion
    {
        [Key, Column(Order = 0)]
        public String? UbiAno { get; set; }
        [Key, Column(Order = 1)]
        public String? UbiCod { get; set; }
        public String? UbiNom { get; set; }
        public String? UbiTip { get; set; }
        public String? UbiAnoPad { get; set; }
        public String? UbiCodPad { get; set; }
        public String? UbiLat { get; set; }
        public String? UbiLon { get; set; }
        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public char EstReg { get; set; }
    }
}
