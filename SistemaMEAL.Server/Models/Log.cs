using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class Log
    {
        [Key, Column(Order = 0)]
        public String? LogAno { get; set; }

        [Key, Column(Order = 1)]
        public String? LogCod { get; set; }

        public String? LogDes { get; set; }
        public String? LogAcc { get; set; }
        public String? LogIpMaq { get; set; }
        public String? LogCodReg { get; set; }
        public String? LogNomTab { get; set; }
        public String? LogSql { get; set; }
        public DateTime? LogFecIng { get; set; }
        public DateTime? LogFecFin { get; set; }
        public String? LogTip { get; set; }
        public String? UsuAno { get; set; }
        public String? UsuCod { get; set; }
        public String? UsuNom { get; set; }
        public String? UsuApe { get; set; }
    }
}