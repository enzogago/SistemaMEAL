using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using SistemaMEAL.Modulos;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;

namespace SistemaMEAL.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentoIdentidadController : ControllerBase
    {
        private readonly DocumentoIdentidadDAO _documentos;
        private readonly UsuarioDAO _usuarios;

        public DocumentoIdentidadController(DocumentoIdentidadDAO documentos, UsuarioDAO usuarios)
        {
            _documentos = documentos;
            _usuarios = usuarios;
        }

        [HttpGet]
        public dynamic Listado()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            dynamic data = rToken.result;
            Usuario usuario = new Usuario
            {
                UsuAno = data.UsuAno,
                UsuCod = data.UsuCod,
                RolCod = data.RolCod
            };
            if (!_usuarios.TienePermiso(usuario.UsuAno, usuario.UsuCod, "LISTAR DOCUMENTO IDENTIDAD") && usuario.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para listar documentos de identidad",
                    result = ""
                };
            }

            var documentos = _documentos.Listado();
            Console.WriteLine(documentos);
            return Ok(documentos);
        }

        // [HttpPost]
        // public dynamic Insertar(DocumentoIdentidad documento)
        // {
        //     // Aquí puedes agregar el código para insertar un nuevo documento de identidad
        //     // siguiendo el mismo patrón que usaste en EstadoController.
        // }

        // [HttpPut("{docIdeCod}")]
        // public dynamic Modificar(string docIdeCod, DocumentoIdentidad documento)
        // {
        //     // Aquí puedes agregar el código para modificar un documento de identidad existente
        //     // siguiendo el mismo patrón que usaste en EstadoController.
        // }

        // [HttpDelete("{docIdeCod}")]
        // public dynamic Eliminar(string docIdeCod)
        // {
        //     // Aquí puedes agregar el código para eliminar un documento de identidad existente
        //     // siguiendo el mismo patrón que usaste en EstadoController.
        // }
    }
}
