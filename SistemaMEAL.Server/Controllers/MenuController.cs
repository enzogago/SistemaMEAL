using Microsoft.AspNetCore.Mvc;
using SistemaMEAL.Modulos;
using SistemaMEAL.Server.Models;

namespace SistemaMEAL.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MenuController : ControllerBase
    {
        private readonly MenuDAO _menus;

        public MenuController(MenuDAO menus)
        {
            _menus = menus;
        }

        [HttpGet]
        public IActionResult ListadoMenu()
        {
            var menu = _menus.ListadoMenu();
            return Ok(menu);
        }

    }
}