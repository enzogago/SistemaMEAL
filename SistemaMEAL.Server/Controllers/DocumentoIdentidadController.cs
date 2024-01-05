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

        [HttpPost]
        public dynamic Insertar(DocumentoIdentidad documento)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return rToken;

            dynamic data = rToken.result;
            Usuario usuario = new Usuario
            {
                UsuAno = data.UsuAno,
                UsuCod = data.UsuCod,
                RolCod = data.RolCod
            };
            if (!_usuarios.TienePermiso(usuario.UsuAno, usuario.UsuCod, "CREAR DOCUMENTO_IDENTIDAD") && usuario.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para insertar documentos de identidad",
                    result = ""
                };
            }

            var (message, messageType) = _documentos.Insertar(documento);
            if (messageType == "1") // Error
            {
                return BadRequest(message);
            }
            else if (messageType == "2") // Registro ya existe
            {
                return Conflict(message);
            }
            else // Registro insertado correctamente
            {
                return Ok(message);
            }
        }

        [HttpPut("{docIdeCod}")]
        public dynamic Modificar(string docIdeCod, DocumentoIdentidad documento)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return rToken;

            dynamic data = rToken.result;
            Usuario usuario = new Usuario
            {
                UsuAno = data.UsuAno,
                UsuCod = data.UsuCod,
                RolCod = data.RolCod
            };
            if (!_usuarios.TienePermiso(usuario.UsuAno, usuario.UsuCod, "MODIFICAR ESTADO") && usuario.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para modificar documentos de identidad",
                    result = ""
                };
            }

            documento.DocIdeCod = docIdeCod;
            var (message, messageType) = _documentos.Modificar(documento);
            if (messageType == "1") // Error
            {
                return BadRequest(message);
            }
            else if (messageType == "2") // Registro ya existe
            {
                return Conflict(message);
            }
            else // Registro modificado correctamente
            {
                return Ok(message);
            }
        }

        [HttpDelete("{docIdeCod}")]
        public dynamic Eliminar(string docIdeCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return rToken;

            dynamic data = rToken.result;
            Usuario usuario = new Usuario
            {
                UsuAno = data.UsuAno,
                UsuCod = data.UsuCod,
                RolCod = data.RolCod
            };
            if (!_usuarios.TienePermiso(usuario.UsuAno, usuario.UsuCod, "ELIMINAR ESTADO") && usuario.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para eliminar documentos de identidad",
                    result = ""
                };
            }

            var (message, messageType) = _documentos.Eliminar(docIdeCod);
            if (messageType == "1") // Error
            {
                return BadRequest(message);
            }
            else if (messageType == "2") // Registro ya existe
            {
                return Conflict(message);
            }
            else // Registro eliminado correctamente
            {
                return Ok(message);
            }
        }
    }
}
