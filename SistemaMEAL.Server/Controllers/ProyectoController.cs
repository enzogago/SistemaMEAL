using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using SistemaMEAL.Modulos;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;


namespace SistemaMEAL.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProyectoController : ControllerBase
    {
        private readonly ProyectoDAO _proyectos;
        private readonly UsuarioDAO _usuarios;

        public ProyectoController(ProyectoDAO proyectos, UsuarioDAO usuarios)
        {
            _proyectos = proyectos;
            _usuarios = usuarios;
        }

        [HttpPost("agregar-exclusiones/{usuAno}/{usuCod}")]
        public IActionResult AgregarExclusiones([FromBody] ModificarExclusionesRequest request, string usuAno, string usuCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            _proyectos.ModificarExclusiones(usuAno, usuCod, request.Proyectos, request.SubProyectos, "I");

            return Ok();
        }

        [HttpPost("eliminar-exclusiones/{usuAno}/{usuCod}")]
        public IActionResult EliminarExclusiones([FromBody] ModificarExclusionesRequest request, string usuAno, string usuCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            // Imprime los proyectos y subproyectos en la consola
            Console.WriteLine("Proyectos:");
            foreach (var proyecto in request.Proyectos)
            {
                Console.WriteLine($"Año: {proyecto.ProAno}, Código: {proyecto.ProCod}");
            }

            Console.WriteLine("SubProyectos:");
            foreach (var subProyecto in request.SubProyectos)
            {
                Console.WriteLine($"Año: {subProyecto.SubProAno}, Código: {subProyecto.SubProCod}");
            }

            _proyectos.ModificarExclusiones(usuAno, usuCod, request.Proyectos, request.SubProyectos, "D");

            return Ok();
        }



        [HttpGet]
        [Route("accesibles/{usuAno}/{usuCod}")]
        public dynamic ListadoAccesibles(string usuAno, string usuCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var proyectos = _proyectos.ListadoAccesibles(usuAno, usuCod);
            Console.WriteLine(proyectos);
            return Ok(proyectos);
        }


        [HttpGet]
        public dynamic Listado()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var proyectos = _proyectos.Listado();
            Console.WriteLine(proyectos);
            return Ok(proyectos);
        }

        [HttpGet]
        [Route("{usuAno}/{usuCod}")]
        public dynamic ListarProyectosUsuario(string usuAno, string usuCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var proyectos = _proyectos.ListarProyectosUsuario(usuAno, usuCod);
            return Ok(proyectos);
        }

        [HttpGet]
        [Route("{usuAno}/{usucod}/proyecto/{proAno}/{proCod}")]
        public dynamic ObtenerDetallesProyectoUsuario(string usuAno, string usucod, string proAno, string proCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var proyecto = _proyectos.ObtenerDetallesProyectoUsuario(usuAno, usucod, proAno, proCod);
            Console.WriteLine(Ok(proyecto));
            return Ok(proyecto);
        }

    }
}
