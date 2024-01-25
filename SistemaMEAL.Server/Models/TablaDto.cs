using System.ComponentModel.DataAnnotations;

namespace SistemaMEAL.Server.Models
{
   public class TablaDto
    {
        public List<string>? Columnas { get; set; }
        public List<List<object>>? Datos { get; set; }
    }

}
