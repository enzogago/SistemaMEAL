using Microsoft.Data.SqlClient;
using System.Data;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;
using Newtonsoft.Json;
using System.Text;
using System.Transactions;
using System.Security.Claims;

namespace SistemaMEAL.Modulos
{
    public class MonitoreoDAO
    {
        private UsuarioDAO _usuarioDAO;
        private conexionDAO cn = new conexionDAO();

        private readonly IHttpContextAccessor? _httpContextAccessor;

        public MonitoreoDAO(IHttpContextAccessor httpContextAccessor)
        {   
            _usuarioDAO  = new UsuarioDAO(httpContextAccessor);
        }

        private Usuario ObtenerUsuarioLogueado()
        {
            // Obtén los detalles del usuario actual de los claims del token
            var identity = _httpContextAccessor.HttpContext.User.Identity as ClaimsIdentity;
            var usuAno = identity.Claims.FirstOrDefault(x => x.Type == "ANO").Value;
            var usuCod = identity.Claims.FirstOrDefault(x => x.Type == "COD").Value;
            var ip = identity.Claims.FirstOrDefault(x => x.Type == "IP").Value; // Obtiene la dirección IP del claim

            // Busca los detalles del usuario en la base de datos
            var usuarioActual = _usuarioDAO.BuscarUsuarioLog(usuAno, usuCod);

            // Asigna la dirección IP del claim a la propiedad Ip del usuario
            usuarioActual.Ip = ip;

            return usuarioActual;
        }

        public IEnumerable<Monitoreo> Listado(string? tags)
        {
            List<Monitoreo>? temporal = new List<Monitoreo>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_LISTAR_MONITOREO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@P_TAGS", tags ?? string.Empty);

                StringBuilder jsonResult = new StringBuilder();
                SqlDataReader reader = cmd.ExecuteReader();
                if (!reader.HasRows)
                {
                    jsonResult.Append("[]");
                }
                else
                {
                    while (reader.Read())
                    {
                        jsonResult.Append(reader.GetValue(0).ToString());
                    }
                }
                // Deserializa la cadena JSON en una lista de objetos Estado
                temporal = JsonConvert.DeserializeObject<List<Monitoreo>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
             return temporal?? new List<Monitoreo>();
        }
        
        public int GetBeneficiariosCount(string tags)
        {
            int count = 0;
            try
            {
                cn.getcn.Open();
                SqlCommand cmd = new SqlCommand("SP_CONTAR_BENEFICIARIOS", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@P_TAGS", tags ?? string.Empty);

                var result = cmd.ExecuteScalar().ToString();
                var jsonObject = JsonConvert.DeserializeObject<List<Dictionary<string, int>>>(result);
                count = jsonObject[0]["TOTAL_BENEFICIARIOS"];
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return count;
        }

        public IEnumerable<Monitoreo> BuscarMonitoreo(string? metAno, string? metCod)
        {
            List<Monitoreo>? temporal = new List<Monitoreo>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_MONITOREO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_METANO", metAno);
                cmd.Parameters.AddWithValue("@P_METCOD", metCod);

                StringBuilder jsonResult = new StringBuilder();
                SqlDataReader reader = cmd.ExecuteReader();
                if (!reader.HasRows)
                {
                    jsonResult.Append("[]");
                }
                else
                {
                    while (reader.Read())
                    {
                        jsonResult.Append(reader.GetValue(0).ToString());
                    }
                }
                // Deserializa la cadena JSON en una lista de objetos Estado
                temporal = JsonConvert.DeserializeObject<List<Monitoreo>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
             return temporal?? new List<Monitoreo>();
        }
        public IEnumerable<Monitoreo> BuscarMonitoreoPorBeneficiario(string? benAno, string? benCod)
        {
            List<Monitoreo>? temporal = new List<Monitoreo>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_MONITOREO_POR_BENEFICIARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_BENANO", benAno);
                cmd.Parameters.AddWithValue("@P_BENCOD", benCod);

                StringBuilder jsonResult = new StringBuilder();
                SqlDataReader reader = cmd.ExecuteReader();
                if (!reader.HasRows)
                {
                    jsonResult.Append("[]");
                }
                else
                {
                    while (reader.Read())
                    {
                        jsonResult.Append(reader.GetValue(0).ToString());
                    }
                }
                // Deserializa la cadena JSON en una lista de objetos Estado
                temporal = JsonConvert.DeserializeObject<List<Monitoreo>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
             return temporal?? new List<Monitoreo>();
        }

        public IEnumerable<Monitoreo> ListarIndicadoresPorProyecto(string? proAno, string? proCod)
        {
            List<Monitoreo>? temporal = new List<Monitoreo>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_LISTAR_INDICADORES_POR_PROYECTO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_PROANO", proAno);
                cmd.Parameters.AddWithValue("@P_PROCOD", proCod);

                StringBuilder jsonResult = new StringBuilder();
                SqlDataReader reader = cmd.ExecuteReader();
                if (!reader.HasRows)
                {
                    jsonResult.Append("[]");
                }
                else
                {
                    while (reader.Read())
                    {
                        jsonResult.Append(reader.GetValue(0).ToString());
                    }
                }
                // Deserializa la cadena JSON en una lista de objetos Estado
                temporal = JsonConvert.DeserializeObject<List<Monitoreo>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
             return temporal?? new List<Monitoreo>();
        }
        
        public IEnumerable<Monitoreo> ObtenerJerarquia(string? indAno, string? indCod)
        {
            List<Monitoreo>? temporal = new List<Monitoreo>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_OBTENER_JERARQUIA", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_INDANO", indAno);
                cmd.Parameters.AddWithValue("@P_INDCOD", indCod);

                StringBuilder jsonResult = new StringBuilder();
                SqlDataReader reader = cmd.ExecuteReader();
                if (!reader.HasRows)
                {
                    jsonResult.Append("[]");
                }
                else
                {
                    while (reader.Read())
                    {
                        jsonResult.Append(reader.GetValue(0).ToString());
                    }
                }
                // Deserializa la cadena JSON en una lista de objetos Estado
                temporal = JsonConvert.DeserializeObject<List<Monitoreo>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<Monitoreo>();
        }
        



        public (string? benAnoOut,string? benCodOut,string? message, string? messageType) InsertarBeneficiario(Beneficiario beneficiario)
        {
            string? mensaje = "";
            string? tipoMensaje = "";
            string? benAnoOut = "";
            string? benCodOut = "";
            try
            {

                SqlCommand cmd = new SqlCommand("SP_INSERTAR_BENEFICIARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_BENNOM", beneficiario.BenNom);
                cmd.Parameters.AddWithValue("@P_BENAPE", beneficiario.BenApe);
                cmd.Parameters.AddWithValue("@P_BENNOMAPO", beneficiario.BenNomApo);
                cmd.Parameters.AddWithValue("@P_BENAPEAPO", beneficiario.BenApeApo);
                cmd.Parameters.AddWithValue("@P_BENFECNAC", beneficiario.BenFecNac);
                cmd.Parameters.AddWithValue("@P_BENSEX", beneficiario.BenSex);
                cmd.Parameters.AddWithValue("@P_GENCOD", beneficiario.GenCod);
                cmd.Parameters.AddWithValue("@P_NACCOD", beneficiario.NacCod);
                cmd.Parameters.AddWithValue("@P_BENCORELE", beneficiario.BenCorEle);
                cmd.Parameters.AddWithValue("@P_BENTEL", beneficiario.BenTel);
                cmd.Parameters.AddWithValue("@P_BENTELCON", beneficiario.BenTelCon);
                cmd.Parameters.AddWithValue("@P_BENCODUNI", beneficiario.BenCodUni);
                cmd.Parameters.AddWithValue("@P_BENDIR", beneficiario.BenDir);
                cmd.Parameters.AddWithValue("@P_BENAUT", beneficiario.BenAut);
                cmd.Parameters.AddWithValue("@P_BENFECREG", "2024-02-06");
                cmd.Parameters.AddWithValue("@P_USUING", "Usuario");
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "GAGO");
                cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "AGUIRRE");

                SqlParameter pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                pDescripcionMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pDescripcionMensaje);

