using System.ComponentModel.DataAnnotations;

namespace SistemaMEAL.Server.Models
{
    public class MetasDto
    {
        public List<Meta>? Metas { get; set; }
        public List<Meta>? MetasEliminar { get; set; }

    }
}
