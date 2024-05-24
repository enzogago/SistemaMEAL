using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic; // Necesario para usar List<T>

namespace SistemaMEAL.Server.Models
{
    public class Menu
    {
        [Key, Column(Order = 0)]
        public String? MenAno { get; set; }

        [Key, Column(Order = 1)]
        public String? MenCod { get; set; }

        public String? MenNom { get; set; }
        public String? MenRef { get; set; }
        public String? MenIco { get; set; }
        public String? MenOrd { get; set; }

        // Claves foráneas para el menú padre
        public String? MenAnoPad { get; set; }
        public String? MenCodPad { get; set; }

        // Propiedad de navegación para el menú padre
        [ForeignKey("MenAnoPad, MenCodPad")]
        public virtual Menu? MenuPadre { get; set; }

        // Propiedad de navegación para los submenús
        public virtual List<Menu>? SubMenus { get; set; }

        public String? UsuIng { get; set; }
        public DateTime? FecIng { get; set; }
        public String? UsuMod { get; set; }
        public DateTime? FecMod { get; set; }
        public Char? EstReg { get; set; }

        // Constructor para inicializar la lista de submenús
        public Menu()
        {
            SubMenus = new List<Menu>();
        }
    }
}
