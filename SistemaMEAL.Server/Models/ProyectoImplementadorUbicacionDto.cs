namespace SistemaMEAL.Server.Models
{
    public class ProyectoImplementadorUbicacionDto
    {
        public Proyecto? Proyecto { get; set; }
        public List<Ubicacion>? Ubicaciones { get; set; }
        public List<Implementador>? Implementadores { get; set; }

    }
}
