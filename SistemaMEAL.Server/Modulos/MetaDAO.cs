using Microsoft.Data.SqlClient;
using System.Data;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;
using Newtonsoft.Json;
using System.Text;
using System.Transactions;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace SistemaMEAL.Modulos
{
    public class MetaDAO
    {
        private conexionDAO cn = new conexionDAO();

        public IEnumerable<Meta> BuscarMetasPorSubProyecto(ClaimsIdentity? identity, string? subProAno, string? subProCod, string? metAnoPlaTec)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);
            
            List<Meta>? temporal = new List<Meta>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_META_POR_SUB_PROYECTO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                // Aquí puedes agregar los parámetros necesarios para tu procedimiento almacenado
                cmd.Parameters.AddWithValue("@P_SUBPROANO", subProAno);
                cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProCod);
                cmd.Parameters.AddWithValue("@P_METANOPLATEC", metAnoPlaTec);
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
                // Deserializa la cadena JSON en una lista de objetos Meta
                temporal = JsonConvert.DeserializeObject<List<Meta>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<Meta>();
        }

        public (string? message, string? messageType) ActualizarMetas(ClaimsIdentity? identity, List<Meta> metas, List<Meta> metasEliminar)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

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

                        SqlCommand cmd;
                        SqlParameter pDescripcionMensaje;
                        SqlParameter pTipoMensaje;
                        SqlParameter pAno;
                        SqlParameter pCod;

                        if (metas.Count > 0)
                        {
                            foreach (var meta in metas)
                            {
                                if (meta.MetAno.IsNullOrEmpty() && meta.MetCod.IsNullOrEmpty())
                                {
                                    // Insert
                                    cmd = new SqlCommand("SP_INSERTAR_META", cn.getcn);
                                    cmd.CommandType = CommandType.StoredProcedure;

                                    cmd.Parameters.AddWithValue("@P_ESTCOD", "01");
                                    cmd.Parameters.AddWithValue("@P_METMETTEC", meta.MetMetTec);
                                    cmd.Parameters.AddWithValue("@P_METEJETEC", "0");
                                    cmd.Parameters.AddWithValue("@P_METPORAVATEC", "00.00");
                                    cmd.Parameters.AddWithValue("@P_METMESPLATEC", meta.MetMesPlaTec);
                                    cmd.Parameters.AddWithValue("@P_METANOPLATEC", meta.MetAnoPlaTec);
                                    cmd.Parameters.AddWithValue("@P_METMETPRE", "");
                                    cmd.Parameters.AddWithValue("@P_METEJEPRE", "");
                                    cmd.Parameters.AddWithValue("@P_METPORAVAPRE", "");
                                    cmd.Parameters.AddWithValue("@P_METMESPLAPRE", "");
                                    cmd.Parameters.AddWithValue("@P_METANOPLAPRE", "");
                                    cmd.Parameters.AddWithValue("@P_IMPCOD", meta.ImpCod);
                                    cmd.Parameters.AddWithValue("@P_UBIANO", meta.UbiAno);
                                    cmd.Parameters.AddWithValue("@P_UBICOD", meta.UbiCod);
                                    cmd.Parameters.AddWithValue("@P_INDANO", meta.IndAno);
                                    cmd.Parameters.AddWithValue("@P_INDCOD", meta.IndCod);
                                    cmd.Parameters.AddWithValue("@P_USUANO", meta.UsuAno);
                                    cmd.Parameters.AddWithValue("@P_USUCOD", meta.UsuCod);
                                    cmd.Parameters.AddWithValue("@P_FINCOD", "00");
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

                                    pAno = new SqlParameter("@P_METANO_OUT", SqlDbType.NVarChar, 4);
                                    pAno.Direction = ParameterDirection.Output;
                                    cmd.Parameters.Add(pAno);

                                    pCod = new SqlParameter("@P_METCOD_OUT", SqlDbType.Char, 6);
                                    pCod.Direction = ParameterDirection.Output;
                                    cmd.Parameters.Add(pCod);

                                    cmd.ExecuteNonQuery();

                                    var metAno = pAno.Value.ToString();
                                    var metCod = pCod.Value.ToString();
                                    mensaje = pDescripcionMensaje.Value.ToString();
                                    tipoMensaje = pTipoMensaje.Value.ToString();

                                    // Inserta el beneficiario
                                    if (tipoMensaje != "3")
                                    {
                                        Console.WriteLine(mensaje);
                                        throw new Exception(mensaje);
                                    }

                                    cmd = new SqlCommand("SP_BUSCAR_INDICADOR", cn.getcn);
                                    cmd.CommandType = CommandType.StoredProcedure;

                                    cmd.Parameters.AddWithValue("@P_INDANO", meta.IndAno);
                                    cmd.Parameters.AddWithValue("@P_INDCOD", meta.IndCod);
                                    cmd.Parameters.AddWithValue("@P_SUBPROANO", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_SUBPROCOD", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_ACTANO", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_ACTCOD", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_INDNOM", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_INDNUM", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_INDTIPIND", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_UNICOD", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_TIPVALCOD", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_INDTOTPRE", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_MONCOD", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_INDLINBAS", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_INDFOR", (object)DBNull.Value);
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
                                    List<Indicador>? temporal = JsonConvert.DeserializeObject<List<Indicador>>(jsonResult.ToString());
                                    
                                    Indicador indicadorConsulta = temporal[0];

                                    var accPad = "PROYECTO-" + indicadorConsulta.ProAno + "-" + indicadorConsulta.ProCod + "-SUB_PROYECTO-" + indicadorConsulta.SubProAno + "-" + indicadorConsulta.SubProCod + "-OBJETIVO-" + indicadorConsulta.ObjAno + "-" + indicadorConsulta.ObjCod + "-OBJETIVO_ESPECIFICO-" + indicadorConsulta.ObjEspAno + "-" + indicadorConsulta.ObjEspCod + "-RESULTADO-" + indicadorConsulta.ResAno + "-" + indicadorConsulta.ResCod + "-ACTIVIDAD-" + indicadorConsulta.ActAno + "-" + indicadorConsulta.ActCod + "-INDICADOR-" + indicadorConsulta.IndAno + "-" + indicadorConsulta.IndCod + "-META-" + metAno + "-" + metCod;

                                    cmd = new SqlCommand("SP_INSERTAR_USUARIO_ACCESO", cn.getcn);
                                    cmd.CommandType = CommandType.StoredProcedure;

                                    cmd.Parameters.AddWithValue("@P_USUANO", meta.UsuAno);
                                    cmd.Parameters.AddWithValue("@P_USUCOD", meta.UsuCod);
                                    cmd.Parameters.AddWithValue("@P_USUACCTIP", "META");
                                    cmd.Parameters.AddWithValue("@P_USUACCANO", metAno);
                                    cmd.Parameters.AddWithValue("@P_USUACCCOD", metCod);
                                    cmd.Parameters.AddWithValue("@P_USUACCPAD", accPad);
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

                                    cmd = new SqlCommand("SP_INSERTAR_USUARIO_ACCESO", cn.getcn);
                                    cmd.CommandType = CommandType.StoredProcedure;

                                    cmd.Parameters.AddWithValue("@P_USUANO", userClaims.UsuAno);
                                    cmd.Parameters.AddWithValue("@P_USUCOD", userClaims.UsuCod);
                                    cmd.Parameters.AddWithValue("@P_USUACCTIP", "META");
                                    cmd.Parameters.AddWithValue("@P_USUACCANO", metAno);
                                    cmd.Parameters.AddWithValue("@P_USUACCCOD", metCod);
                                    cmd.Parameters.AddWithValue("@P_USUACCPAD", accPad);
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
                                } else {
                                    // Update
                                    cmd = new SqlCommand("SP_MODIFICAR_META_CADENA", cn.getcn);
                                    cmd.CommandType = CommandType.StoredProcedure;

                                    cmd.Parameters.AddWithValue("@P_METANO", meta.MetAno);
                                    cmd.Parameters.AddWithValue("@P_METCOD", meta.MetCod);
                                    cmd.Parameters.AddWithValue("@P_METMETTEC", meta.MetMetTec);
                                    cmd.Parameters.AddWithValue("@P_IMPCOD", meta.ImpCod);
                                    cmd.Parameters.AddWithValue("@P_UBIANO", meta.UbiAno);
                                    cmd.Parameters.AddWithValue("@P_UBICOD", meta.UbiCod);
                                    cmd.Parameters.AddWithValue("@P_INDANO", meta.IndAno);
                                    cmd.Parameters.AddWithValue("@P_INDCOD", meta.IndCod);
                                    cmd.Parameters.AddWithValue("@P_USUANO", meta.UsuAno);
                                    cmd.Parameters.AddWithValue("@P_USUCOD", meta.UsuCod);
                                    cmd.Parameters.AddWithValue("@P_METANOPLATEC", meta.MetAnoPlaTec);
                                    cmd.Parameters.AddWithValue("@P_METMESPLATEC", meta.MetMesPlaTec);
                                    cmd.Parameters.AddWithValue("@P_USUMOD", userClaims.UsuNomUsu);
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

                                    // Inserta el beneficiario
                                    if (tipoMensaje != "3")
                                    {
                                        Console.WriteLine(mensaje);
                                        throw new Exception(mensaje);
                                    }
                                }
                            }
                        }
                        
                        if (metasEliminar.Count > 0)
                        {
                            foreach (var meta in metasEliminar)
                            {
                                cmd = new SqlCommand("SP_ELIMINAR_USUARIO_ACCESO", cn.getcn);
                                    cmd.CommandType = CommandType.StoredProcedure;

                                    cmd.Parameters.AddWithValue("@P_USUANO", userClaims.UsuAno);
                                    cmd.Parameters.AddWithValue("@P_USUCOD", userClaims.UsuCod);
                                    cmd.Parameters.AddWithValue("@P_USUACCTIP", "META");
                                    cmd.Parameters.AddWithValue("@P_USUACCANO", meta.MetAno);
                                    cmd.Parameters.AddWithValue("@P_USUACCCOD", meta.MetCod);
                                    cmd.Parameters.AddWithValue("@P_USUMOD", userClaims.UsuNomUsu);
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

                                cmd = new SqlCommand("SP_ELIMINAR_USUARIO_ACCESO", cn.getcn);
                                    cmd.CommandType = CommandType.StoredProcedure;

                                    cmd.Parameters.AddWithValue("@P_USUANO", meta.UsuAno);
                                    cmd.Parameters.AddWithValue("@P_USUCOD", meta.UsuCod);
                                    cmd.Parameters.AddWithValue("@P_USUACCTIP", "META");
                                    cmd.Parameters.AddWithValue("@P_USUACCANO", meta.MetAno);
                                    cmd.Parameters.AddWithValue("@P_USUACCCOD", meta.MetCod);
                                    cmd.Parameters.AddWithValue("@P_USUMOD", userClaims.UsuNomUsu);
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
                                // Delete
                                cmd = new SqlCommand("SP_ELIMINAR_META", cn.getcn);
                                    cmd.CommandType = CommandType.StoredProcedure;

                                    cmd.Parameters.AddWithValue("@P_METANO", meta.MetAno);
                                    cmd.Parameters.AddWithValue("@P_METCOD", meta.MetCod);
                                    cmd.Parameters.AddWithValue("@P_USUMOD", userClaims.UsuNomUsu);
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

                                    // Inserta el beneficiario
                                    if (tipoMensaje != "3")
                                    {
                                        Console.WriteLine(mensaje);
                                        throw new Exception(mensaje);
                                    }
                            }
                        }

                        mensaje = "Registros actualizados correctamente.";
                        tipoMensaje = "3";
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
        public (string? message, string? messageType) InsertarMetaUsuario(ClaimsIdentity? identity, List<MetaUsuario> metasInsertar,List<MetaUsuario> metasEliminar)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

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

                        SqlCommand cmd;
                        SqlParameter pDescripcionMensaje;
                        SqlParameter pTipoMensaje;

                        DataTable dtAccesosUsuarioInsertar = new DataTable();
                        dtAccesosUsuarioInsertar.Columns.Add("USUACCTIP", typeof(string));
                        dtAccesosUsuarioInsertar.Columns.Add("USUACCANO", typeof(string));
                        dtAccesosUsuarioInsertar.Columns.Add("USUACCCOD", typeof(string));
                        dtAccesosUsuarioInsertar.Columns.Add("USUACCPAD", typeof(string));

                        if (metasInsertar.Count > 0)
                        {
                            foreach (var meta in metasInsertar)
                            {
                                dtAccesosUsuarioInsertar.Rows.Add("META",meta.MetAno,meta.MetCod,"");
                            }

                            cmd = new SqlCommand("SP_INSERTAR_USUARIO_ACCESO_MASIVO", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            SqlParameter param = new SqlParameter();
                            param.ParameterName = "@UsuarioAcceso";
                            param.SqlDbType = SqlDbType.Structured;
                            param.Value = dtAccesosUsuarioInsertar;
                            param.TypeName = "UsuarioAccesoType";

                            cmd.Parameters.Add(param);
                            cmd.Parameters.AddWithValue("@P_USUANO", metasInsertar[0].UsuAno);
                            cmd.Parameters.AddWithValue("@P_USUCOD", metasInsertar[0].UsuCod);
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

                            if (tipoMensaje != "3")
                            {
                                Console.WriteLine(mensaje);
                                throw new Exception(mensaje);
                            }
                        }

                        DataTable dtAccesosUsuarioEliminar = new DataTable();
                        dtAccesosUsuarioEliminar.Columns.Add("USUACCTIP", typeof(string));
                        dtAccesosUsuarioEliminar.Columns.Add("USUACCANO", typeof(string));
                        dtAccesosUsuarioEliminar.Columns.Add("USUACCCOD", typeof(string));
                        dtAccesosUsuarioEliminar.Columns.Add("USUACCPAD", typeof(string));
                        
                        if (metasEliminar.Count > 0)
                        {
                            foreach (var meta in metasEliminar)
                            {
                                dtAccesosUsuarioEliminar.Rows.Add("META",meta.MetAno,meta.MetCod);
                            }

                            cmd = new SqlCommand("SP_ELIMINAR_USUARIO_ACCESO_MASIVO", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            SqlParameter param = new SqlParameter();
                            param.ParameterName = "@UsuarioAcceso";
                            param.SqlDbType = SqlDbType.Structured;
                            param.Value = dtAccesosUsuarioEliminar;
                            param.TypeName = "UsuarioAccesoType";

                            cmd.Parameters.Add(param);
                            cmd.Parameters.AddWithValue("@P_USUANO", metasEliminar[0].UsuAno);
                            cmd.Parameters.AddWithValue("@P_USUCOD", metasEliminar[0].UsuCod);
                            cmd.Parameters.AddWithValue("@P_USUMOD", userClaims.UsuNomUsu);
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

                            if (tipoMensaje != "3")
                            {
                                Console.WriteLine(mensaje);
                                throw new Exception(mensaje);
                            }
                        }
                        

                        mensaje = "Accesos actualizados correctamente.";
                        tipoMensaje = "3";
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

        public (string? message, string? messageType) ActualizarMetasPresupuesto(ClaimsIdentity? identity, List<Meta> metas)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

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

                        SqlCommand cmd;
                        SqlParameter pDescripcionMensaje;
                        SqlParameter pTipoMensaje;
                        SqlParameter pAno;
                        SqlParameter pCod;

                        if (metas.Count > 0)
                        {
                            foreach (var meta in metas)
                            {
                                if (meta.MetAno.IsNullOrEmpty() && meta.MetCod.IsNullOrEmpty())
                                {
                                    // Insertar Nueva Meta con Presupuesto
                                    cmd = new SqlCommand("SP_INSERTAR_META", cn.getcn);
                                    cmd.CommandType = CommandType.StoredProcedure;

                                    cmd.Parameters.AddWithValue("@P_ESTCOD", "01");
                                    cmd.Parameters.AddWithValue("@P_METMETTEC", "");
                                    cmd.Parameters.AddWithValue("@P_METEJETEC", "");
                                    cmd.Parameters.AddWithValue("@P_METPORAVATEC", "");
                                    cmd.Parameters.AddWithValue("@P_METMESPLATEC", meta.MetMesPlaTec);
                                    cmd.Parameters.AddWithValue("@P_METANOPLATEC", meta.MetAnoPlaTec);
                                    cmd.Parameters.AddWithValue("@P_METMETPRE", meta.MetMetPre);
                                    cmd.Parameters.AddWithValue("@P_METEJEPRE", "");
                                    cmd.Parameters.AddWithValue("@P_METPORAVAPRE", "");
                                    cmd.Parameters.AddWithValue("@P_METMESPLAPRE", "");
                                    cmd.Parameters.AddWithValue("@P_METANOPLAPRE", "");
                                    cmd.Parameters.AddWithValue("@P_IMPCOD", meta.ImpCod);
                                    cmd.Parameters.AddWithValue("@P_UBIANO", meta.UbiAno);
                                    cmd.Parameters.AddWithValue("@P_UBICOD", meta.UbiCod);
                                    cmd.Parameters.AddWithValue("@P_INDANO", meta.IndAno);
                                    cmd.Parameters.AddWithValue("@P_INDCOD", meta.IndCod);
                                    cmd.Parameters.AddWithValue("@P_USUANO", meta.UsuAno);
                                    cmd.Parameters.AddWithValue("@P_USUCOD", meta.UsuCod);
                                    cmd.Parameters.AddWithValue("@P_FINCOD", meta.FinCod);
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

                                    pAno = new SqlParameter("@P_METANO_OUT", SqlDbType.NVarChar, 4);
                                    pAno.Direction = ParameterDirection.Output;
                                    cmd.Parameters.Add(pAno);

                                    pCod = new SqlParameter("@P_METCOD_OUT", SqlDbType.Char, 6);
                                    pCod.Direction = ParameterDirection.Output;
                                    cmd.Parameters.Add(pCod);

                                    cmd.ExecuteNonQuery();

                                    var metAno = pAno.Value.ToString();
                                    var metCod = pCod.Value.ToString();
                                    mensaje = pDescripcionMensaje.Value.ToString();
                                    tipoMensaje = pTipoMensaje.Value.ToString();

                                    // Inserta el beneficiario
                                    if (tipoMensaje != "3")
                                    {
                                        Console.WriteLine(mensaje);
                                        throw new Exception(mensaje);
                                    }

                                    cmd = new SqlCommand("SP_BUSCAR_META", cn.getcn);
                                    cmd.CommandType = CommandType.StoredProcedure;
                                    // Aquí puedes agregar los parámetros necesarios para tu procedimiento almacenado
                                    cmd.Parameters.AddWithValue("@P_METANO", metAno);
                                    cmd.Parameters.AddWithValue("@P_METCOD", metCod);
                                    cmd.Parameters.AddWithValue("@P_ESTCOD", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_METMETTEC", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_METEJETEC", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_METPORAVATEC", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_METMETPRE", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_METEJEPRE", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_METPORAVAPRE", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_METMESPLATEC", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_METANOPLATEC", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_METMESPLAPRE", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_METANOPLAPRE", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_METESTPRE", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_IMPCOD", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_UBIANO", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_UBICOD", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_INDANO", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_INDCOD", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_USUANO", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_USUCOD", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_FINCOD", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_SUBPROANO", (object)DBNull.Value);
                                    cmd.Parameters.AddWithValue("@P_SUBPROCOD", (object)DBNull.Value);
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
                                    List<Meta>? temporal = JsonConvert.DeserializeObject<List<Meta>>(jsonResult.ToString());
                                    
                                    Meta metaConsulta = temporal[0];

                                    var accPad = "PROYECTO-" + metaConsulta.ProAno + "-" + metaConsulta.ProCod + "-SUB_PROYECTO-" + metaConsulta.SubProAno + "-" + metaConsulta.SubProCod + "-OBJETIVO-" + metaConsulta.ObjAno + "-" + metaConsulta.ObjCod + "-OBJETIVO_ESPECIFICO-" + metaConsulta.ObjEspAno + "-" + metaConsulta.ObjEspCod + "-RESULTADO-" + metaConsulta.ResAno + "-" + metaConsulta.ResCod + "-ACTIVIDAD-" + metaConsulta.ActAno + "-" + metaConsulta.ActCod + "-INDICADOR-" + metaConsulta.IndAno + "-" + metaConsulta.IndCod + "-META-" + metAno + "-" + metCod;

                                    cmd = new SqlCommand("SP_INSERTAR_USUARIO_ACCESO", cn.getcn);
                                    cmd.CommandType = CommandType.StoredProcedure;

                                    cmd.Parameters.AddWithValue("@P_USUANO", userClaims.UsuAno);
                                    cmd.Parameters.AddWithValue("@P_USUCOD", userClaims.UsuCod);
                                    cmd.Parameters.AddWithValue("@P_USUACCTIP", "META");
                                    cmd.Parameters.AddWithValue("@P_USUACCANO", metAno);
                                    cmd.Parameters.AddWithValue("@P_USUACCCOD", metCod);
                                    cmd.Parameters.AddWithValue("@P_USUACCPAD", accPad);
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
                                } else {
                                    // Modificar Presupuesto de la Meta
                                    cmd = new SqlCommand("SP_MODIFICAR_META_PRESUPUESTO", cn.getcn);
                                    cmd.CommandType = CommandType.StoredProcedure;

                                    cmd.Parameters.AddWithValue("@P_METANO", meta.MetAno);
                                    cmd.Parameters.AddWithValue("@P_METCOD", meta.MetCod);
                                    cmd.Parameters.AddWithValue("@P_FINCOD", meta.FinCod);
                                    cmd.Parameters.AddWithValue("@P_METMETPRE", meta.MetMetPre);
                                    cmd.Parameters.AddWithValue("@P_USUMOD", userClaims.UsuNomUsu);
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

                                    // Inserta el beneficiario
                                    if (tipoMensaje != "3")
                                    {
                                        Console.WriteLine(mensaje);
                                        throw new Exception(mensaje);
                                    }
                                }
                            }
                        }
                        
                        mensaje = "Registros actualizados correctamente.";
                        tipoMensaje = "3";
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

        public (string? message, string? messageType) ActualizarEjecucionPresupuesto(ClaimsIdentity? identity, List<Meta> metas)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

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

                        SqlCommand cmd;
                        SqlParameter pDescripcionMensaje;
                        SqlParameter pTipoMensaje;

                        if (metas.Count > 0)
                        {
                            foreach (var meta in metas)
                            {
                                if (!meta.MetAno.IsNullOrEmpty() && !meta.MetCod.IsNullOrEmpty())
                                {
                                    // Insert
                                    cmd = new SqlCommand("SP_MODIFICAR_META_EJECUCION_PRESUPUESTO", cn.getcn);
                                    cmd.CommandType = CommandType.StoredProcedure;

                                    cmd.Parameters.AddWithValue("@P_METANO", meta.MetAno);
                                    cmd.Parameters.AddWithValue("@P_METCOD", meta.MetCod);
                                    cmd.Parameters.AddWithValue("@P_METEJEPRE", meta.MetEjePre);
                                    cmd.Parameters.AddWithValue("@P_USUMOD", userClaims.UsuNomUsu);
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

                                    // Inserta el beneficiario
                                    if (tipoMensaje != "3")
                                    {
                                        Console.WriteLine(mensaje);
                                        throw new Exception(mensaje);
                                    }
                                }
                            }
                        }
                        
                        mensaje = "Registros actualizados correctamente.";
                        tipoMensaje = "3";
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

        public async Task<(string? message, string? messageType)> SubirArchivo(MetaFuente metaFuente, FileData fileData, string uploadsDirectory)
        {
            // var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";

            try
            {
                cn.getcn.Open();

                // Aquí tienes los datos del archivo
                var data = fileData.Data;
                var fileName = metaFuente.SubProSap  + "_" + metaFuente.ResNum + "_" + metaFuente.IndNum + "_" + fileData.FileName;
                var fileSize = fileData.FileSize;

                System.IO.Directory.CreateDirectory(uploadsDirectory); // Crea el directorio si no existe

                var path = Path.Combine(uploadsDirectory, fileName);
                await System.IO.File.WriteAllBytesAsync(path, Convert.FromBase64String(data));

                SqlCommand cmd = new SqlCommand("SP_INSERTAR_META_FUENTE_VERIFICACION", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_METANO", metaFuente.MetAno);
                cmd.Parameters.AddWithValue("@P_METCOD", metaFuente.MetCod);
                cmd.Parameters.AddWithValue("@P_METFUEVERNOM", fileName);
                cmd.Parameters.AddWithValue("@P_METFUEVERPES", fileSize);
                cmd.Parameters.AddWithValue("@P_USUING", "asd");
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "asd");
                cmd.Parameters.AddWithValue("@P_USUANO_U", "asd");
                cmd.Parameters.AddWithValue("@P_USUCOD_U", "asd");
                cmd.Parameters.AddWithValue("@P_USUNOM_U", "asd");
                cmd.Parameters.AddWithValue("@P_USUAPE_U", "asd");

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

        public async Task<(string? message, string? messageType)> EliminarArchivo(MetaFuente metaFuente, FileData fileData, string uploadsDirectory)
        {
            // var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";

            try
            {
                cn.getcn.Open();

                // Aquí tienes los datos del archivo
                var data = fileData.Data;
                var fileName = metaFuente.SubProSap  + "_" + metaFuente.ResNum + "_" + metaFuente.IndNum + "_" + fileData.FileName;
                var fileSize = fileData.FileSize;

                var path = Path.Combine(uploadsDirectory, fileData.FileName);

                if (System.IO.File.Exists(path))
                {
                    System.IO.File.Delete(path);
                }
                else
                {
                    throw new Exception("Archivo no encontrado" );
                }

                SqlCommand cmd = new SqlCommand("SP_ELIMINAR_META_FUENTE_VERIFICACION", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_METANO", metaFuente.MetAno);
                cmd.Parameters.AddWithValue("@P_METCOD", metaFuente.MetCod);
                cmd.Parameters.AddWithValue("@P_METFUEVERNOM", fileData.FileName);
                cmd.Parameters.AddWithValue("@P_USUMOD", "asd");
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "asd");
                cmd.Parameters.AddWithValue("@P_USUANO_U", "asd");
                cmd.Parameters.AddWithValue("@P_USUCOD_U", "asd");
                cmd.Parameters.AddWithValue("@P_USUNOM_U", "asd");
                cmd.Parameters.AddWithValue("@P_USUAPE_U", "asd");

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

        public IEnumerable<MetaFuente> BuscarArchivosPorMeta(ClaimsIdentity? identity, string? metAno, string? metCod, string? metFueVerNom = null, string? metFueVerPes = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);
            
            List<MetaFuente>? temporal = new List<MetaFuente>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_META_FUENTE_VERIFICACION", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                // Aquí puedes agregar los parámetros necesarios para tu procedimiento almacenado
                cmd.Parameters.AddWithValue("@P_METANO", metAno);
                cmd.Parameters.AddWithValue("@P_METCOD", metCod);
                cmd.Parameters.AddWithValue("@P_METFUEVERNOM", string.IsNullOrEmpty(metFueVerNom) ? (object)DBNull.Value : metFueVerNom);
                cmd.Parameters.AddWithValue("@P_METFUEVERPES", string.IsNullOrEmpty(metFueVerPes) ? (object)DBNull.Value : metFueVerPes);
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
                // Deserializa la cadena JSON en una lista de objetos MetaFuente
                temporal = JsonConvert.DeserializeObject<List<MetaFuente>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<MetaFuente>();
        }

        public IEnumerable<MetaUsuario> BuscarMetasUsuario(ClaimsIdentity? identity, string? usuAno, string? usuCod, string? metAno = null, string? metCod = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);
            
            List<MetaUsuario>? temporal = new List<MetaUsuario>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_META_USUARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                // Aquí puedes agregar los parámetros necesarios para tu procedimiento almacenado
                cmd.Parameters.AddWithValue("@P_USUANO", usuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD", usuCod);
                cmd.Parameters.AddWithValue("@P_METANO", string.IsNullOrEmpty(metAno) ? (object)DBNull.Value : metAno);
                cmd.Parameters.AddWithValue("@P_METCOD", string.IsNullOrEmpty(metCod) ? (object)DBNull.Value : metCod);
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
                // Deserializa la cadena JSON en una lista de objetos MetaUsuario
                temporal = JsonConvert.DeserializeObject<List<MetaUsuario>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<MetaUsuario>();
        }

        public IEnumerable<Meta> Buscar(ClaimsIdentity? identity, string? metAno = null, string? metCod = null, string? estCod = null, string? metMetTec = null, string? metEjeTec = null, string? metPorAvaTec = null, string? metMetPre = null, string? metEjePre = null, string? metPorAvaPre = null, string? metMesPlaTec = null, string? metAnoPlaTec = null, string? metMesPlaPre = null, string? metAnoPlaPre = null, string? metEstPre = null, string? impCod = null, string? ubiAno = null, string? ubiCod = null, string? indAno = null, string? indCod = null, string? usuAno = null, string? usuCod = null, string? finCod = null, string? subProAno = null, string? subProCod = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            List<Meta>? temporal = new List<Meta>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_META", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                // Aquí puedes agregar los parámetros necesarios para tu procedimiento almacenado
                cmd.Parameters.AddWithValue("@P_METANO", string.IsNullOrEmpty(metAno) ? (object)DBNull.Value : metAno);
                cmd.Parameters.AddWithValue("@P_METCOD", string.IsNullOrEmpty(metCod) ? (object)DBNull.Value : metCod);
                cmd.Parameters.AddWithValue("@P_ESTCOD", string.IsNullOrEmpty(estCod) ? (object)DBNull.Value : estCod);
                cmd.Parameters.AddWithValue("@P_METMETTEC", string.IsNullOrEmpty(metMetTec) ? (object)DBNull.Value : metMetTec);
                cmd.Parameters.AddWithValue("@P_METEJETEC", string.IsNullOrEmpty(metEjeTec) ? (object)DBNull.Value : metEjeTec);
                cmd.Parameters.AddWithValue("@P_METPORAVATEC", string.IsNullOrEmpty(metPorAvaTec) ? (object)DBNull.Value : metPorAvaTec);
                cmd.Parameters.AddWithValue("@P_METMETPRE", string.IsNullOrEmpty(metMetPre) ? (object)DBNull.Value : metMetPre);
                cmd.Parameters.AddWithValue("@P_METEJEPRE", string.IsNullOrEmpty(metEjePre) ? (object)DBNull.Value : metEjePre);
                cmd.Parameters.AddWithValue("@P_METPORAVAPRE", string.IsNullOrEmpty(metPorAvaPre) ? (object)DBNull.Value : metPorAvaPre);
                cmd.Parameters.AddWithValue("@P_METMESPLATEC", string.IsNullOrEmpty(metMesPlaTec) ? (object)DBNull.Value : metMesPlaTec);
                cmd.Parameters.AddWithValue("@P_METANOPLATEC", string.IsNullOrEmpty(metAnoPlaTec) ? (object)DBNull.Value : metAnoPlaTec);
                cmd.Parameters.AddWithValue("@P_METMESPLAPRE", string.IsNullOrEmpty(metMesPlaPre) ? (object)DBNull.Value : metMesPlaPre);
                cmd.Parameters.AddWithValue("@P_METANOPLAPRE", string.IsNullOrEmpty(metAnoPlaPre) ? (object)DBNull.Value : metAnoPlaPre);
                cmd.Parameters.AddWithValue("@P_METESTPRE", string.IsNullOrEmpty(metEstPre) ? (object)DBNull.Value : metEstPre);
                cmd.Parameters.AddWithValue("@P_IMPCOD", string.IsNullOrEmpty(impCod) ? (object)DBNull.Value : impCod);
                cmd.Parameters.AddWithValue("@P_UBIANO", string.IsNullOrEmpty(ubiAno) ? (object)DBNull.Value : ubiAno);
                cmd.Parameters.AddWithValue("@P_UBICOD", string.IsNullOrEmpty(ubiCod) ? (object)DBNull.Value : ubiCod);
                cmd.Parameters.AddWithValue("@P_INDANO", string.IsNullOrEmpty(indAno) ? (object)DBNull.Value : indAno);
                cmd.Parameters.AddWithValue("@P_INDCOD", string.IsNullOrEmpty(indCod) ? (object)DBNull.Value : indCod);
                cmd.Parameters.AddWithValue("@P_USUANO", string.IsNullOrEmpty(usuAno) ? (object)DBNull.Value : usuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD", string.IsNullOrEmpty(usuCod) ? (object)DBNull.Value : usuCod);
                cmd.Parameters.AddWithValue("@P_FINCOD", string.IsNullOrEmpty(finCod) ? (object)DBNull.Value : finCod);
                cmd.Parameters.AddWithValue("@P_SUBPROANO", string.IsNullOrEmpty(subProAno) ? (object)DBNull.Value : subProAno);
                cmd.Parameters.AddWithValue("@P_SUBPROCOD", string.IsNullOrEmpty(subProCod) ? (object)DBNull.Value : subProCod);
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
                temporal = JsonConvert.DeserializeObject<List<Meta>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<Meta>();
        }


        public IEnumerable<MetaEjecucion> BuscarMetaEjecucion(ClaimsIdentity? identity, string? metAno = null, string? metCod = null, string? metEjeVal = null, string? ubiAno = null, string? ubiCod = null, string? metEjeAnoEjeTec = null, string? metEjeMesEjeTec = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            List<MetaEjecucion>? temporal = new List<MetaEjecucion>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_META_EJECUCION", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                // Aquí puedes agregar los parámetros necesarios para tu procedimiento almacenado
                cmd.Parameters.AddWithValue("@P_METANO", string.IsNullOrEmpty(metAno) ? (object)DBNull.Value : metAno);
                cmd.Parameters.AddWithValue("@P_METCOD", string.IsNullOrEmpty(metCod) ? (object)DBNull.Value : metCod);
                cmd.Parameters.AddWithValue("@P_UBIANO", string.IsNullOrEmpty(ubiAno) ? (object)DBNull.Value : ubiAno);
                cmd.Parameters.AddWithValue("@P_UBICOD", string.IsNullOrEmpty(ubiCod) ? (object)DBNull.Value : ubiCod);
                cmd.Parameters.AddWithValue("@P_METEJEVAL", string.IsNullOrEmpty(metEjeVal) ? (object)DBNull.Value : metEjeVal);
                cmd.Parameters.AddWithValue("@P_METEJEMESEJETEC", string.IsNullOrEmpty(metEjeAnoEjeTec) ? (object)DBNull.Value : metEjeAnoEjeTec);
                cmd.Parameters.AddWithValue("@P_METEJEANOEJETEC", string.IsNullOrEmpty(metEjeMesEjeTec) ? (object)DBNull.Value : metEjeMesEjeTec);
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
                temporal = JsonConvert.DeserializeObject<List<MetaEjecucion>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<MetaEjecucion>();
        }


    }
}