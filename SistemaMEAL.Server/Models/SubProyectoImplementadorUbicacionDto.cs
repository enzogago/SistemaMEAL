namespace SistemaMEAL.Server.Models
{
    public class SubProyectoImplementadorUbicacionDto
    {
        public SubProyecto? SubProyecto { get; set; }
        public List<Ubicacion>? Ubicaciones { get; set; }
        public List<Implementador>? Implementadores { get; set; }

    }
}