                SqlParameter pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                pTipoMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pTipoMensaje);

                SqlParameter pBenAno = new SqlParameter("@P_BENANO_OUT", SqlDbType.NVarChar, 4);
                pBenAno.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pBenAno);

                SqlParameter pBenCod = new SqlParameter("@P_BENCOD_OUT", SqlDbType.Char, 6);
                pBenCod.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pBenCod);

                cmd.ExecuteNonQuery();

                benAnoOut = pBenAno.Value.ToString();
                benCodOut = pBenCod.Value.ToString();
                mensaje = pDescripcionMensaje.Value.ToString();
                tipoMensaje = pTipoMensaje.Value.ToString();
                Console.WriteLine(mensaje);
            }
            catch (SqlException ex)
            {
                mensaje = ex.Message;
                tipoMensaje = "1";
            }
            finally
            {
            }
            return (benAnoOut, benCodOut, mensaje, tipoMensaje);
        }
        public (string? message, string? messageType) InsertarMetaBeneficiario(MetaBeneficiario metaBeneficiario)
        {
            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                SqlCommand cmd = new SqlCommand("SP_INSERTAR_META_BENEFICIARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_METANO", metaBeneficiario.MetAno);
                cmd.Parameters.AddWithValue("@P_METCOD", metaBeneficiario.MetCod);
                cmd.Parameters.AddWithValue("@P_BENANO", metaBeneficiario.BenAno);
                cmd.Parameters.AddWithValue("@P_BENCOD", metaBeneficiario.BenCod);
                cmd.Parameters.AddWithValue("@P_UBIANO", metaBeneficiario.UbiAno);
                cmd.Parameters.AddWithValue("@P_UBICOD", metaBeneficiario.UbiCod);
                cmd.Parameters.AddWithValue("@P_METBENMESEJETEC", metaBeneficiario.MetBenMesEjeTec);
                cmd.Parameters.AddWithValue("@P_METBENANOEJETEC", metaBeneficiario.MetBenAnoEjeTec);
                cmd.Parameters.AddWithValue("@P_USUING", "Usuario");
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "GAGO");
                cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "AGUIRRE");

                SqlParameter pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                pDescripcionMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pDescripcionMensaje);

                SqlParameter pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                pTipoMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pTipoMensaje);

                cmd.ExecuteNonQuery();

                mensaje = pDescripcionMensaje.Value.ToString();
                tipoMensaje = pTipoMensaje.Value.ToString();
            }
            catch (SqlException ex)
            {
                mensaje = ex.Message;
                tipoMensaje = "1";
            }
            finally
            {
            }
            return (mensaje, tipoMensaje);
        }

        public (string? message, string? messageType) InsertarDocumentoBeneficiario(DocumentoBeneficiario documentoBeneficiario)
        {
            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                SqlCommand cmd = new SqlCommand("SP_INSERTAR_DOCUMENTO_IDENTIDAD_BENEFICIARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_DOCIDECOD", documentoBeneficiario.DocIdeCod);
                cmd.Parameters.AddWithValue("@P_BENANO", documentoBeneficiario.BenAno);
                cmd.Parameters.AddWithValue("@P_BENCOD", documentoBeneficiario.BenCod);
                cmd.Parameters.AddWithValue("@P_DOCIDEBENNUM", documentoBeneficiario.DocIdeBenNum);
                cmd.Parameters.AddWithValue("@P_USUING", "Usuario");
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "GAGO");
                cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "AGUIRRE");

                SqlParameter pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                pDescripcionMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pDescripcionMensaje);

                SqlParameter pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                pTipoMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pTipoMensaje);

                cmd.ExecuteNonQuery();

                mensaje = pDescripcionMensaje.Value.ToString();
                tipoMensaje = pTipoMensaje.Value.ToString();
            }
            catch (SqlException ex)
            {
                mensaje = ex.Message;
                tipoMensaje = "1";
            }
            finally
            {
            }
            return (mensaje, tipoMensaje);
        }


        public (string? message, string? messageType) InsertarBeneficiarioMonitoreo(Beneficiario beneficiario, MetaBeneficiario metaBeneficiario, List<DocumentoBeneficiario> documentosBeneficiario)
        {
            string? mensaje = "";
            string? tipoMensaje = "";

            using (TransactionScope scope = new TransactionScope())
            {
                using (SqlConnection connection = cn.getcn)
                {
                    try
                    {
                        if (connection.State == ConnectionState.Closed)
                        {
                            connection.Open();
                        }

                        // Inserta el beneficiario
                        var resultBeneficiario = InsertarBeneficiario(beneficiario);
                        if (resultBeneficiario.messageType != "3")
                        {
                            Console.WriteLine(resultBeneficiario.message);
                            throw new Exception(resultBeneficiario.message);
                        }

                        // Actualiza el MetaBeneficiario con los IDs del beneficiario insertado
                        metaBeneficiario.BenAno = resultBeneficiario.benAnoOut;
                        metaBeneficiario.BenCod = resultBeneficiario.benCodOut;

                        // Inserta el MetaBeneficiario
                        var resultMetaBeneficiario = InsertarMetaBeneficiario(metaBeneficiario);
                        if (resultMetaBeneficiario.messageType != "3")
                        {
                            Console.WriteLine(resultMetaBeneficiario.message);
                            throw new Exception(resultMetaBeneficiario.message);
                        }

                        // Inserta cada DocumentoBeneficiario
                        foreach (var documento in documentosBeneficiario)
                        {
                            // Actualiza el DocumentoBeneficiario con los IDs del beneficiario insertado
                            documento.BenAno = resultBeneficiario.benAnoOut;
                            documento.BenCod = resultBeneficiario.benCodOut;

                            // Inserta el DocumentoBeneficiario
                            var resultDocumentoBeneficiario = InsertarDocumentoBeneficiario(documento);
                            if (resultDocumentoBeneficiario.messageType != "3")
                            {
                                Console.WriteLine(resultDocumentoBeneficiario.message);
                                throw new Exception(resultDocumentoBeneficiario.message);
                            }
                        }

                        // Si todas las operaciones fueron exitosas, confirma la transacción
                        scope.Complete();
                        mensaje = resultBeneficiario.message;
                        tipoMensaje = "3";
                    }
                    catch (Exception ex)
                    {
                        // Si alguna operación falló, la transacción se revierte.
                        mensaje = ex.Message;
                        tipoMensaje = "1";
                        Console.WriteLine(ex);
                    }
                }
            }

            return (mensaje, tipoMensaje);
        }

        public (string? message, string? messageType) ModificarMeta(Meta meta)
        {
            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                cn.getcn.Open();
                SqlCommand cmd = new SqlCommand("SP_MODIFICAR_META", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_METANO", meta.MetAno);
                cmd.Parameters.AddWithValue("@P_METCOD", meta.MetCod);
                cmd.Parameters.AddWithValue("@P_METMETTEC", meta.MetMetTec);
                cmd.Parameters.AddWithValue("@P_METMESPLATEC", meta.MetMesPlaTec);
                cmd.Parameters.AddWithValue("@P_METANOPLATEC", meta.MetAnoPlaTec);
                cmd.Parameters.AddWithValue("@P_METMETPRE", meta.MetMetPre);
                cmd.Parameters.AddWithValue("@P_IMPCOD", meta.ImpCod);
                cmd.Parameters.AddWithValue("@P_UBIANO", meta.UbiAno);
                cmd.Parameters.AddWithValue("@P_UBICOD", meta.UbiCod);
                cmd.Parameters.AddWithValue("@P_USUMOD", "Usuario");
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "GAGO");
                cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "AGUIRRE");

                SqlParameter pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                pDescripcionMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pDescripcionMensaje);

                SqlParameter pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                pTipoMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pTipoMensaje);

                cmd.ExecuteNonQuery();

                mensaje = pDescripcionMensaje.Value.ToString();
                tipoMensaje = pTipoMensaje.Value.ToString();
                Console.WriteLine(mensaje);
            }
            catch (SqlException ex)
            {
                mensaje = ex.Message;
                tipoMensaje = "1";
                Console.WriteLine(mensaje);
            }
            finally
            {
                cn.getcn.Close();
            }
            return (mensaje, tipoMensaje);
        }

        public (string? metAnoOut,string? metCodOut,string? message, string? messageType) InsertarMeta(Meta meta)
        {
            string? mensaje = "";
            string? tipoMensaje = "";
            string? metAnoOut = "";
            string? metCodOut = "";
            try
            {

                SqlCommand cmd = new SqlCommand("SP_INSERTAR_META", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_ESTCOD", "01");
                cmd.Parameters.AddWithValue("@P_METMETTEC", meta.MetMetTec);
                cmd.Parameters.AddWithValue("@P_METEJETEC", "0");
                cmd.Parameters.AddWithValue("@P_METPORAVATEC", "00.00");
                cmd.Parameters.AddWithValue("@P_METMESPLATEC", meta.MetMesPlaTec);
                cmd.Parameters.AddWithValue("@P_METANOPLATEC", meta.MetAnoPlaTec);
                cmd.Parameters.AddWithValue("@P_METMETPRE", meta.MetMetPre);
                cmd.Parameters.AddWithValue("@P_METEJEPRE", meta.MetEjePre);
                cmd.Parameters.AddWithValue("@P_METPORAVAPRE", meta.MetEjePre);
                cmd.Parameters.AddWithValue("@P_METMESPLAPRE", "");
                cmd.Parameters.AddWithValue("@P_METANOPLAPRE", "");
                cmd.Parameters.AddWithValue("@P_IMPCOD", meta.ImpCod);
                cmd.Parameters.AddWithValue("@P_UBIANO", meta.UbiAno);
                cmd.Parameters.AddWithValue("@P_UBICOD", meta.UbiCod);
                cmd.Parameters.AddWithValue("@P_USUING", "Usuario");
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "GAGO");
                cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "AGUIRRE");

                SqlParameter pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                pDescripcionMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pDescripcionMensaje);

                SqlParameter pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                pTipoMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pTipoMensaje);

                SqlParameter pMetAno = new SqlParameter("@P_METANO_OUT", SqlDbType.NVarChar, 4);
                pMetAno.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pMetAno);

                SqlParameter pMetCod = new SqlParameter("@P_METCOD_OUT", SqlDbType.Char, 6);
                pMetCod.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pMetCod);

                cmd.ExecuteNonQuery();

                metAnoOut = pMetAno.Value.ToString();
                metCodOut = pMetCod.Value.ToString();
                mensaje = pDescripcionMensaje.Value.ToString();
                tipoMensaje = pTipoMensaje.Value.ToString();
            }
            catch (SqlException ex)
            {
                mensaje = ex.Message;
                tipoMensaje = "1";
            }
            finally
            {
            }
            return (metAnoOut, metCodOut, mensaje, tipoMensaje);
        }

        public (string? message, string? messageType) InsertarMetaIndicador(MetaIndicador metaIndicador)
        {
            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                SqlCommand cmd = new SqlCommand("SP_INSERTAR_META_INDICADOR", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_METANO", metaIndicador.MetAno);
                cmd.Parameters.AddWithValue("@P_METCOD", metaIndicador.MetCod);
                cmd.Parameters.AddWithValue("@P_INDANO", metaIndicador.IndAno);
                cmd.Parameters.AddWithValue("@P_INDCOD", metaIndicador.IndCod);
                cmd.Parameters.AddWithValue("@P_USUING", "Usuario");
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "GAGO");
                cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "AGUIRRE");

                SqlParameter pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                pDescripcionMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pDescripcionMensaje);

                SqlParameter pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                pTipoMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pTipoMensaje);

                cmd.ExecuteNonQuery();

                mensaje = pDescripcionMensaje.Value.ToString();
                tipoMensaje = pTipoMensaje.Value.ToString();
            }
            catch (SqlException ex)
            {
                mensaje = ex.Message;
                tipoMensaje = "1";
            }
            finally
            {
            }
            return (mensaje, tipoMensaje);
        }


        public (string? message, string? messageType) InsertarMetaMonitoreo(Meta meta, MetaIndicador metaIndicador)
        {
            string? mensaje = "";
            string? tipoMensaje = "";

            // Crea el TransactionScope en el que se ejecutarán los comandos, garantizando
            // que ambos comandos se confirmarán o revertirán como una sola unidad de trabajo.
            using (TransactionScope scope = new TransactionScope())
            {
                using (SqlConnection connection = cn.getcn)
                {
                    try
                    {
                        if (connection.State == ConnectionState.Closed)
                        {
                            connection.Open();
                        }

                        // Inserta el beneficiario
                        var resultMeta = InsertarMeta(meta);
                        Console.WriteLine(resultMeta.metAnoOut);
                        if (resultMeta.messageType != "3")
                        {
                            throw new Exception(resultMeta.message);
                        }

                        // Actualiza el MetaBeneficiario con los IDs del beneficiario insertado
                        metaIndicador.MetAno = resultMeta.metAnoOut;
                        metaIndicador.MetCod = resultMeta.metCodOut;

                        // Inserta el MetaBeneficiario
                        var resultMetaIndicador = InsertarMetaIndicador(metaIndicador);
                        Console.WriteLine(resultMetaIndicador.message);
                        if (resultMetaIndicador.messageType != "3")
                        {
                            throw new Exception(resultMetaIndicador.message);
                        }

                        // Si ambas operaciones fueron exitosas, confirma la transacción
                        scope.Complete();
                        mensaje = resultMeta.message;
                        tipoMensaje = "3";
                    }
                    catch (Exception ex)
                    {
                        // Si alguna operación falló, la transacción se revierte.
                        mensaje = ex.Message;
                        tipoMensaje = "1";
                        Console.WriteLine(ex);
                    }
                }
            }

            return (mensaje, tipoMensaje);
        }

        public (string? message, string? messageType) InsertarMetaBeneficiarioExiste(MetaBeneficiario metaBeneficiario)
        {
            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                cn.getcn.Open();
                SqlCommand cmd = new SqlCommand("SP_INSERTAR_META_BENEFICIARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_METANO", metaBeneficiario.MetAno);
                cmd.Parameters.AddWithValue("@P_METCOD", metaBeneficiario.MetCod);
                cmd.Parameters.AddWithValue("@P_BENANO", metaBeneficiario.BenAno);
                cmd.Parameters.AddWithValue("@P_BENCOD", metaBeneficiario.BenCod);
                cmd.Parameters.AddWithValue("@P_UBIANO", metaBeneficiario.UbiAno);
                cmd.Parameters.AddWithValue("@P_UBICOD", metaBeneficiario.UbiCod);
                cmd.Parameters.AddWithValue("@P_METBENMESEJETEC", metaBeneficiario.MetBenMesEjeTec);
                cmd.Parameters.AddWithValue("@P_METBENANOEJETEC", metaBeneficiario.MetBenAnoEjeTec);
                cmd.Parameters.AddWithValue("@P_USUING", "Usuario");
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                cmd.Parameters.AddWithValue("@P_USUNOM_U"   , "ENZO");
                cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "GAGO");
                cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "AGUIRRE");

                SqlParameter pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                pDescripcionMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pDescripcionMensaje);

                SqlParameter pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                pTipoMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pTipoMensaje);

                cmd.ExecuteNonQuery();

                mensaje = pDescripcionMensaje.Value.ToString();
                tipoMensaje = pTipoMensaje.Value.ToString();
            }
            catch (SqlException ex)
            {
                mensaje = ex.Message;
                tipoMensaje = "1";
            }
            finally
            {
                cn.getcn.Close();
            }
            return (mensaje, tipoMensaje);
        }

        public (string? message, string? messageType) EliminarBeneficiarioMonitoreo(string metAno, string metCod, string benAno, string benCod, string ubiAno, string ubiCod, string metBenAnoEjeTec, string metBenMesEjeTec)
        {
            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_ELIMINAR_META_BENEFICIARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_METANO", metAno);
                cmd.Parameters.AddWithValue("@P_METCOD", metCod);
                cmd.Parameters.AddWithValue("@P_BENANO", benAno);
                cmd.Parameters.AddWithValue("@P_BENCOD", benCod);
                cmd.Parameters.AddWithValue("@P_UBIANO", ubiAno);
                cmd.Parameters.AddWithValue("@P_UBICOD", ubiCod);
                cmd.Parameters.AddWithValue("@P_METBENANOEJETEC", metBenAnoEjeTec);
                cmd.Parameters.AddWithValue("@P_METBENMESEJETEC", metBenMesEjeTec);
                cmd.Parameters.AddWithValue("@P_USUMOD", "Usuario");
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "GAGO");
                cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "AGUIRRE");

                SqlParameter pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                pDescripcionMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pDescripcionMensaje);

                SqlParameter pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                pTipoMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pTipoMensaje);

                cmd.ExecuteNonQuery();

                mensaje = pDescripcionMensaje.Value.ToString();
                tipoMensaje = pTipoMensaje.Value.ToString();
            }
            catch (SqlException ex)
            {
                mensaje = ex.Message;
            }
            finally
            {
                cn.getcn.Close();
            }
            return (mensaje, tipoMensaje);
        }

        public IEnumerable<Monitoreo> BuscarPaisesHome(string? tags)
        {
            List<Monitoreo>? temporal = new List<Monitoreo>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_UBICACION_HOME", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@P_TAGS", tags ?? string.Empty);

                StringBuilder jsonResult = new StringBuilder();
                SqlDataReader reader = cmd.ExecuteReader();
                if (!reader.HasRows)
                {
                    jsonResult.Append("[]");
                }
                else
                {
                    while (reader.Read())
                    {
                        jsonResult.Append(reader.GetValue(0).ToString());
                    }
                }
                // Deserializa la cadena JSON en una lista de objetos Usuario
                temporal = JsonConvert.DeserializeObject<List<Monitoreo>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<Monitoreo>();
        }

        public IEnumerable<Beneficiario> BuscarMonitoreoForm(string? metAno, string? metCod, string? benAno, string? benCod, string? ubiAno, string? ubiCod, string? metBenAnoEjeTec, string? metBenMesEjeTec, string? metBenEda = null)
        {
            List<Beneficiario>? temporal = new List<Beneficiario>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_META_BENEFICIARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                // Aquí puedes agregar los parámetros necesarios para tu procedimiento almacenado
                cmd.Parameters.AddWithValue("@P_METANO", string.IsNullOrEmpty(metAno) ? (object)DBNull.Value : metAno);
                cmd.Parameters.AddWithValue("@P_METCOD", string.IsNullOrEmpty(metCod) ? (object)DBNull.Value : metCod);
                cmd.Parameters.AddWithValue("@P_BENANO", string.IsNullOrEmpty(benAno) ? (object)DBNull.Value : benAno);
                cmd.Parameters.AddWithValue("@P_BENCOD", string.IsNullOrEmpty(benCod) ? (object)DBNull.Value : benCod);
                cmd.Parameters.AddWithValue("@P_UBIANO", string.IsNullOrEmpty(ubiAno) ? (object)DBNull.Value : ubiAno);
                cmd.Parameters.AddWithValue("@P_UBICOD", string.IsNullOrEmpty(ubiCod) ? (object)DBNull.Value : ubiCod);
                cmd.Parameters.AddWithValue("@P_METBENEDA", string.IsNullOrEmpty(metBenEda) ? (object)DBNull.Value : metBenEda);
                cmd.Parameters.AddWithValue("@P_METBENMESEJETEC", string.IsNullOrEmpty(metBenMesEjeTec) ? (object)DBNull.Value : metBenMesEjeTec);
                cmd.Parameters.AddWithValue("@P_METBENANOEJETEC", string.IsNullOrEmpty(metBenAnoEjeTec) ? (object)DBNull.Value : metBenAnoEjeTec);
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                cmd.Parameters.AddWithValue("@P_USUANO_U", "2024");
                cmd.Parameters.AddWithValue("@P_USUCOD_U", "0001");
                cmd.Parameters.AddWithValue("@P_USUNOM_U", "Juan");
                cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "Perez");
                cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "Gomez");

                SqlParameter pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                pDescripcionMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pDescripcionMensaje);

                SqlParameter pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                pTipoMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pTipoMensaje);

                StringBuilder jsonResult = new StringBuilder();
                SqlDataReader reader = cmd.ExecuteReader();
                if (!reader.HasRows)
                {
                    jsonResult.Append("[]");
                }
                else
                {
                    while (reader.Read())
                    {
                        Console.WriteLine("desde reader:"+reader.GetValue(0).ToString());
                        jsonResult.Append(reader.GetValue(0).ToString());
                    }
                }
                Console.WriteLine("desde jsonResult final:"+jsonResult);
                // Deserializa la cadena JSON en una lista de objetos Usuario
                temporal = JsonConvert.DeserializeObject<List<Beneficiario>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<Beneficiario>();
        }

        public (string? message, string? messageType) ModificarMetaBeneficiario(MetaBeneficiario metaBeneficiario)
        {
            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_MODIFICAR_META_BENEFICIARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_METANO_ORIGINAL", metaBeneficiario.MetAnoOri);
                cmd.Parameters.AddWithValue("@P_METCOD_ORIGINAL", metaBeneficiario.MetCodOri);
                cmd.Parameters.AddWithValue("@P_BENANO_ORIGINAL", metaBeneficiario.BenAnoOri);
                cmd.Parameters.AddWithValue("@P_BENCOD_ORIGINAL", metaBeneficiario.BenCodOri);
                cmd.Parameters.AddWithValue("@P_UBIANO_ORIGINAL", metaBeneficiario.UbiAnoOri);
                cmd.Parameters.AddWithValue("@P_UBICOD_ORIGINAL", metaBeneficiario.UbiCodOri);
                cmd.Parameters.AddWithValue("@P_METBENMESEJETEC_ORIGINAL", metaBeneficiario.MetBenMesEjeTecOri);
                cmd.Parameters.AddWithValue("@P_METBENANOEJETEC_ORIGINAL", metaBeneficiario.MetBenAnoEjeTecOri);
                cmd.Parameters.AddWithValue("@P_METANO", metaBeneficiario.MetAno);
                cmd.Parameters.AddWithValue("@P_METCOD", metaBeneficiario.MetCod);
                cmd.Parameters.AddWithValue("@P_BENANO", metaBeneficiario.BenAno);
                cmd.Parameters.AddWithValue("@P_BENCOD", metaBeneficiario.BenCod);
                cmd.Parameters.AddWithValue("@P_UBIANO", metaBeneficiario.UbiAno);
                cmd.Parameters.AddWithValue("@P_UBICOD", metaBeneficiario.UbiCod);
                cmd.Parameters.AddWithValue("@P_METBENEDA", metaBeneficiario.MetBenEda);
                cmd.Parameters.AddWithValue("@P_METBENMESEJETEC", metaBeneficiario.MetBenMesEjeTec);
                cmd.Parameters.AddWithValue("@P_METBENANOEJETEC", metaBeneficiario.MetBenAnoEjeTec);
                cmd.Parameters.AddWithValue("@P_USUMOD", "Usuario");
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "GAGO");
                cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "AGUIRRE");

                SqlParameter pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                pDescripcionMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pDescripcionMensaje);

                SqlParameter pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                pTipoMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pTipoMensaje);

                cmd.ExecuteNonQuery();

                mensaje = pDescripcionMensaje.Value.ToString();
                tipoMensaje = pTipoMensaje.Value.ToString();
            }
            catch (SqlException ex)
            {
                mensaje = ex.Message;
                tipoMensaje = "1";
            }
            finally
            {
                cn.getcn.Close();
            }
            return (mensaje, tipoMensaje);
        }


        public (string? message, string? messageType) ModificarBeneficiarioTransaction(Beneficiario beneficiario)
        {
            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {

                SqlCommand cmd = new SqlCommand("SP_MODIFICAR_BENEFICIARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_BENANO", beneficiario.BenAno);
                cmd.Parameters.AddWithValue("@P_BENCOD", beneficiario.BenCod);
                cmd.Parameters.AddWithValue("@P_BENNOM", beneficiario.BenNom);
                cmd.Parameters.AddWithValue("@P_BENAPE", beneficiario.BenApe);
                cmd.Parameters.AddWithValue("@P_BENNOMAPO", beneficiario.BenNom);
                cmd.Parameters.AddWithValue("@P_BENAPEAPO", beneficiario.BenApe);
                cmd.Parameters.AddWithValue("@P_BENFECNAC", beneficiario.BenFecNac);
                cmd.Parameters.AddWithValue("@P_BENSEX", beneficiario.BenSex);
                cmd.Parameters.AddWithValue("@P_GENCOD", beneficiario.GenCod);
                cmd.Parameters.AddWithValue("@P_NACCOD", beneficiario.NacCod);
                cmd.Parameters.AddWithValue("@P_BENCORELE", beneficiario.BenCorEle);
                cmd.Parameters.AddWithValue("@P_BENTEL", beneficiario.BenTel);
                cmd.Parameters.AddWithValue("@P_BENTELCON", beneficiario.BenTelCon);
                cmd.Parameters.AddWithValue("@P_BENCODUNI", beneficiario.BenCodUni);
                cmd.Parameters.AddWithValue("@P_BENDIR", beneficiario.BenDir);
                cmd.Parameters.AddWithValue("@P_BENAUT", beneficiario.BenAut);
                cmd.Parameters.AddWithValue("@P_BENFECREG", "10-02-2024");
                cmd.Parameters.AddWithValue("@P_USUMOD", "Usuario");
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "GAGO");
                cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "AGUIRRE");

                SqlParameter pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                pDescripcionMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pDescripcionMensaje);

                SqlParameter pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                pTipoMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pTipoMensaje);

                cmd.ExecuteNonQuery();

                mensaje = pDescripcionMensaje.Value.ToString();
                tipoMensaje = pTipoMensaje.Value.ToString();
                Console.WriteLine(mensaje);
            }
            catch (SqlException ex)
            {
                mensaje = ex.Message;
                tipoMensaje = "1";
            }
            finally
            {
            }
            return (mensaje, tipoMensaje);
        }
        public (string? message, string? messageType) ModificarMetaBeneficiarioTransaction(MetaBeneficiario metaBeneficiario)
        {
            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                SqlCommand cmd = new SqlCommand("SP_MODIFICAR_META_BENEFICIARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_METANO_ORIGINAL", metaBeneficiario.MetAnoOri);
                cmd.Parameters.AddWithValue("@P_METCOD_ORIGINAL", metaBeneficiario.MetCodOri);
                cmd.Parameters.AddWithValue("@P_BENANO_ORIGINAL", metaBeneficiario.BenAnoOri);
                cmd.Parameters.AddWithValue("@P_BENCOD_ORIGINAL", metaBeneficiario.BenCodOri);
                cmd.Parameters.AddWithValue("@P_UBIANO_ORIGINAL", metaBeneficiario.UbiAnoOri);
                cmd.Parameters.AddWithValue("@P_UBICOD_ORIGINAL", metaBeneficiario.UbiCodOri);
                cmd.Parameters.AddWithValue("@P_METBENMESEJETEC_ORIGINAL", metaBeneficiario.MetBenMesEjeTecOri);
                cmd.Parameters.AddWithValue("@P_METBENANOEJETEC_ORIGINAL", metaBeneficiario.MetBenAnoEjeTecOri);
                cmd.Parameters.AddWithValue("@P_METANO", metaBeneficiario.MetAno);
                cmd.Parameters.AddWithValue("@P_METCOD", metaBeneficiario.MetCod);
                cmd.Parameters.AddWithValue("@P_BENANO", metaBeneficiario.BenAno);
                cmd.Parameters.AddWithValue("@P_BENCOD", metaBeneficiario.BenCod);
                cmd.Parameters.AddWithValue("@P_UBIANO", metaBeneficiario.UbiAno);
                cmd.Parameters.AddWithValue("@P_UBICOD", metaBeneficiario.UbiCod);
                cmd.Parameters.AddWithValue("@P_METBENEDA", metaBeneficiario.MetBenEda);
                cmd.Parameters.AddWithValue("@P_METBENMESEJETEC", metaBeneficiario.MetBenMesEjeTec);
                cmd.Parameters.AddWithValue("@P_METBENANOEJETEC", metaBeneficiario.MetBenAnoEjeTec);
                cmd.Parameters.AddWithValue("@P_USUMOD", "Usuario");
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "GAGO");
                cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "AGUIRRE");

                SqlParameter pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                pDescripcionMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pDescripcionMensaje);

                SqlParameter pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                pTipoMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pTipoMensaje);

                cmd.ExecuteNonQuery();

                mensaje = pDescripcionMensaje.Value.ToString();
                tipoMensaje = pTipoMensaje.Value.ToString();
            }
            catch (SqlException ex)
            {
                mensaje = ex.Message;
                tipoMensaje = "1";
            }
            finally
            {
            }
            return (mensaje, tipoMensaje);
        }

        public (string? message, string? messageType) ModificarBeneficiarioMonitoreo(Beneficiario beneficiario, MetaBeneficiario metaBeneficiario)
        {
            string? mensaje = "";
            string? tipoMensaje = "";

            using (TransactionScope scope = new TransactionScope())
            {
                using (SqlConnection connection = cn.getcn)
                {
                    try
                    {
                        if (connection.State == ConnectionState.Closed)
                        {
                            connection.Open();
                        }

                        // Inserta el beneficiario
                        var resultBeneficiario = ModificarBeneficiarioTransaction(beneficiario);
                        if (resultBeneficiario.messageType != "3")
                        {
                            Console.WriteLine(resultBeneficiario.message);
                            throw new Exception(resultBeneficiario.message);
                        }

                        // Inserta el MetaBeneficiario
                        var resultMetaBeneficiario = ModificarMetaBeneficiarioTransaction(metaBeneficiario);
                        if (resultMetaBeneficiario.messageType != "3")
                        {
                            Console.WriteLine(resultMetaBeneficiario.message);
                            throw new Exception(resultMetaBeneficiario.message);
                        }


                        // Si todas las operaciones fueron exitosas, confirma la transacción
                        scope.Complete();
                        mensaje = resultMetaBeneficiario.message;
                        tipoMensaje = "3";
                    }
                    catch (Exception ex)
                    {
                        // Si alguna operación falló, la transacción se revierte.
                        mensaje = ex.Message;
                        tipoMensaje = "1";
                        Console.WriteLine(ex);
                    }
                }
            }

            return (mensaje, tipoMensaje);
        }

        public IEnumerable<MetaIndicador> BuscarMetaIndicador(string? metAno = null, string? metCod = null, string? indAno = null, string? indCod = null)
        {
            List<MetaIndicador>? temporal = new List<MetaIndicador>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_META_INDICADOR", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                // Aquí puedes agregar los parámetros necesarios para tu procedimiento almacenado
                cmd.Parameters.AddWithValue("@P_METANO", string.IsNullOrEmpty(metAno) ? (object)DBNull.Value : metAno);
                cmd.Parameters.AddWithValue("@P_METCOD", string.IsNullOrEmpty(metCod) ? (object)DBNull.Value : metCod);
                cmd.Parameters.AddWithValue("@P_INDANO", string.IsNullOrEmpty(indAno) ? (object)DBNull.Value : indAno);
                cmd.Parameters.AddWithValue("@P_INDCOD", string.IsNullOrEmpty(indCod) ? (object)DBNull.Value : indCod);
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                cmd.Parameters.AddWithValue("@P_USUANO_U", "2024");
                cmd.Parameters.AddWithValue("@P_USUCOD_U", "0001");
                cmd.Parameters.AddWithValue("@P_USUNOM_U", "Juan");
                cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "Perez");
                cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "Gomez");

                SqlParameter pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                pDescripcionMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pDescripcionMensaje);

                SqlParameter pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                pTipoMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pTipoMensaje);

                StringBuilder jsonResult = new StringBuilder();
                SqlDataReader reader = cmd.ExecuteReader();
                if (!reader.HasRows)
                {
                    jsonResult.Append("[]");
                }
                else
                {
                    while (reader.Read())
                    {
                        jsonResult.Append(reader.GetValue(0).ToString());
                    }
                }
                // Deserializa la cadena JSON en una lista de objetos Usuario
                temporal = JsonConvert.DeserializeObject<List<MetaIndicador>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<MetaIndicador>();
        }

        public (string? message, string? messageType) EliminarMetaIndicador(string? metAno = null, string? metCod = null, string? metIndAno = null, string? metIndCod = null)
        {
            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_ELIMINAR_META_INDICADOR", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_METANO", metAno);
                cmd.Parameters.AddWithValue("@P_METCOD", metCod);
                cmd.Parameters.AddWithValue("@P_INDANO", metIndAno);
                cmd.Parameters.AddWithValue("@P_INDCOD", metIndCod);
                cmd.Parameters.AddWithValue("@P_USUMOD", "Usuario");
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "GAGO");
                cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "AGUIRRE");

                SqlParameter pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                pDescripcionMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pDescripcionMensaje);

                SqlParameter pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                pTipoMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pTipoMensaje);

                cmd.ExecuteNonQuery();

                mensaje = pDescripcionMensaje.Value.ToString();
                tipoMensaje = pTipoMensaje.Value.ToString();
            }
            catch (SqlException ex)
            {
                mensaje = ex.Message;
            }
            finally
            {
                cn.getcn.Close();
            }
            return (mensaje, tipoMensaje);
        }

        public (string? message, string? messageType) ModificarMetaIndicador(MetaIndicador metaIndicador)
        {
            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_MODIFICAR_META_INDICADOR", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_METANO_ORIGINAL", metaIndicador.MetAnoOri);
                cmd.Parameters.AddWithValue("@P_METCOD_ORIGINAL", metaIndicador.MetCodOri);
                cmd.Parameters.AddWithValue("@P_INDANO_ORIGINAL", metaIndicador.IndAnoOri);
                cmd.Parameters.AddWithValue("@P_INDCOD_ORIGINAL", metaIndicador.IndCodOri);
                cmd.Parameters.AddWithValue("@P_METANO", metaIndicador.MetAno);
                cmd.Parameters.AddWithValue("@P_METCOD", metaIndicador.MetCod);
                cmd.Parameters.AddWithValue("@P_INDANO", metaIndicador.IndAno);
                cmd.Parameters.AddWithValue("@P_INDCOD", metaIndicador.IndCod);
                cmd.Parameters.AddWithValue("@P_USUMOD", "Usuario");
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "GAGO");
                cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "AGUIRRE");

                SqlParameter pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                pDescripcionMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pDescripcionMensaje);

                SqlParameter pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                pTipoMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pTipoMensaje);

                cmd.ExecuteNonQuery();

                mensaje = pDescripcionMensaje.Value.ToString();
                tipoMensaje = pTipoMensaje.Value.ToString();
            }
            catch (SqlException ex)
            {
                mensaje = ex.Message;
                tipoMensaje = "1";
            }
            finally
            {
                cn.getcn.Close();
            }
            return (mensaje, tipoMensaje);
        }


         public (string? message, string? messageType) ModificarMetaIndicadorTransaction(Meta meta, MetaIndicador metaIndicador)
        {
            string? mensaje = "";
            string? tipoMensaje = "";

            using (TransactionScope scope = new TransactionScope())
            {
                using (SqlConnection connection = cn.getcn)
                {
                    try
                    {
                        if (connection.State == ConnectionState.Closed)
                        {
                            connection.Open();
                        }

                        // Modiciar Meta
                        try
                        {
                            SqlCommand cmd = new SqlCommand("SP_MODIFICAR_META", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@P_METANO", meta.MetAno);
                            cmd.Parameters.AddWithValue("@P_METCOD", meta.MetCod);
                            cmd.Parameters.AddWithValue("@P_METMETTEC", meta.MetMetTec);
                            cmd.Parameters.AddWithValue("@P_METMESPLATEC", meta.MetMesPlaTec);
                            cmd.Parameters.AddWithValue("@P_METANOPLATEC", meta.MetAnoPlaTec);
                            cmd.Parameters.AddWithValue("@P_METMETPRE", meta.MetMetPre);
                            cmd.Parameters.AddWithValue("@P_IMPCOD", meta.ImpCod);
                            cmd.Parameters.AddWithValue("@P_UBIANO", meta.UbiAno);
                            cmd.Parameters.AddWithValue("@P_UBICOD", meta.UbiCod);
                            cmd.Parameters.AddWithValue("@P_USUMOD", "Usuario");
                            cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                            cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                            cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                            cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                            cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "GAGO");
                            cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "AGUIRRE");

                            SqlParameter pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                            pDescripcionMensaje.Direction = ParameterDirection.Output;
                            cmd.Parameters.Add(pDescripcionMensaje);

                            SqlParameter pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                            pTipoMensaje.Direction = ParameterDirection.Output;
                            cmd.Parameters.Add(pTipoMensaje);

                            cmd.ExecuteNonQuery();

                            mensaje = pDescripcionMensaje.Value.ToString();
                            tipoMensaje = pTipoMensaje.Value.ToString();
                        }
                        catch (SqlException ex)
                        {
                            mensaje = ex.Message;
                            Console.WriteLine(mensaje);
                            tipoMensaje = "1";
                        }

                        if (tipoMensaje != "3")
                        {
                            Console.WriteLine(mensaje);
                            return (mensaje,tipoMensaje);
                        }

                        // Modificar Indicador
                        try
                        {
                            SqlCommand cmd = new SqlCommand("SP_MODIFICAR_META_INDICADOR", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@P_METANO_ORIGINAL", metaIndicador.MetAnoOri);
                            cmd.Parameters.AddWithValue("@P_METCOD_ORIGINAL", metaIndicador.MetCodOri);
                            cmd.Parameters.AddWithValue("@P_INDANO_ORIGINAL", metaIndicador.IndAnoOri);
                            cmd.Parameters.AddWithValue("@P_INDCOD_ORIGINAL", metaIndicador.IndCodOri);
                            cmd.Parameters.AddWithValue("@P_METANO", metaIndicador.MetAno);
                            cmd.Parameters.AddWithValue("@P_METCOD", metaIndicador.MetCod);
                            cmd.Parameters.AddWithValue("@P_INDANO", metaIndicador.IndAno);
                            cmd.Parameters.AddWithValue("@P_INDCOD", metaIndicador.IndCod);
                            cmd.Parameters.AddWithValue("@P_USUMOD", "Usuario");
                            cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                            cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                            cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                            cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                            cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "GAGO");
                            cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "AGUIRRE");

                            SqlParameter pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                            pDescripcionMensaje.Direction = ParameterDirection.Output;
                            cmd.Parameters.Add(pDescripcionMensaje);

                            SqlParameter pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                            pTipoMensaje.Direction = ParameterDirection.Output;
                            cmd.Parameters.Add(pTipoMensaje);

                            cmd.ExecuteNonQuery();

                            mensaje = pDescripcionMensaje.Value.ToString();
                            tipoMensaje = pTipoMensaje.Value.ToString();
                        }
                        catch (SqlException ex)
                        {
                            mensaje = ex.Message;
                            tipoMensaje = "1";
                            Console.WriteLine(mensaje);
                        }
                        if (tipoMensaje != "3")
                        {
                            Console.WriteLine(mensaje);
                            return (mensaje,tipoMensaje);
                        }


                        // Si todas las operaciones fueron exitosas, confirma la transacción
                        scope.Complete();
                    }
                    catch (Exception ex)
                    {
                        // Si alguna operación falló, la transacción se revierte.
                        mensaje = ex.Message;
                        tipoMensaje = "1";
                        Console.WriteLine(ex);
                    }
                }
            }

            return (mensaje, tipoMensaje);
        }



    }
}