using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class Actividad
    {
        [Key, Column(Order = 0)]
        public String? ActAno { get; set; }
        [Key, Column(Order = 1)]
        public String? ActCod { get; set; }
        public String? ActNom { get; set; }
        public String? ActNum { get; set; }
        public String? UsuIng { get; set; }

        public DateTime? FecIng { get; set; }

        public String? UsuMod { get; set; }

        public DateTime? FecMod { get; set; }

        public char EstReg { get; set; }

        [ForeignKey("Resultado")]
        public String? ResAno { get; set; }

        [ForeignKey("Resultado")]
        public String? ResCod { get; set; }
        public List<Indicador>? Indicadores { get; set; }
    }
}
