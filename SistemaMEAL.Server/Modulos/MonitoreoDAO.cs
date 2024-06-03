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
        private conexionDAO cn = new conexionDAO();

        public IEnumerable<Monitoreo> Listado(ClaimsIdentity? identity, string? tags = null, string? periodoInicio = null, string? periodoFin = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            List<Monitoreo>? temporal = new List<Monitoreo>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_LISTAR_MONITOREO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@P_TAGS", (tags == "null" ||  string.IsNullOrEmpty(tags)) ? string.Empty : tags);
                cmd.Parameters.AddWithValue("@P_PERINI", (periodoInicio == "null" ||  string.IsNullOrEmpty(periodoInicio)) ? string.Empty : periodoInicio);
                cmd.Parameters.AddWithValue("@P_PERFIN", (periodoFin == "null" ||  string.IsNullOrEmpty(periodoFin)) ? string.Empty : periodoFin);
                cmd.Parameters.AddWithValue("@P_USUANO", userClaims.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD", userClaims.UsuCod);

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


        public (string? benAnoOut,string? benCodOut,string? message, string? messageType) InsertarBeneficiario(ClaimsIdentity? identity, Beneficiario beneficiario)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

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
                cmd.Parameters.AddWithValue("@P_USUING", userClaims.UsuNomUsu);
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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
            }
            catch (SqlException ex)
            {
                mensaje = ex.Message;
                tipoMensaje = "1";
                Console.WriteLine(mensaje);
            }
            finally
            {
            }
            return (benAnoOut, benCodOut, mensaje, tipoMensaje);
        }
        public (string? message, string? messageType) InsertarMetaBeneficiario(ClaimsIdentity? identity, MetaBeneficiario metaBeneficiario)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

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
                cmd.Parameters.AddWithValue("@P_USUING", userClaims.UsuNomUsu);
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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

        public (string? message, string? messageType) InsertarDocumentoBeneficiario(ClaimsIdentity? identity, DocumentoBeneficiario documentoBeneficiario)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

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
                cmd.Parameters.AddWithValue("@P_USUING", userClaims.UsuNomUsu);
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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


        public (string? message, string? messageType) InsertarBeneficiarioMonitoreo(ClaimsIdentity? identity, Beneficiario beneficiario, MetaBeneficiario metaBeneficiario, List<DocumentoBeneficiario> documentosBeneficiario)
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
                        var resultBeneficiario = InsertarBeneficiario(identity, beneficiario);
                        if (resultBeneficiario.messageType != "3")
                        {
                            throw new Exception(resultBeneficiario.message);
                        }

                        // Actualiza el MetaBeneficiario con los IDs del beneficiario insertado
                        metaBeneficiario.BenAno = resultBeneficiario.benAnoOut;
                        metaBeneficiario.BenCod = resultBeneficiario.benCodOut;

                        // Inserta el MetaBeneficiario
                        var resultMetaBeneficiario = InsertarMetaBeneficiario(identity, metaBeneficiario);
                        if (resultMetaBeneficiario.messageType != "3")
                        {
                            throw new Exception(resultMetaBeneficiario.message);
                        }

                        // Inserta cada DocumentoBeneficiario
                        foreach (var documento in documentosBeneficiario)
                        {
                            // Actualiza el DocumentoBeneficiario con los IDs del beneficiario insertado
                            documento.BenAno = resultBeneficiario.benAnoOut;
                            documento.BenCod = resultBeneficiario.benCodOut;

                            // Inserta el DocumentoBeneficiario
                            var resultDocumentoBeneficiario = InsertarDocumentoBeneficiario(identity, documento);
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
        
        public (string? metAnoOut,string? metCodOut,string? message, string? messageType) InsertarMeta(ClaimsIdentity? identity, Meta meta)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

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
                cmd.Parameters.AddWithValue("@P_USUING", userClaims.UsuNomUsu);
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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

                cmd = new SqlCommand("SP_INSERTAR_USUARIO_ACCESO", cn.getcn);
                                    cmd.CommandType = CommandType.StoredProcedure;

                                    cmd.Parameters.AddWithValue("@P_USUANO", userClaims.UsuAno);
                                    cmd.Parameters.AddWithValue("@P_USUCOD", userClaims.UsuCod);
                                    cmd.Parameters.AddWithValue("@P_USUACCTIP", "META");
                                    cmd.Parameters.AddWithValue("@P_USUACCANO", metAnoOut);
                                    cmd.Parameters.AddWithValue("@P_USUACCCOD", metCodOut);
                                    cmd.Parameters.AddWithValue("@P_USUACCPAD", "");
                                    cmd.Parameters.AddWithValue("@P_USUING", userClaims.UsuNomUsu);
                                    cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                                    cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                                    cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                                    cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                                    cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

                                    pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                                    pDescripcionMensaje.Direction = ParameterDirection.Output;
                                    cmd.Parameters.Add(pDescripcionMensaje);

                                    pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
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
            return (metAnoOut, metCodOut, mensaje, tipoMensaje);
        }

        public (string? message, string? messageType) InsertarMetaIndicador(ClaimsIdentity? identity, MetaIndicador metaIndicador)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

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
                cmd.Parameters.AddWithValue("@P_USUING", userClaims.UsuNomUsu);
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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


        public (string? message, string? messageType) InsertarMetaMonitoreo(ClaimsIdentity? identity, Meta meta, MetaIndicador metaIndicador)
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
                        var resultMeta = InsertarMeta(identity, meta);
                        if (resultMeta.messageType != "3")
                        {
                            throw new Exception(resultMeta.message);
                        }

                        // Actualiza el MetaBeneficiario con los IDs del beneficiario insertado
                        metaIndicador.MetAno = resultMeta.metAnoOut;
                        metaIndicador.MetCod = resultMeta.metCodOut;

                        // Inserta el MetaBeneficiario
                        var resultMetaIndicador = InsertarMetaIndicador(identity, metaIndicador);
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

        public (string? message, string? messageType) InsertarMetaBeneficiarioExiste(ClaimsIdentity? identity, MetaBeneficiario metaBeneficiario)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

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
                cmd.Parameters.AddWithValue("@P_USUING", userClaims.UsuNomUsu);
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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
        public (string? message, string? messageType) InsertarMetaEjecucion(ClaimsIdentity? identity, MetaEjecucion metaEjecucion)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                cn.getcn.Open();
                SqlCommand cmd = new SqlCommand("SP_INSERTAR_META_EJECUCION", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_METANO", metaEjecucion.MetAno);
                cmd.Parameters.AddWithValue("@P_METCOD", metaEjecucion.MetCod);
                cmd.Parameters.AddWithValue("@P_UBIANO", metaEjecucion.UbiAno);
                cmd.Parameters.AddWithValue("@P_UBICOD", metaEjecucion.UbiCod);
                cmd.Parameters.AddWithValue("@P_METEJEVAL", metaEjecucion.MetEjeVal);
                cmd.Parameters.AddWithValue("@P_METEJEMESEJETEC", metaEjecucion.MetEjeMesEjeTec);
                cmd.Parameters.AddWithValue("@P_METEJEANOEJETEC", metaEjecucion.MetEjeAnoEjeTec);
                cmd.Parameters.AddWithValue("@P_USUING", userClaims.UsuNomUsu);
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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

        public (string? message, string? messageType) EliminarBeneficiarioMonitoreo(ClaimsIdentity? identity, MetaBeneficiario metaBeneficiario)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_ELIMINAR_META_BENEFICIARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_METANO", metaBeneficiario.MetAno);
                cmd.Parameters.AddWithValue("@P_METCOD", metaBeneficiario.MetCod);
                cmd.Parameters.AddWithValue("@P_BENANO", metaBeneficiario.BenAno);
                cmd.Parameters.AddWithValue("@P_BENCOD", metaBeneficiario.BenCod);
                cmd.Parameters.AddWithValue("@P_UBIANO", metaBeneficiario.UbiAno);
                cmd.Parameters.AddWithValue("@P_UBICOD", metaBeneficiario.UbiCod);
                cmd.Parameters.AddWithValue("@P_METBENANOEJETEC", metaBeneficiario.MetBenAnoEjeTec);
                cmd.Parameters.AddWithValue("@P_METBENMESEJETEC", metaBeneficiario.MetBenMesEjeTec);
                cmd.Parameters.AddWithValue("@P_USUMOD", userClaims.UsuNomUsu);
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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

        public IEnumerable<Monitoreo> BuscarPaisesHome(ClaimsIdentity? identity, string? tags = null, string? periodoInicio = null, string? periodoFin = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            List<Monitoreo>? temporal = new List<Monitoreo>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_UBICACION_HOME", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@P_TAGS", (tags == "null" ||  string.IsNullOrEmpty(tags)) ? string.Empty : tags);
                cmd.Parameters.AddWithValue("@P_PERINI", (periodoInicio == "null" ||  string.IsNullOrEmpty(periodoInicio)) ? string.Empty : periodoInicio);
                cmd.Parameters.AddWithValue("@P_PERFIN", (periodoFin == "null" ||  string.IsNullOrEmpty(periodoFin)) ? string.Empty : periodoFin);
                cmd.Parameters.AddWithValue("@P_USUANO", userClaims.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD", userClaims.UsuCod);

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

        public IEnumerable<Monitoreo> BuscarEcuadorHome(ClaimsIdentity? identity, string? tags = null, string? periodoInicio = null, string? periodoFin = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            List<Monitoreo>? temporal = new List<Monitoreo>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_UBICACION_HOME_SEGUNDO_NIVEL", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@P_TAGS", (tags == "null" ||  string.IsNullOrEmpty(tags)) ? string.Empty : tags);
                cmd.Parameters.AddWithValue("@P_PERINI", (periodoInicio == "null" ||  string.IsNullOrEmpty(periodoInicio)) ? string.Empty : periodoInicio);
                cmd.Parameters.AddWithValue("@P_PERFIN", (periodoFin == "null" ||  string.IsNullOrEmpty(periodoFin)) ? string.Empty : periodoFin);
                cmd.Parameters.AddWithValue("@P_USUANO", userClaims.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD", userClaims.UsuCod);
                cmd.Parameters.AddWithValue("@P_UBIANOPAD", "2024");
                cmd.Parameters.AddWithValue("@P_UBICODPAD", "000001");

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
        public IEnumerable<Monitoreo> BuscarPeruHome(ClaimsIdentity? identity, string? tags = null, string? periodoInicio = null, string? periodoFin = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            List<Monitoreo>? temporal = new List<Monitoreo>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_UBICACION_HOME_SEGUNDO_NIVEL", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@P_TAGS", (tags == "null" ||  string.IsNullOrEmpty(tags)) ? string.Empty : tags);
                cmd.Parameters.AddWithValue("@P_PERINI", (periodoInicio == "null" ||  string.IsNullOrEmpty(periodoInicio)) ? string.Empty : periodoInicio);
                cmd.Parameters.AddWithValue("@P_PERFIN", (periodoFin == "null" ||  string.IsNullOrEmpty(periodoFin)) ? string.Empty : periodoFin);
                cmd.Parameters.AddWithValue("@P_USUANO", userClaims.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD", userClaims.UsuCod);
                cmd.Parameters.AddWithValue("@P_UBIANOPAD", "2024");
                cmd.Parameters.AddWithValue("@P_UBICODPAD", "000002");

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
        public IEnumerable<Monitoreo> BuscarColombiaHome(ClaimsIdentity? identity, string? tags = null, string? periodoInicio = null, string? periodoFin = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            List<Monitoreo>? temporal = new List<Monitoreo>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_UBICACION_HOME_SEGUNDO_NIVEL", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@P_TAGS", (tags == "null" ||  string.IsNullOrEmpty(tags)) ? string.Empty : tags);
                cmd.Parameters.AddWithValue("@P_PERINI", (periodoInicio == "null" ||  string.IsNullOrEmpty(periodoInicio)) ? string.Empty : periodoInicio);
                cmd.Parameters.AddWithValue("@P_PERFIN", (periodoFin == "null" ||  string.IsNullOrEmpty(periodoFin)) ? string.Empty : periodoFin);
                cmd.Parameters.AddWithValue("@P_USUANO", userClaims.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD", userClaims.UsuCod);
                cmd.Parameters.AddWithValue("@P_UBIANOPAD", "2024");
                cmd.Parameters.AddWithValue("@P_UBICODPAD", "000003");

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


         public IEnumerable<Beneficiario> BuscarMonitoreoForm(ClaimsIdentity? identity, string? metAno = null, string? metCod = null, string? benAno = null, string? benCod = null, string? ubiAno = null, string? ubiCod = null, string? metBenEda = null, string? metBenAnoEjeTec = null, string? metBenMesEjeTec = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

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
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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

        public (string? message, string? messageType) ModificarMetaBeneficiario(ClaimsIdentity? identity, MetaBeneficiario metaBeneficiario)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

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
                cmd.Parameters.AddWithValue("@P_METBENMESEJETEC", metaBeneficiario.MetBenMesEjeTec);
                cmd.Parameters.AddWithValue("@P_METBENANOEJETEC", metaBeneficiario.MetBenAnoEjeTec);
                cmd.Parameters.AddWithValue("@P_METBENEDA", metaBeneficiario.MetBenEda);
                cmd.Parameters.AddWithValue("@P_USUMOD", userClaims.UsuNomUsu);
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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


        public (string? message, string? messageType) ModificarBeneficiarioTransaction(ClaimsIdentity? identity, Beneficiario beneficiario)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

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
                cmd.Parameters.AddWithValue("@P_USUMOD", userClaims.UsuNomUsu);
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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
        public (string? message, string? messageType) ModificarMetaBeneficiarioTransaction(ClaimsIdentity? identity, MetaBeneficiario metaBeneficiario)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

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
                cmd.Parameters.AddWithValue("@P_METBENEDA", metaBeneficiario.MetBenEda);
                cmd.Parameters.AddWithValue("@P_USUMOD", userClaims.UsuNomUsu);
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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

        public (string? message, string? messageType) ModificarBeneficiarioMonitoreo(ClaimsIdentity? identity, Beneficiario beneficiario, MetaBeneficiario metaBeneficiario)
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
                        var resultBeneficiario = ModificarBeneficiarioTransaction(identity, beneficiario);
                        if (resultBeneficiario.messageType != "3")
                        {
                            Console.WriteLine(resultBeneficiario.message);
                            throw new Exception(resultBeneficiario.message);
                        }

                        // Inserta el MetaBeneficiario
                        var resultMetaBeneficiario = ModificarMetaBeneficiarioTransaction(identity, metaBeneficiario);
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

        public IEnumerable<MetaIndicador> BuscarMetaIndicador(ClaimsIdentity? identity, string? metAno = null, string? metCod = null, string? indAno = null, string? indCod = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

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
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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

        public (string? message, string? messageType) EliminarMetaIndicador(ClaimsIdentity? identity, string? metAno = null, string? metCod = null, string? metIndAno = null, string? metIndCod = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);
            
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
                cmd.Parameters.AddWithValue("@P_USUMOD", userClaims.UsuNomUsu);
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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

    }
}