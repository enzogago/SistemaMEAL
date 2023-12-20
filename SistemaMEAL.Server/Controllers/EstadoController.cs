using Microsoft.AspNetCore.Mvc;
using SistemaMEAL.Modulos;
using SistemaMEAL.Server.Models;

namespace SistemaMEAL.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EstadoController : ControllerBase
    {
        private readonly EstadoDAO _estados;

        public EstadoController(EstadoDAO estados)
        {
            _estados = estados;
        }

        [HttpGet]
        public IActionResult Listado()
        {
            var estados = _estados.Listado();
            return Ok(estados);
        }

        [HttpPost]
        public IActionResult Insertar(Estado estado)
        {
            var (message, messageType) = _estados.Insertar(estado);
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

        [HttpPut("{estCod}")]
        public IActionResult Modificar(string estCod, Estado estado)
        {
            estado.EstCod = estCod; // Asegúrate de que el código del estado en el objeto estado sea el correcto
            var (message, messageType) = _estados.Modificar(estado);
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


        [HttpDelete("{estCod}")]
        public IActionResult Eliminar(string estCod)
        {
            var (message, messageType) = _estados.Eliminar(estCod);
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
