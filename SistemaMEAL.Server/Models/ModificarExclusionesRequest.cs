using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class ModificarExclusionesRequest
{
    public List<Proyecto>? Proyectos { get; set; }
    public List<SubProyecto>? SubProyectos { get; set; }
    public string? Operacion { get; set; }
}

}
