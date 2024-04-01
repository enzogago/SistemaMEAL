namespace SistemaMEAL.Server.Models
{
    public class SubProyectoImplementadorUbicacionDto
    {
        public SubProyecto? SubProyecto { get; set; }
        public List<SubProyectoUbicacion>? SubProyectoUbicaciones { get; set; }
        public List<SubProyectoImplementador>? SubProyectoImplementadores { get; set; }

    }
}
