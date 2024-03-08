using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaMEAL.Server.Models
{
    public class ErrorCell
{
    public int? Row { get; set; }
    public int? Column { get; set; }
    public string? Message { get; set; }
}
}
