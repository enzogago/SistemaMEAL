using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using SistemaMEAL.Modulos;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;

namespace SistemaMEAL.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MonitoreoController : ControllerBase
    {
        private readonly MonitoreoDAO _monitoreos;
        private readonly UsuarioDAO _usuarios;

        public MonitoreoController(MonitoreoDAO monitoreos, UsuarioDAO usuarios)
        {
            _monitoreos = monitoreos;
            _usuarios = usuarios;
        }

        // [HttpGet]
        // [Route("pruebametas")]
        // public dynamic Listado()
        // {
        //     var identity = HttpContext.User.Identity as ClaimsIdentity;
        //     var rToken = Jwt.validarToken(identity, _usuarios);

        //     if (!rToken.success) return Unauthorized(rToken);

        //     var monitoreos = _monitoreos.Listado(identity);
        //     return Ok(monitoreos);
        // }

        [HttpGet]
        [Route("Filter/{tags?}")]
        public dynamic Listado(string? tags = null)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var monitoreos = _monitoreos.Listado(identity, tags);
            return Ok(monitoreos);
        }

        [HttpGet]
        [Route("BeneficiariosCount/{tags?}")]
        public dynamic GetBeneficiariosCount(string? tags = null)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            int count = _monitoreos.GetBeneficiariosCount(tags);
            return Ok(count);
        }


        [HttpGet]
        [Route("{metAno}/{metCod}")]
        public dynamic BuscarMonitoreo(string metAno, string metCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var monitoreos = _monitoreos.BuscarMonitoreo(metAno,metCod);
            var monitoreo = monitoreos.FirstOrDefault();
            return Ok(monitoreo);
        }
        [HttpGet]
        [Route("beneficiario/{benAno}/{benCod}")]
        public dynamic BuscarMonitoreoPorBeneficiario(string benAno, string benCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var resultData = _monitoreos.BuscarMonitoreoPorBeneficiario(benAno,benCod);
            return Ok(resultData);
        }

        [HttpPost]
        public dynamic Insertar(BeneficiarioMonitoreo beneficiarioMonitoreo)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var (message, messageType) = _monitoreos.InsertarBeneficiarioMonitoreo(identity, beneficiarioMonitoreo.Beneficiario, beneficiarioMonitoreo.MetaBeneficiario, beneficiarioMonitoreo.DocumentoBeneficiario);
            if (messageType == "1")
            {
                return new BadRequestObjectResult(new { success = false, message });
            }
            else if (messageType == "2")
            {
                return new ConflictObjectResult(new { success = false, message });
            }
            else
            {
                return new OkObjectResult(new { success = true, message });
            }
        }

        [HttpPost]
        [Route("existe")]
        public dynamic InsertarMetaBeneficiarioExiste(MetaBeneficiario metaBeneficiario)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var (message, messageType) = _monitoreos.InsertarMetaBeneficiarioExiste(identity, metaBeneficiario);
            if (messageType == "1")
            {
                return new BadRequestObjectResult(new { success = false, message });
            }
            else if (messageType == "2")
            {
                return new ConflictObjectResult(new { success = false, message });
            }
            else
            {
                return new OkObjectResult(new { success = true, message });
            }
        }

        [HttpPost]
        [Route("execution")]
        public dynamic InsertarMetaEjecucion(MetaEjecucion metaEjecucion)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var (message, messageType) = _monitoreos.InsertarMetaEjecucion(identity, metaEjecucion);
            if (messageType == "1")
            {
                return new BadRequestObjectResult(new { success = false, message });
            }
            else if (messageType == "2")
            {
                return new ConflictObjectResult(new { success = false, message });
            }
            else
            {
                return new OkObjectResult(new { success = true, message });
            }
        }

        [HttpDelete]
        [Route("eliminar-beneficiario/{metAno}/{metCod}/{benAno}/{benCod}/{ubiAno}/{ubiCod}/{metBenAnoEjeTec}/{metBenMesEjeTec}")]
        public dynamic EliminarBeneficiarioMonitoreo(string metAno, string metCod, string benAno, string benCod, string ubiAno, string ubiCod, string metBenAnoEjeTec, string metBenMesEjeTec)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return rToken;


            var (message, messageType) = _monitoreos.EliminarBeneficiarioMonitoreo(identity, metAno, metCod, benAno, benCod, ubiAno, ubiCod, metBenAnoEjeTec, metBenMesEjeTec );
            if (messageType == "1")
            {
                return new BadRequestObjectResult(new { success = false, message });
            }
            else if (messageType == "2")
            {
                return new ConflictObjectResult(new { success = false, message });
            }
            else
            {
                return new OkObjectResult(new {success = true, message });
            }
        }

        [HttpGet]
        [Route("todos-home/{tags?}")]
        public dynamic BuscarPaisesHome (string? tags = null)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var reult = _monitoreos.BuscarPaisesHome(identity, tags);
            return Ok(reult);
        }
        [HttpGet]
        [Route("ecuador-home/{tags?}")]
        public dynamic BuscarEcuadorHome (string? tags = null)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var reult = _monitoreos.BuscarEcuadorHome(identity, tags);
            return Ok(reult);
        }
        [HttpGet]
        [Route("peru-home/{tags?}")]
        public dynamic BuscarPeruHome (string? tags = null)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var reult = _monitoreos.BuscarPeruHome(identity, tags);
            return Ok(reult);
        }
        [HttpGet]
        [Route("colombia-home/{tags?}")]
        public dynamic BuscarColombiaHome (string? tags = null)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var reult = _monitoreos.BuscarColombiaHome(identity, tags);
            return Ok(reult);
        }

        [HttpGet]
        [Route("meta-form/{metAno}/{metCod}/{benAno}/{benCod}/{ubiAno}/{ubiCod}/{metBenAnoEjeTec}/{metBenMesEjeTec}")]
        public dynamic BuscarMonitoreoForm(string metAno, string metCod, string benAno, string benCod, string ubiAno, string ubiCod, string metBenAnoEjeTec, string metBenMesEjeTec)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var monitoreos = _monitoreos.BuscarMonitoreoForm(identity, metAno:metAno, metCod:metCod, benAno:benAno, benCod:benCod, ubiAno:ubiAno, ubiCod:ubiCod, metBenAnoEjeTec:metBenAnoEjeTec, metBenMesEjeTec:metBenMesEjeTec);
            var monitoreo = monitoreos.FirstOrDefault();
            return Ok(monitoreo);
        }

        [HttpPut]
        public dynamic Modificar(MetaBeneficiario? metaBeneficiario)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return rToken;

            dynamic data = rToken.result;
            Usuario usuarioActual = new Usuario
            {
                UsuAno = data.UsuAno,
                UsuCod = data.UsuCod,
                RolCod = data.RolCod
            };
            if (usuarioActual.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para modificar usuarios",
                    result = ""
                };
            }
            var (message, messageType) = _monitoreos.ModificarMetaBeneficiario(identity, metaBeneficiario);
            if (messageType == "1")
            {
                return new BadRequestObjectResult(new { success = false, message });
            }
            else if (messageType == "2")
            {
                return new ConflictObjectResult(new { success = false, message });
            }
            else
            {
                return new OkObjectResult(new { success = true, message });
            }
        }

        [HttpPut]
        [Route("meta-beneficiario")]
        public dynamic MoficiarMetaBeneficiario(BeneficiarioMonitoreo beneficiarioMonitoreo)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return rToken;

            dynamic data = rToken.result;
            Usuario usuarioActual = new Usuario
            {
                UsuAno = data.UsuAno,
                UsuCod = data.UsuCod,
                RolCod = data.RolCod
            };
            if (usuarioActual.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para insertar usuarios",
                    result = ""
                };
            }
            var (message, messageType) = _monitoreos.ModificarBeneficiarioMonitoreo(identity, beneficiarioMonitoreo.Beneficiario, beneficiarioMonitoreo.MetaBeneficiario);
            if (messageType == "1")
            {
                return new BadRequestObjectResult(new { success = false, message });
            }
            else if (messageType == "2")
            {
                return new ConflictObjectResult(new { success = false, message });
            }
            else
            {
                return new OkObjectResult(new { success = true, message });
            }
        }

        [HttpPost]
        [Route("meta-indicador")]
        public dynamic InsertarMetaIndicador(MetaIndicadorDto? metaIndicadorDto)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return rToken;

            dynamic data = rToken.result;
            Usuario usuarioActual = new Usuario
            {
                UsuAno = data.UsuAno,
                UsuCod = data.UsuCod,
                RolCod = data.RolCod
            };
            if (usuarioActual.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para insertar usuarios",
                    result = ""
                };
            }
            var (message, messageType) = _monitoreos.InsertarMetaMonitoreo(identity, metaIndicadorDto.Meta, metaIndicadorDto.MetaIndicador);
            if (messageType == "1")
            {
                return new BadRequestObjectResult(new { success = false, message });
            }
            else if (messageType == "2")
            {
                return new ConflictObjectResult(new { success = false, message });
            }
            else
            {
                return new OkObjectResult(new { success = true, message });
            }
        }

        [HttpGet]
        [Route("meta-indicador/{metAno}/{metCod}/{indAno}/{indCod}")]
        public dynamic BuscarMetaIndicador(string metAno, string metCod, string indAno, string indCod)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return Unauthorized(rToken);

            var data = _monitoreos.BuscarMetaIndicador(identity, metAno, metCod, indAno, indCod);
            
            return Ok(data.FirstOrDefault());
        }

        [HttpDelete]
        [Route("meta-indicador/{metAno}/{metCod}/{metIndAno}/{metIndCod}")]
        public dynamic EliminarMetaIndicador(string metAno, string metCod, string metIndAno, string metIndCod)
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
            if (usuario.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para eliminar estados",
                    result = ""
                };
            }

            var (message, messageType) = _monitoreos.EliminarMetaIndicador(identity, metAno, metCod, metIndAno, metIndCod);
            if (messageType == "1")
            {
                return BadRequest(message);
            }
            else if (messageType == "2")
            {
                return Conflict(message);
            }
            else // Registro eliminado correctamente
            {
                return Ok(message);
            }
        }

        [HttpPut]
        [Route("meta")]
        public dynamic Modificar(Meta meta)
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
            if (usuario.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para modificar estados",
                    result = ""
                };
            }

            var (message, messageType) = _monitoreos.ModificarMeta(identity, meta);
            if (messageType == "1")
            {
                return new BadRequestObjectResult(new { success = false, message });
            }
            else if (messageType == "2")
            {
                return new ConflictObjectResult(new { success = false, message });
            }
            else
            {
                return new OkObjectResult(new { success = true, message });
            }
        }

        [HttpPut]
        [Route("indicador")]
        public dynamic ModificarMetaIndicador(MetaIndicador? metaIndicador)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return rToken;

            dynamic data = rToken.result;
            Usuario usuarioActual = new Usuario
            {
                UsuAno = data.UsuAno,
                UsuCod = data.UsuCod,
                RolCod = data.RolCod
            };
            if (usuarioActual.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para modificar usuarios",
                    result = ""
                };
            }
            var (message, messageType) = _monitoreos.ModificarMetaIndicador(identity, metaIndicador);
            if (messageType == "1")
            {
                return new BadRequestObjectResult(new { success = false, message });
            }
            else if (messageType == "2")
            {
                return new ConflictObjectResult(new { success = false, message });
            }
            else
            {
                return new OkObjectResult(new { success = true, message });
            }
        }

        [HttpPut]
        [Route("meta-indicador")]
        public dynamic ModificarMetaIndicadorTransaction(MetaIndicadorDto? metaIndicadorDto)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var rToken = Jwt.validarToken(identity, _usuarios);

            if (!rToken.success) return rToken;

            dynamic data = rToken.result;
            Usuario usuarioActual = new Usuario
            {
                UsuAno = data.UsuAno,
                UsuCod = data.UsuCod,
                RolCod = data.RolCod
            };
            if (usuarioActual.RolCod != "01")
            {
                return new
                {
                    success = false,
                    message = "No tienes permisos para modificar usuarios",
                    result = ""
                };
            }
            var (message, messageType) = _monitoreos.ModificarMetaIndicadorTransaction(identity, metaIndicadorDto.Meta, metaIndicadorDto.MetaIndicador);
            if (messageType == "1")
            {
                return new BadRequestObjectResult(new { success = false, message });
            }
            else if (messageType == "2")
            {
                return new ConflictObjectResult(new { success = false, message });
            }
            else
            {
                return new OkObjectResult(new { success = true, message });
            }
        }



    }

}