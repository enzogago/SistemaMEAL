using System.ComponentModel.DataAnnotations;

namespace SistemaMEAL.Server.Models
{
    public class FileData
    {
        public string? FileName { get; set; }
        public string? FileSize { get; set; }
        public string? Data { get; set; }
    }
}
