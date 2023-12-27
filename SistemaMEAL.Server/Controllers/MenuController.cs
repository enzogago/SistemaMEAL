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

        [HttpGet]
        public IActionResult ListadoMenu()
        {
            var menu = _menus.ListadoMenu();
            return Ok(menu);
        }

        [HttpGet("{rolCod}")]
        public dynamic ListadoMenuPorRol(string rolCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var menu = _menus.ListadoMenuPorRol(rolCod);
            return Ok(menu);
        }
        [HttpGet("{usuAno}/{usuCod}")]
        public IActionResult ListadoMenuPorUsuario(string usuAno, string usuCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var menu = _menus.ListadoMenuPorUsuario(usuAno, usuCod);
            return Ok(menu);
        }


    }
}