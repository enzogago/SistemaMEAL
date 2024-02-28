using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class DocumentoIdentidad
    {
        [Key]
        public String? DocIdeCod { get; set; }
        public String? DocIdeNom { get; set; }
        public String? DocIdeAbr { get; set; }
        // Ayuda
        public String? Cantidad { get; set; }
        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public char EstReg { get; set; }
    }
}
