namespace SistemaMEAL.Server.Models
{
    public class PermisoUsuarioDto
    {
        public List<PermisoUsuario>? PermisoUsuarioInsertar { get; set; }
        public List<PermisoUsuario>? PermisoUsuarioEliminar { get; set; }
        public Usuario? Usuario { get; set; }

    }
}
