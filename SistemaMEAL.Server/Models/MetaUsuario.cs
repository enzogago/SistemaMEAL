using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class MetaUsuario
    {
        [Key, Column(Order = 0)]
        public String? UsuAno { get; set; }

        [Key, Column(Order = 1)]
        public String? UsuCod { get; set; }
        [Key, Column(Order = 2)]
        public String? MetAno { get; set; }

        [Key, Column(Order = 3)]
        public String? MetCod { get; set; }
        public String? IndAno { get; set; }
        public String? IndCod { get; set; }
        public String? ActAno { get; set; }
        public String? ActCod { get; set; }
        public String? ResAno { get; set; }
        public String? ResCod { get; set; }
        public String? ObjEspAno { get; set; }
        public String? ObjEspCod { get; set; }
        public String? ObjAno { get; set; }
        public String? ObjCod { get; set; }
        public String? SubProAno { get; set; }
        public String? SubProCod { get; set; }
        public String? ProAno { get; set; }
        public String? ProCod { get; set; }
        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public Char? EstReg { get; set; }
    }
}