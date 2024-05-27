using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using SistemaMEAL.Modulos;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;

namespace SistemaMEAL.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MenuController : ControllerBase
    {
        private readonly MenuDAO _menus;
         private readonly UsuarioDAO _usuarios;

        public MenuController(MenuDAO menus, UsuarioDAO usuarios)
        {
            _menus = menus;
            _usuarios = usuarios;
        }


        [HttpPost("usuario")]
        public dynamic InsertarMenuUsuario(MenuUsuarioDto menuUsuarioDto)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return rToken;

            var (message, messageType) = _menus.InsertarMenuUsuario(identity, menuUsuarioDto.Usuario, menuUsuarioDto.MenuUsuarioInsertar, menuUsuarioDto.MenuUsuarioEliminar);
            if (messageType == "1") // Error
            {
                return new BadRequestObjectResult(new { success = false, message });
            }
            else if (messageType == "2") // Registro ya existe
            {
                return new ConflictObjectResult(new { success = false, message });
            }
            else // Registro modificado correctamente
            {
                return new OkObjectResult(new { success = true, message });
            }
        }

        [HttpGet]
        public dynamic Buscar()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);
            var result = _menus.Buscar(identity);
            return Ok(result);
        }

        [HttpGet("recursivo")]
        public dynamic BuscarRecursivo()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);
            var result = _menus.BuscarRecursivo(identity);
            return Ok(result);
        }

        [HttpGet("{usuAno}/{usuCod}")]
        public IActionResult ListadoMenuPorUsuario(string usuAno, string usuCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var menu = _menus.ListadoMenuPorUsuario(identity, usuAno:usuAno, usuCod:usuCod);
            return Ok(menu);
        }


    }
}