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
                                Console.WriteLine(meta.MetAno.IsNullOrEmpty());
                                Console.WriteLine(meta.MetCod.IsNullOrEmpty());
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
    }
}