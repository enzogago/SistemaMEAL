using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class Usuario
    {
        [Key, Column(Order = 0)]
        public String? UsuAno { get; set; }

        [Key, Column(Order = 1)]
        public String? UsuCod { get; set; }

        [ForeignKey("DocumentoIdentidad")]
        public String? DocIdeCod { get; set; }
        public String? DocIdeNom { get; set; }
        public String? DocIdeAbr { get; set; }

        public String? UsuNumDoc { get; set; }

        public String? UsuNom { get; set; }

        public String? UsuApe { get; set; }

        public String? UsuFecNac { get; set; }

        public Char? UsuSex { get; set; }

        public String? UsuCorEle { get; set; }

        [ForeignKey("Cargo")]
        public String? CarCod { get; set; }
        public String? CarNom { get; set; }

        public String? UsuFecInc { get; set; }

        public String? UsuTel { get; set; }

        public String? UsuNomUsu { get; set; }

        public String? UsuPas { get; set; }

        public Char? UsuEst { get; set; }

        [ForeignKey("Rol")]
        public String? RolCod { get; set; }
        public String? RolNom { get; set; }

        public String? UsuIng { get; set; }

        public DateTime? FecIng { get; set; }

        public String? UsuMod { get; set; }

        public DateTime? FecMod { get; set; }

        public char EstReg { get; set; }

        public virtual Cargo? Cargo { get; set; }

        public virtual Rol? Rol { get; set; }
        public virtual DocumentoIdentidad? DocumentoIdentidad { get; set; }


    }
}
