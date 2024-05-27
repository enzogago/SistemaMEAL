namespace SistemaMEAL.Server.Models
{
    public class MenuUsuarioDto
    {
        public List<MenuUsuario>? MenuUsuarioInsertar { get; set; }
        public List<MenuUsuario>? MenuUsuarioEliminar { get; set; }
        public Usuario? Usuario { get; set; }

    }
}
