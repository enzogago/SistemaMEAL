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
    public class SubProyectoDAO
    {
        private conexionDAO cn = new conexionDAO();

        public IEnumerable<SubProyecto> Buscar(ClaimsIdentity? identity, string? subProAno = null, string? subProCod = null,string? proAno = null, string? proCod = null, string? subProNom = null, string? subProSap = null, string? subProRes = null, string? subProPerAnoIni = null, string? subProPerMesIni = null, string? subProPerAnoFin = null, string? subProPerMesFin = null, string? subProInvSubAct = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            List<SubProyecto>? temporal = new List<SubProyecto>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_SUB_PROYECTO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_SUBPROANO", string.IsNullOrEmpty(subProAno) ? (object)DBNull.Value : subProAno);
                cmd.Parameters.AddWithValue("@P_SUBPROCOD", string.IsNullOrEmpty(subProCod) ? (object)DBNull.Value : subProCod);
                cmd.Parameters.AddWithValue("@P_PROANO", string.IsNullOrEmpty(proAno) ? (object)DBNull.Value : proAno);
                cmd.Parameters.AddWithValue("@P_PROCOD", string.IsNullOrEmpty(proCod) ? (object)DBNull.Value : proCod);
                cmd.Parameters.AddWithValue("@P_SUBPRONOM", string.IsNullOrEmpty(subProNom) ? (object)DBNull.Value : subProNom);
                cmd.Parameters.AddWithValue("@P_SUBPROSAP", string.IsNullOrEmpty(subProSap) ? (object)DBNull.Value : subProSap);
                cmd.Parameters.AddWithValue("@P_SUBPROINVSUBACT", string.IsNullOrEmpty(subProInvSubAct) ? (object)DBNull.Value : subProInvSubAct);
                cmd.Parameters.AddWithValue("@P_SUBPRORES", string.IsNullOrEmpty(subProRes) ? (object)DBNull.Value : subProRes);
                cmd.Parameters.AddWithValue("@P_SUBPROPERANOINI", string.IsNullOrEmpty(subProPerAnoIni) ? (object)DBNull.Value : subProPerAnoIni);
                cmd.Parameters.AddWithValue("@P_SUBPROPERMESINI", string.IsNullOrEmpty(subProPerMesIni) ? (object)DBNull.Value : subProPerMesIni);
                cmd.Parameters.AddWithValue("@P_SUBPROPERANOFIN", string.IsNullOrEmpty(subProPerAnoFin) ? (object)DBNull.Value : subProPerAnoFin);
                cmd.Parameters.AddWithValue("@P_SUBPROPERMESFIN", string.IsNullOrEmpty(subProPerMesFin) ? (object)DBNull.Value : subProPerMesFin);
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
                // Deserializa la cadena JSON en una lista de objetos Estado
                temporal = JsonConvert.DeserializeObject<List<SubProyecto>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<SubProyecto>();
        }

        public (string? anoOut,string? codOut,string? message, string? messageType) Insertar(ClaimsIdentity? identity, SubProyecto subProyecto)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";
            string? anoOut = "";
            string? codOut = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_INSERTAR_SUB_PROYECTO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_PROANO", subProyecto.ProAno);
                cmd.Parameters.AddWithValue("@P_PROCOD", subProyecto.ProCod);
                cmd.Parameters.AddWithValue("@P_SUBPRONOM", subProyecto.SubProNom);
                cmd.Parameters.AddWithValue("@P_SUBPROSAP", subProyecto.SubProSap);
                cmd.Parameters.AddWithValue("@P_SUBPRORES", subProyecto.SubProRes);
                cmd.Parameters.AddWithValue("@P_SUBPROPERANOINI", subProyecto.SubProPerAnoIni);
                cmd.Parameters.AddWithValue("@P_SUBPROPERMESINI", subProyecto.SubProPerMesIni);
                cmd.Parameters.AddWithValue("@P_SUBPROPERANOFIN", subProyecto.SubProPerAnoFin);
                cmd.Parameters.AddWithValue("@P_SUBPROPERMESFIN", subProyecto.SubProPerMesFin);
                cmd.Parameters.AddWithValue("@P_SUBPROINVSUBACT", subProyecto.SubProInvSubAct);
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

                SqlParameter pAno = new SqlParameter("@P_SUBPROANO_OUT", SqlDbType.NVarChar, 4);
                pAno.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pAno);

                SqlParameter pCod = new SqlParameter("@P_SUBPROCOD_OUT", SqlDbType.Char, 6);
                pCod.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pCod);

                cmd.ExecuteNonQuery();

                anoOut = pAno.Value.ToString();
                codOut = pCod.Value.ToString();
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
            return (anoOut, codOut, mensaje, tipoMensaje);
        }

        // public (string? message, string? messageType) Modificar(ClaimsIdentity? identity, SubProyecto subProyecto)
        // {
        //     var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

        //     string? mensaje = "";
        //     string? tipoMensaje = "";
        //     try
        //     {
        //         cn.getcn.Open();

        //         SqlCommand cmd = new SqlCommand("SP_MODIFICAR_SUB_PROYECTO", cn.getcn);
        //         cmd.CommandType = CommandType.StoredProcedure;

        //         cmd.Parameters.AddWithValue("@P_PROANO", subProyecto.ProAno);
        //         cmd.Parameters.AddWithValue("@P_PROCOD", subProyecto.ProCod);
        //         cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyecto.SubProAno);
        //         cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyecto.SubProCod);
        //         cmd.Parameters.AddWithValue("@P_SUBPRONOM", subProyecto.SubProNom);
        //         cmd.Parameters.AddWithValue("@P_SUBPROSAP", subProyecto.SubProSap);
        //         cmd.Parameters.AddWithValue("@P_USUMOD", userClaims.UsuNomUsu);
        //         cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
        //         cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
        //         cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
        //         cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
        //         cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

        //         SqlParameter pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
        //         pDescripcionMensaje.Direction = ParameterDirection.Output;
        //         cmd.Parameters.Add(pDescripcionMensaje);

        //         SqlParameter pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
        //         pTipoMensaje.Direction = ParameterDirection.Output;
        //         cmd.Parameters.Add(pTipoMensaje);

        //         cmd.ExecuteNonQuery();

        //         mensaje = pDescripcionMensaje.Value.ToString();
        //         tipoMensaje = pTipoMensaje.Value.ToString();
        //     }
        //     catch (SqlException ex)
        //     {
        //         mensaje = ex.Message;
        //         tipoMensaje = "1";
        //     }
        //     finally
        //     {
        //         cn.getcn.Close();
        //     }
        //     return (mensaje, tipoMensaje);
        // }
        public (string? message, string? messageType) Eliminar(ClaimsIdentity? identity, SubProyecto subProyecto)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);
            
            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_ELIMINAR_SUB_PROYECTO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyecto.SubProAno);
                cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyecto.SubProCod);
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

        public (string? message, string? messageType) InsertarSubProyectoImplementadorUbicacion(ClaimsIdentity? identity, SubProyecto subProyecto, List<SubProyectoImplementador> subProyectoImplementadores, List<SubProyectoFinanciador> subProyectoFinanciadores, List<SubProyectoUbicacion> subProyectoUbicaciones)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";

            string? message;
            string? messageType;

            using (TransactionScope scope = new TransactionScope())
            {
                using (SqlConnection connection = cn.getcn)
                {
                    try
                    {
                        SqlCommand cmd;
                        SqlParameter pDescripcionMensaje;
                        SqlParameter pTipoMensaje;
                        SqlParameter pAno;
                        SqlParameter pCod;

                        if (connection.State == ConnectionState.Closed)
                        {
                            connection.Open();
                        }


                        cmd = new SqlCommand("SP_INSERTAR_SUB_PROYECTO", cn.getcn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@P_PROANO", subProyecto.ProAno);
                        cmd.Parameters.AddWithValue("@P_PROCOD", subProyecto.ProCod);
                        cmd.Parameters.AddWithValue("@P_SUBPRONOM", subProyecto.SubProNom);
                        cmd.Parameters.AddWithValue("@P_SUBPROSAP", subProyecto.SubProSap);
                        cmd.Parameters.AddWithValue("@P_SUBPRORES", subProyecto.SubProRes);
                        cmd.Parameters.AddWithValue("@P_SUBPROPERANOINI", subProyecto.SubProPerAnoIni);
                        cmd.Parameters.AddWithValue("@P_SUBPROPERMESINI", subProyecto.SubProPerMesIni);
                        cmd.Parameters.AddWithValue("@P_SUBPROPERANOFIN", subProyecto.SubProPerAnoFin);
                        cmd.Parameters.AddWithValue("@P_SUBPROPERMESFIN", subProyecto.SubProPerMesFin);
                        cmd.Parameters.AddWithValue("@P_SUBPROINVSUBACT", subProyecto.SubProInvSubAct);
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

                        pAno = new SqlParameter("@P_SUBPROANO_OUT", SqlDbType.NVarChar, 4);
                        pAno.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(pAno);

                        pCod = new SqlParameter("@P_SUBPROCOD_OUT", SqlDbType.Char, 6);
                        pCod.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(pCod);

                        cmd.ExecuteNonQuery();

                        var subProAno = pAno.Value.ToString();
                        var subProCod = pCod.Value.ToString();
                        message = pDescripcionMensaje.Value.ToString();
                        messageType = pTipoMensaje.Value.ToString();

                        // Inserta el beneficiario
                        if (messageType != "3")
                        {
                            Console.WriteLine(message);
                            throw new Exception(message);
                        }

                        foreach (var implementador in subProyectoImplementadores)
                        {
                            cmd = new SqlCommand("SP_INSERTAR_SUB_PROYECTO_IMPLEMENTADOR", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.Parameters.AddWithValue("@P_SUBPROANO", subProAno);
                            cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProCod);
                            cmd.Parameters.AddWithValue("@P_IMPCOD", implementador.ImpCod);
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

                            message = pDescripcionMensaje.Value.ToString();
                            messageType = pTipoMensaje.Value.ToString();

                            // Inserta el DocumentoBeneficiario
                            if (messageType != "3")
                            {
                                Console.WriteLine(message);
                                throw new Exception(message);
                            }
                        }

                        foreach (var financiador in subProyectoFinanciadores)
                        {
                            cmd = new SqlCommand("SP_INSERTAR_SUB_PROYECTO_FINANCIADOR", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.Parameters.AddWithValue("@P_SUBPROANO", subProAno);
                            cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProCod);
                            cmd.Parameters.AddWithValue("@P_FINCOD", financiador.FinCod);
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

                            message = pDescripcionMensaje.Value.ToString();
                            messageType = pTipoMensaje.Value.ToString();

                            // Inserta el DocumentoBeneficiario
                            if (messageType != "3")
                            {
                                Console.WriteLine(message);
                                throw new Exception(message);
                            }
                        }

                        // Inserta cada DocumentoBeneficiario
                        foreach (var ubicacion in subProyectoUbicaciones)
                        {
                            cmd = new SqlCommand("SP_INSERTAR_SUB_PROYECTO_UBICACION", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@P_SUBPROANO", subProAno);
                            cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProCod);
                            cmd.Parameters.AddWithValue("@P_UBIANO", ubicacion.UbiAno);
                            cmd.Parameters.AddWithValue("@P_UBICOD", ubicacion.UbiCod);
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

                            message = pDescripcionMensaje.Value.ToString();
                            messageType = pTipoMensaje.Value.ToString();

                            // Inserta el DocumentoBeneficiario
                            if (messageType != "3")
                            {
                                Console.WriteLine(message);
                                throw new Exception(message);
                            }
                        }

                        // Si todas las operaciones fueron exitosas, confirma la transacción
                        scope.Complete();
                        mensaje = message;
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

        public (string? message, string? messageType) ModificarSubProyectoImplementadorUbicacion(ClaimsIdentity? identity, SubProyecto subProyecto, List<SubProyectoImplementador> subProyectoImplementadores, List<SubProyectoFinanciador> subProyectoFinanciadores, List<SubProyectoUbicacion> subProyectoUbicaciones)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";

            string? message="";
            string? messageType;

            using (TransactionScope scope = new TransactionScope())
            {
                using (SqlConnection connection = cn.getcn)
                {
                    try
                    {
                        SqlCommand cmd;
                        SqlParameter pDescripcionMensaje;
                        SqlParameter pTipoMensaje;
                        StringBuilder jsonResult;
                        SqlDataReader reader;
                        List<Indicador>? indicadores = null;

                        if (connection.State == ConnectionState.Closed)
                        {
                            connection.Open();
                        }

                        if (subProyectoImplementadores.Count > 0 || subProyectoUbicaciones.Count > 0 || subProyectoFinanciadores.Count > 0)
                        {
                            string? subProAno = subProyectoImplementadores.Count > 0 ? subProyectoImplementadores[0].SubProAno : 
                                                (subProyectoUbicaciones.Count > 0 ? subProyectoUbicaciones[0].SubProAno : subProyectoFinanciadores[0].SubProAno);
                            string? subProCod = subProyectoImplementadores.Count > 0 ? subProyectoImplementadores[0].SubProCod : 
                                                (subProyectoUbicaciones.Count > 0 ? subProyectoUbicaciones[0].SubProCod : subProyectoFinanciadores[0].SubProCod);

                            cmd = new SqlCommand("SP_BUSCAR_INDICADOR_SUB_PROYECTO", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@P_SUBPROANO", subProAno);
                            cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProCod);

                            jsonResult = new StringBuilder();
                            reader = cmd.ExecuteReader();
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
                            indicadores = JsonConvert.DeserializeObject<List<Indicador>>(jsonResult.ToString());
                        }

                        DataTable dtIndicadoresPeriodo = new DataTable();
                        dtIndicadoresPeriodo.Columns.Add("INDANO", typeof(string));
                        dtIndicadoresPeriodo.Columns.Add("INDCOD", typeof(string));

                        // Agregar los datos de los indicadores y periodos a la DataTable
                        foreach (var indicador in indicadores)
                        {
                            dtIndicadoresPeriodo.Rows.Add(indicador.IndAno, indicador.IndCod);
                        }

                        // MANEJAMOS CAMBIOS DE SUB PROYECTO
                        if (subProyecto != null)
                        {
                            cmd = new SqlCommand("SP_BUSCAR_SUB_PROYECTO", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyecto.SubProAno);
                            cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyecto.SubProCod);
                            cmd.Parameters.AddWithValue("@P_PROANO", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_PROCOD", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_SUBPRONOM", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_SUBPROSAP", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_SUBPROINVSUBACT", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_SUBPRORES", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_SUBPROPERANOINI", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_SUBPROPERMESINI", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_SUBPROPERANOFIN", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_SUBPROPERMESFIN", (object)DBNull.Value);
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

                            jsonResult = new StringBuilder();
                            reader = cmd.ExecuteReader();
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
                            List<SubProyecto>? subProyectoInicial= JsonConvert.DeserializeObject<List<SubProyecto>>(jsonResult.ToString());


                            // Asegúrate de que subProyectoInicial contiene exactamente un elemento
                            if (subProyectoInicial?.Count == 1)
                            {
                                // Convierte las propiedades de string a int
                                int oldStart = int.Parse(subProyectoInicial[0].SubProPerAnoIni);
                                int oldEnd = int.Parse(subProyectoInicial[0].SubProPerAnoFin);
                                int newStart = int.Parse(subProyecto.SubProPerAnoIni);
                                int newEnd = int.Parse(subProyecto.SubProPerAnoFin);

                                // Obtiene los rangos de años anterior y nuevo
                                List<int> oldYears = Enumerable.Range(oldStart, oldEnd - oldStart + 1).ToList();
                                List<int> newYears = Enumerable.Range(newStart, newEnd - newStart + 1).ToList();

                                // Determina qué años se deben agregar o eliminar
                                List<int> yearsToAdd = newYears.Except(oldYears).ToList();
                                List<int> yearsToDelete = oldYears.Except(newYears).ToList();

                                if (indicadores.Count > 0)
                                {
                                    if (yearsToAdd.Count > 0)
                                    {
                                        foreach (var year in yearsToAdd)
                                        {
                                            cmd = new SqlCommand("SP_INSERTAR_CADENA_RESULTADO_PERIODO_MASIVO", cn.getcn);
                                            cmd.CommandType = CommandType.StoredProcedure;

                                            SqlParameter param = new SqlParameter();
                                            param.ParameterName = "@IndicadoresPeriodo";
                                            param.SqlDbType = SqlDbType.Structured;
                                            param.Value = dtIndicadoresPeriodo;
                                            param.TypeName = "IndicadorPeriodoType";

                                            cmd.Parameters.Add(param);
                                            cmd.Parameters.AddWithValue("@P_CADRESPERANO", year);
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

                                            message = pDescripcionMensaje.Value.ToString();
                                            messageType = pTipoMensaje.Value.ToString();

                                            if (messageType != "3")
                                            {
                                                Console.WriteLine(message);
                                                throw new Exception(message);
                                            }
                                        }
                                    }
                                    if (yearsToDelete.Count > 0)
                                    {
                                        
                                        foreach (var year in yearsToDelete)
                                        {
                                            foreach (var indicador in indicadores)
                                            {
                                                cmd = new SqlCommand("SP_ELIMINAR_CADENA_RESULTADO_PERIODO", cn.getcn);
                                                cmd.CommandType = CommandType.StoredProcedure;

                                                cmd.Parameters.AddWithValue("@P_INDANO", indicador.IndAno);
                                                cmd.Parameters.AddWithValue("@P_INDCOD", indicador.IndCod);
                                                cmd.Parameters.AddWithValue("@P_CADRESPERANO", year);
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

                                                message = pDescripcionMensaje.Value.ToString();
                                                messageType = pTipoMensaje.Value.ToString();

                                                // Inserta el beneficiario
                                                if (messageType != "3")
                                                {
                                                    Console.WriteLine(message);
                                                    throw new Exception(message);
                                                }
                                            }
                                            
                                        }
                                    }
                                }
                            }
                            else
                            {
                                throw new Exception(message:"Ocurrio un Error.");
                            }
                
                            cmd = new SqlCommand("SP_MODIFICAR_SUB_PROYECTO", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyecto.SubProAno);
                            cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyecto.SubProCod);
                            cmd.Parameters.AddWithValue("@P_PROANO", subProyecto.ProAno);
                            cmd.Parameters.AddWithValue("@P_PROCOD", subProyecto.ProCod);
                            cmd.Parameters.AddWithValue("@P_SUBPRONOM", subProyecto.SubProNom);
                            cmd.Parameters.AddWithValue("@P_SUBPROSAP", subProyecto.SubProSap);
                            cmd.Parameters.AddWithValue("@P_SUBPRORES", subProyecto.SubProRes);
                            cmd.Parameters.AddWithValue("@P_SUBPROPERANOINI", subProyecto.SubProPerAnoIni);
                            cmd.Parameters.AddWithValue("@P_SUBPROPERMESINI", subProyecto.SubProPerMesIni);
                            cmd.Parameters.AddWithValue("@P_SUBPROPERANOFIN", subProyecto.SubProPerAnoFin);
                            cmd.Parameters.AddWithValue("@P_SUBPROPERMESFIN", subProyecto.SubProPerMesFin);
                            cmd.Parameters.AddWithValue("@P_SUBPROINVSUBACT", subProyecto.SubProInvSubAct);
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

                            message = pDescripcionMensaje.Value.ToString();
                            messageType = pTipoMensaje.Value.ToString();

                            // Inserta el beneficiario
                            if (messageType != "3")
                            {
                                Console.WriteLine(message);
                                throw new Exception(message);
                            }
                        }

                        // LOGICA A MANEJAR DE IMPLEMENTADORES
                        if (subProyectoImplementadores.Count > 0)
                        {
                            // Buscamos los registros con este SUB_PROYECTO
                            cmd = new SqlCommand("SP_BUSCAR_SUB_PROYECTO_IMPLEMENTADOR", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyectoImplementadores[0].SubProAno);
                            cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyectoImplementadores[0].SubProCod);
                            cmd.Parameters.AddWithValue("@P_IMPCOD", (object)DBNull.Value);
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

                            jsonResult = new StringBuilder();
                            reader = cmd.ExecuteReader();
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
                            List<SubProyectoImplementador>? subProyectoImplementador = JsonConvert.DeserializeObject<List<SubProyectoImplementador>>(jsonResult.ToString());
                            // Encuentra los implementadores que necesitan ser eliminados
                            List<string> implementadoresActuales = subProyectoImplementador.Select(i => i.ImpCod).ToList();
                            List<string> implementadoresParametro = subProyectoImplementadores.Select(i => i.ImpCod).ToList();
                            List<string> implementadoresAEliminar = implementadoresActuales.Except(implementadoresParametro).ToList();

                            // Elimina los implementadores que ya no están en la lista de parámetros
                            foreach (string impCod in implementadoresAEliminar)
                            {
                                // Aquí debes llamar a tu procedimiento almacenado para eliminar el implementador
                                cmd = new SqlCommand("SP_ELIMINAR_SUB_PROYECTO_IMPLEMENTADOR", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;

                                cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyectoImplementadores[0].SubProAno);
                                cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyectoImplementadores[0].SubProCod);
                                cmd.Parameters.AddWithValue("@P_IMPCOD", impCod);
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

                                message = pDescripcionMensaje.Value.ToString();
                                messageType = pTipoMensaje.Value.ToString();

                                // Inserta el beneficiario
                                if (messageType != "3")
                                {
                                    Console.WriteLine(message);
                                    throw new Exception(message);
                                }

                                if (indicadores.Count > 0)
                                {
                                    foreach (var indicador in indicadores)
                                    {
                                        cmd = new SqlCommand("SP_ELIMINAR_CADENA_RESULTADO_IMPLEMENTADOR", cn.getcn);
                                        cmd.CommandType = CommandType.StoredProcedure;

                                        cmd.Parameters.AddWithValue("@P_IMPCOD", impCod);
                                        cmd.Parameters.AddWithValue("@P_INDANO", indicador.IndAno);
                                        cmd.Parameters.AddWithValue("@P_INDCOD", indicador.IndCod);
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

                                        message = pDescripcionMensaje.Value.ToString();
                                        messageType = pTipoMensaje.Value.ToString();

                                        // Inserta el beneficiario
                                        if (messageType != "3")
                                        {
                                            Console.WriteLine(message);
                                            throw new Exception(message);
                                        }
                                    }
                                }
                            }

                            // Ahora, para cada implementador en tu lista de parámetros, verifica si ya existe en la base de datos
                            foreach (string impCod in implementadoresParametro)
                            {
                                if (!implementadoresActuales.Contains(impCod))
                                {
                                    // Si no existe, entonces inserta el nuevo implementador en la base de datos
                                    cmd = new SqlCommand("SP_INSERTAR_SUB_PROYECTO_IMPLEMENTADOR", cn.getcn);
                                    cmd.CommandType = CommandType.StoredProcedure;

                                    cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyectoImplementadores[0].SubProAno);
                                    cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyectoImplementadores[0].SubProCod);
                                    cmd.Parameters.AddWithValue("@P_IMPCOD", impCod);
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

                                    message = pDescripcionMensaje.Value.ToString();
                                    messageType = pTipoMensaje.Value.ToString();

                                    // Inserta el beneficiario
                                    if (messageType != "3")
                                    {
                                        Console.WriteLine(message);
                                        throw new Exception(message);
                                    }

                                    if (indicadores.Count > 0)
                                    {
                                        cmd = new SqlCommand("SP_INSERTAR_CADENA_RESULTADO_IMPLEMENTADOR_MASIVO", cn.getcn);
                                        cmd.CommandType = CommandType.StoredProcedure;

                                        SqlParameter param = new SqlParameter();
                                        param.ParameterName = "@IndicadoresPeriodo";
                                        param.SqlDbType = SqlDbType.Structured;
                                        param.Value = dtIndicadoresPeriodo;
                                        param.TypeName = "IndicadorPeriodoType";

                                        cmd.Parameters.Add(param);
                                        cmd.Parameters.AddWithValue("@P_IMPCOD", impCod);
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

                                        message = pDescripcionMensaje.Value.ToString();
                                        messageType = pTipoMensaje.Value.ToString();

                                        if (messageType != "3")
                                        {
                                            Console.WriteLine(message);
                                            throw new Exception(message);
                                        }
                                    }
                                }
                            }
                        }

                        // LOGICA A MANEJAR DE FINANCIADORES
                        if (subProyectoFinanciadores.Count > 0)
                        {
                            // Buscamos los registros con este SUB_PROYECTO
                            cmd = new SqlCommand("SP_BUSCAR_SUB_PROYECTO_FINANCIADOR", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyectoFinanciadores[0].SubProAno);
                            cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyectoFinanciadores[0].SubProCod);
                            cmd.Parameters.AddWithValue("@P_FINCOD", (object)DBNull.Value);
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

                            jsonResult = new StringBuilder();
                            reader = cmd.ExecuteReader();
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
                            List<SubProyectoFinanciador>? subProyectoFinanciador = JsonConvert.DeserializeObject<List<SubProyectoFinanciador>>(jsonResult.ToString());
                            // Encuentra los implementadores que necesitan ser eliminados
                            List<string> financiadoresActuales = subProyectoFinanciador.Select(i => i.FinCod).ToList();
                            List<string> financiadoresParametro = subProyectoFinanciadores.Select(i => i.FinCod).ToList();
                            List<string> financiadoresEliminar = financiadoresActuales.Except(financiadoresParametro).ToList();


                            // Elimina los implementadores que ya no están en la lista de parámetros
                            foreach (string finCod in financiadoresEliminar)
                            {
                                // Aquí debes llamar a tu procedimiento almacenado para eliminar el implementador
                                cmd = new SqlCommand("SP_ELIMINAR_SUB_PROYECTO_FINANCIADOR", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;

                                cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyectoFinanciadores[0].SubProAno);
                                cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyectoFinanciadores[0].SubProCod);
                                cmd.Parameters.AddWithValue("@P_FINCOD", finCod);
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

                                message = pDescripcionMensaje.Value.ToString();
                                messageType = pTipoMensaje.Value.ToString();

                                // Inserta el beneficiario
                                if (messageType != "3")
                                {
                                    Console.WriteLine(message);
                                    throw new Exception(message);
                                }

                                if (indicadores.Count > 0)
                                {
                                    foreach (var indicador in indicadores)
                                    {
                                        cmd = new SqlCommand("SP_ELIMINAR_CADENA_RESULTADO_FINANCIADOR", cn.getcn);
                                        cmd.CommandType = CommandType.StoredProcedure;

                                        cmd.Parameters.AddWithValue("@P_FINCOD", finCod);
                                        cmd.Parameters.AddWithValue("@P_INDANO", indicador.IndAno);
                                        cmd.Parameters.AddWithValue("@P_INDCOD", indicador.IndCod);
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

                                        message = pDescripcionMensaje.Value.ToString();
                                        messageType = pTipoMensaje.Value.ToString();

                                        // Inserta el beneficiario
                                        if (messageType != "3")
                                        {
                                            Console.WriteLine(message);
                                            throw new Exception(message);
                                        }
                                    }
                                }
                            }

                            // Ahora, para cada implementador en tu lista de parámetros, verifica si ya existe en la base de datos
                            foreach (string finCod in financiadoresParametro)
                            {
                                if (!financiadoresActuales.Contains(finCod))
                                {
                                    // Si no existe, entonces inserta el nuevo implementador en la base de datos
                                    cmd = new SqlCommand("SP_INSERTAR_SUB_PROYECTO_FINANCIADOR", cn.getcn);
                                    cmd.CommandType = CommandType.StoredProcedure;

                                    cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyectoFinanciadores[0].SubProAno);
                                    cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyectoFinanciadores[0].SubProCod);
                                    cmd.Parameters.AddWithValue("@P_FINCOD", finCod);
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

                                    message = pDescripcionMensaje.Value.ToString();
                                    messageType = pTipoMensaje.Value.ToString();

                                    // Inserta el beneficiario
                                    if (messageType != "3")
                                    {
                                        Console.WriteLine(message);
                                        throw new Exception(message);
                                    }

                                    if (indicadores.Count > 0)
                                    {
                                        cmd = new SqlCommand("SP_INSERTAR_CADENA_RESULTADO_FINANCIADOR_MASIVO", cn.getcn);
                                        cmd.CommandType = CommandType.StoredProcedure;

                                        SqlParameter param = new SqlParameter();
                                        param.ParameterName = "@IndicadoresPeriodo";
                                        param.SqlDbType = SqlDbType.Structured;
                                        param.Value = dtIndicadoresPeriodo;
                                        param.TypeName = "IndicadorPeriodoType";

                                        cmd.Parameters.Add(param);
                                        cmd.Parameters.AddWithValue("@P_FINCOD", finCod);
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

                                        message = pDescripcionMensaje.Value.ToString();
                                        messageType = pTipoMensaje.Value.ToString();

                                        if (messageType != "3")
                                        {
                                            Console.WriteLine(message);
                                            throw new Exception(message);
                                        }
                                    }
                                }
                            }
                        }

                        // LOGICA A MANEJAR DE UBICACIONES
                        if (subProyectoUbicaciones.Count > 0)
                        {
                            // Buscamos los registros con este SUB_PROYECTO
                            cmd = new SqlCommand("SP_BUSCAR_SUB_PROYECTO_UBICACION", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyectoUbicaciones[0].SubProAno);
                            cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyectoUbicaciones[0].SubProCod);
                            cmd.Parameters.AddWithValue("@P_UBIANO", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_UBICOD", (object)DBNull.Value);
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

                            jsonResult = new StringBuilder();
                            reader = cmd.ExecuteReader();
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
                            List<SubProyectoUbicacion>? subProyectoUbicacion = JsonConvert.DeserializeObject<List<SubProyectoUbicacion>>(jsonResult.ToString());
                            // Encuentra las ubicaciones que necesitan ser eliminadas
                            List<(string, string)> ubicacionesActuales = subProyectoUbicacion.Select(u => (u.UbiAno, u.UbiCod)).ToList();
                            List<(string, string)> ubicacionesParametro = subProyectoUbicaciones.Select(u => (u.UbiAno, u.UbiCod)).ToList();
                            List<(string, string)> ubicacionesAEliminar = ubicacionesActuales.Except(ubicacionesParametro).ToList();

                            // Elimina las ubicaciones que ya no están en la lista de parámetros
                            foreach ((string ubiAno, string ubiCod) in ubicacionesAEliminar)
                            {
                                // Aquí debes llamar a tu procedimiento almacenado para eliminar la ubicación
                                cmd = new SqlCommand("SP_ELIMINAR_SUB_PROYECTO_UBICACION", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;

                                cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyectoUbicaciones[0].SubProAno);
                                cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyectoUbicaciones[0].SubProCod);
                                cmd.Parameters.AddWithValue("@P_UBIANO", ubiAno);
                                cmd.Parameters.AddWithValue("@P_UBICOD", ubiCod);
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

                                message = pDescripcionMensaje.Value.ToString();
                                messageType = pTipoMensaje.Value.ToString();

                                // Inserta el beneficiario
                                if (messageType != "3")
                                {
                                    Console.WriteLine(message);
                                    throw new Exception(message);
                                }

                                if (indicadores.Count > 0)
                                {
                                    foreach (var indicador in indicadores)
                                    {
                                        cmd = new SqlCommand("SP_ELIMINAR_CADENA_RESULTADO_UBICACION", cn.getcn);
                                        cmd.CommandType = CommandType.StoredProcedure;

                                        cmd.Parameters.AddWithValue("@P_UBIANO", ubiAno);
                                        cmd.Parameters.AddWithValue("@P_UBICOD", ubiCod);
                                        cmd.Parameters.AddWithValue("@P_INDANO", indicador.IndAno);
                                        cmd.Parameters.AddWithValue("@P_INDCOD", indicador.IndCod);
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

                                        message = pDescripcionMensaje.Value.ToString();
                                        messageType = pTipoMensaje.Value.ToString();

                                        // Inserta el beneficiario
                                        if (messageType != "3")
                                        {
                                            Console.WriteLine(message);
                                            throw new Exception(message);
                                        }
                                    }
                                }
                            }

                            // Ahora, para cada ubicación en tu lista de parámetros, verifica si ya existe en la base de datos
                            foreach ((string ubiAno, string ubiCod) in ubicacionesParametro)
                            {
                                if (!ubicacionesActuales.Contains((ubiAno, ubiCod)))
                                {
                                    // Si no existe, entonces inserta la nueva ubicación en la base de datos
                                    cmd = new SqlCommand("SP_INSERTAR_SUB_PROYECTO_UBICACION", cn.getcn);
                                    cmd.CommandType = CommandType.StoredProcedure;

                                    cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyectoUbicaciones[0].SubProAno);
                                    cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyectoUbicaciones[0].SubProCod);
                                    cmd.Parameters.AddWithValue("@P_UBIANO", ubiAno);
                                    cmd.Parameters.AddWithValue("@P_UBICOD", ubiCod);
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

                                    message = pDescripcionMensaje.Value.ToString();
                                    messageType = pTipoMensaje.Value.ToString();

                                    // Inserta el beneficiario
                                    if (messageType != "3")
                                    {
                                        Console.WriteLine(message);
                                        throw new Exception(message);
                                    }

                                    if (indicadores.Count > 0)
                                    {
                                        cmd = new SqlCommand("SP_INSERTAR_CADENA_RESULTADO_UBICACION_MASIVO", cn.getcn);
                                        cmd.CommandType = CommandType.StoredProcedure;

                                        SqlParameter param = new SqlParameter();
                                        param.ParameterName = "@IndicadoresPeriodo";
                                        param.SqlDbType = SqlDbType.Structured;
                                        param.Value = dtIndicadoresPeriodo;
                                        param.TypeName = "IndicadorPeriodoType";

                                        cmd.Parameters.Add(param);
                                        cmd.Parameters.AddWithValue("@P_UBIANO", ubiAno);
                                        cmd.Parameters.AddWithValue("@P_UBICOD", ubiCod);
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

                                        message = pDescripcionMensaje.Value.ToString();
                                        messageType = pTipoMensaje.Value.ToString();

                                        if (messageType != "3")
                                        {
                                            Console.WriteLine(message);
                                            throw new Exception(message);
                                        }
                                    }
                                }
                            }

                        }

                        // Si todas las operaciones fueron exitosas, confirma la transacción
                        scope.Complete();
                        mensaje = "Registro actualizado correctamente";
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

        public (string? message, string? messageType) InsertarSubProyectoImplementadorUbicacionMasivo(ClaimsIdentity? identity, SubProyecto subProyecto, List<SubProyectoImplementador> subProyectoImplementadores, List<SubProyectoUbicacion> subProyectoUbicaciones)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";

            string? message= "";
            string? messageType;

            using (TransactionScope scope = new TransactionScope(TransactionScopeOption.Required, TimeSpan.FromMinutes(5)))
            {
                using (SqlConnection connection = cn.getcn)
                {
                    try
                    {
                        SqlCommand cmd;
                        SqlParameter pDescripcionMensaje;
                        SqlParameter pTipoMensaje;
                        SqlParameter pAno;
                        SqlParameter pCod;
                        StringBuilder jsonResult;
                        SqlDataReader reader;

                        if (connection.State == ConnectionState.Closed)
                        {
                            connection.Open();
                        }

                        cmd = new SqlCommand("SP_BUSCAR_INDICADOR_SUB_PROYECTO", cn.getcn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyecto.SubProAno);
                        cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyecto.SubProCod);

                        jsonResult = new StringBuilder();
                        reader = cmd.ExecuteReader();
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
                        List<Indicador>? indicadores = JsonConvert.DeserializeObject<List<Indicador>>(jsonResult.ToString());

                        DataTable dtIndicadoresPeriodo = new DataTable();
                        dtIndicadoresPeriodo.Columns.Add("INDANO", typeof(string));
                        dtIndicadoresPeriodo.Columns.Add("INDCOD", typeof(string));
                        
                        // Convierte los años a enteros
                        int anoIni = int.Parse(subProyecto.SubProPerAnoIni);
                        int anoFin = int.Parse(subProyecto.SubProPerAnoFin);


                        // Agregar los datos de los indicadores y periodos a la DataTable
                        foreach (var indicador in indicadores)
                        {
                            dtIndicadoresPeriodo.Rows.Add(indicador.IndAno, indicador.IndCod);
                        }

                        // LOGICA A MANEJAR DE IMPLEMENTADORES
                        if (subProyectoImplementadores.Count > 0)
                        {
                            // Buscamos los registros con este SUB_PROYECTO
                            cmd = new SqlCommand("SP_BUSCAR_SUB_PROYECTO_IMPLEMENTADOR", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyecto.SubProAno);
                            cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyecto.SubProCod);
                            cmd.Parameters.AddWithValue("@P_IMPCOD", (object)DBNull.Value);
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

                            jsonResult = new StringBuilder();
                            reader = cmd.ExecuteReader();
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
                            List<SubProyectoImplementador>? subProyectoImplementador = JsonConvert.DeserializeObject<List<SubProyectoImplementador>>(jsonResult.ToString());
                            // Encuentra los implementadores que necesitan ser eliminados
                            List<string> implementadoresActuales = subProyectoImplementador.Select(i => i.ImpCod).ToList();
                            List<string> implementadoresParametro = subProyectoImplementadores.Select(i => i.ImpCod).ToList();
                            List<string> implementadoresAEliminar = implementadoresActuales.Except(implementadoresParametro).ToList();

                            // Elimina los implementadores que ya no están en la lista de parámetros
                            foreach (string impCod in implementadoresAEliminar)
                            {
                                // Aquí debes llamar a tu procedimiento almacenado para eliminar el implementador
                                cmd = new SqlCommand("SP_ELIMINAR_SUB_PROYECTO_IMPLEMENTADOR", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;

                                cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyecto.SubProAno);
                                cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyecto.SubProCod);
                                cmd.Parameters.AddWithValue("@P_IMPCOD", impCod);
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

                                message = pDescripcionMensaje.Value.ToString();
                                messageType = pTipoMensaje.Value.ToString();

                                // Inserta el beneficiario
                                if (messageType != "3")
                                {
                                    Console.WriteLine(message);
                                    throw new Exception(message);
                                }

                                if (indicadores.Count > 0)
                                {
                                    foreach (var indicador in indicadores)
                                    {
                                        cmd = new SqlCommand("SP_ELIMINAR_CADENA_RESULTADO_IMPLEMENTADOR", cn.getcn);
                                        cmd.CommandType = CommandType.StoredProcedure;

                                        cmd.Parameters.AddWithValue("@P_IMPCOD", impCod);
                                        cmd.Parameters.AddWithValue("@P_INDANO", indicador.IndAno);
                                        cmd.Parameters.AddWithValue("@P_INDCOD", indicador.IndCod);
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

                                        message = pDescripcionMensaje.Value.ToString();
                                        messageType = pTipoMensaje.Value.ToString();

                                        // Inserta el beneficiario
                                        if (messageType != "3")
                                        {
                                            Console.WriteLine(message);
                                            throw new Exception(message);
                                        }
                                    }
                                }
                            }

                            // Ahora, para cada implementador en tu lista de parámetros, verifica si ya existe en la base de datos
                            foreach (string impCod in implementadoresParametro)
                            {
                                if (!implementadoresActuales.Contains(impCod))
                                {
                                    // Si no existe, entonces inserta el nuevo implementador en la base de datos
                                    cmd = new SqlCommand("SP_INSERTAR_SUB_PROYECTO_IMPLEMENTADOR", cn.getcn);
                                    cmd.CommandType = CommandType.StoredProcedure;

                                    cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyecto.SubProAno);
                                    cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyecto.SubProCod);
                                    cmd.Parameters.AddWithValue("@P_IMPCOD", impCod);
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

                                    message = pDescripcionMensaje.Value.ToString();
                                    messageType = pTipoMensaje.Value.ToString();

                                    // Inserta el beneficiario
                                    if (messageType != "3")
                                    {
                                        Console.WriteLine(message);
                                        throw new Exception(message);
                                    }

                                    if (indicadores.Count > 0)
                                    {
                                        cmd = new SqlCommand("SP_INSERTAR_CADENA_RESULTADO_IMPLEMENTADOR_MASIVO", cn.getcn);
                                        cmd.CommandType = CommandType.StoredProcedure;

                                        SqlParameter param = new SqlParameter();
                                        param.ParameterName = "@IndicadoresPeriodo";
                                        param.SqlDbType = SqlDbType.Structured;
                                        param.Value = dtIndicadoresPeriodo;
                                        param.TypeName = "IndicadorPeriodoType";

                                        cmd.Parameters.Add(param);
                                        cmd.Parameters.AddWithValue("@P_IMPCOD", impCod);
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

                                        message = pDescripcionMensaje.Value.ToString();
                                        messageType = pTipoMensaje.Value.ToString();

                                        if (messageType != "3")
                                        {
                                            Console.WriteLine(message);
                                            throw new Exception(message);
                                        }
                                    }
                                }
                            }
                        }

                        // LOGICA A MANEJAR DE UBICACIONES
                        if (subProyectoUbicaciones.Count > 0)
                        {
                            // Buscamos los registros con este SUB_PROYECTO
                            cmd = new SqlCommand("SP_BUSCAR_SUB_PROYECTO_UBICACION", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyecto.SubProAno);
                            cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyecto.SubProCod);
                            cmd.Parameters.AddWithValue("@P_UBIANO", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_UBICOD", (object)DBNull.Value);
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

                            jsonResult = new StringBuilder();
                            reader = cmd.ExecuteReader();
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
                            List<SubProyectoUbicacion>? subProyectoUbicacion = JsonConvert.DeserializeObject<List<SubProyectoUbicacion>>(jsonResult.ToString());
                            // Encuentra las ubicaciones que necesitan ser eliminadas
                            List<(string, string)> ubicacionesActuales = subProyectoUbicacion.Select(u => (u.UbiAno, u.UbiCod)).ToList();
                            List<(string, string)> ubicacionesParametro = subProyectoUbicaciones.Select(u => (u.UbiAno, u.UbiCod)).ToList();
                            List<(string, string)> ubicacionesAEliminar = ubicacionesActuales.Except(ubicacionesParametro).ToList();

                            // Elimina las ubicaciones que ya no están en la lista de parámetros
                            foreach ((string ubiAno, string ubiCod) in ubicacionesAEliminar)
                            {
                                // Aquí debes llamar a tu procedimiento almacenado para eliminar la ubicación
                                cmd = new SqlCommand("SP_ELIMINAR_SUB_PROYECTO_UBICACION", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;

                                cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyecto.SubProAno);
                                cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyecto.SubProCod);
                                cmd.Parameters.AddWithValue("@P_UBIANO", ubiAno);
                                cmd.Parameters.AddWithValue("@P_UBICOD", ubiCod);
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

                                message = pDescripcionMensaje.Value.ToString();
                                messageType = pTipoMensaje.Value.ToString();

                                // Inserta el beneficiario
                                if (messageType != "3")
                                {
                                    Console.WriteLine(message);
                                    throw new Exception(message);
                                }

                                if (indicadores.Count > 0)
                                {
                                    foreach (var indicador in indicadores)
                                    {
                                        cmd = new SqlCommand("SP_ELIMINAR_CADENA_RESULTADO_UBICACION", cn.getcn);
                                        cmd.CommandType = CommandType.StoredProcedure;

                                        cmd.Parameters.AddWithValue("@P_UBIANO", ubiAno);
                                        cmd.Parameters.AddWithValue("@P_UBICOD", ubiCod);
                                        cmd.Parameters.AddWithValue("@P_INDANO", indicador.IndAno);
                                        cmd.Parameters.AddWithValue("@P_INDCOD", indicador.IndCod);
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

                                        message = pDescripcionMensaje.Value.ToString();
                                        messageType = pTipoMensaje.Value.ToString();

                                        // Inserta el beneficiario
                                        if (messageType != "3")
                                        {
                                            Console.WriteLine(message);
                                            throw new Exception(message);
                                        }
                                    }
                                }
                            }

                            // Ahora, para cada ubicación en tu lista de parámetros, verifica si ya existe en la base de datos
                            foreach ((string ubiAno, string ubiCod) in ubicacionesParametro)
                            {
                                if (!ubicacionesActuales.Contains((ubiAno, ubiCod)))
                                {
                                    // Si no existe, entonces inserta la nueva ubicación en la base de datos
                                    cmd = new SqlCommand("SP_INSERTAR_SUB_PROYECTO_UBICACION", cn.getcn);
                                    cmd.CommandType = CommandType.StoredProcedure;

                                    cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyecto.SubProAno);
                                    cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyecto.SubProCod);
                                    cmd.Parameters.AddWithValue("@P_UBIANO", ubiAno);
                                    cmd.Parameters.AddWithValue("@P_UBICOD", ubiCod);
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

                                    message = pDescripcionMensaje.Value.ToString();
                                    messageType = pTipoMensaje.Value.ToString();

                                    // Inserta el beneficiario
                                    if (messageType != "3")
                                    {
                                        Console.WriteLine(message);
                                        throw new Exception(message);
                                    }

                                    if (indicadores.Count > 0)
                                    {
                                        cmd = new SqlCommand("SP_INSERTAR_CADENA_RESULTADO_UBICACION_MASIVO", cn.getcn);
                                        cmd.CommandType = CommandType.StoredProcedure;

                                        SqlParameter param = new SqlParameter();
                                        param.ParameterName = "@IndicadoresPeriodo";
                                        param.SqlDbType = SqlDbType.Structured;
                                        param.Value = dtIndicadoresPeriodo;
                                        param.TypeName = "IndicadorPeriodoType";

                                        cmd.Parameters.Add(param);
                                        cmd.Parameters.AddWithValue("@P_UBIANO", ubiAno);
                                        cmd.Parameters.AddWithValue("@P_UBICOD", ubiCod);
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

                                        message = pDescripcionMensaje.Value.ToString();
                                        messageType = pTipoMensaje.Value.ToString();

                                        if (messageType != "3")
                                        {
                                            Console.WriteLine(message);
                                            throw new Exception(message);
                                        }
                                    }
                                }
                            }

                        }

                        // Si todas las operaciones fueron exitosas, confirma la transacción
                        scope.Complete();
                        mensaje = message;
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

         public async Task<(string? message, string? messageType)> SubirArchivo(SubProyectoFuente subProyectoFuente, FileData fileData, string uploadsDirectory)
        {
            // var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";

            try
            {
                cn.getcn.Open();

                // Aquí tienes los datos del archivo
                var data = fileData.Data;
                var fileName = subProyectoFuente.SubProSap + "_" + fileData.FileName;
                var fileSize = fileData.FileSize;

                System.IO.Directory.CreateDirectory(uploadsDirectory); // Crea el directorio si no existe

                var path = Path.Combine(uploadsDirectory, fileName);
                await System.IO.File.WriteAllBytesAsync(path, Convert.FromBase64String(data));

                SqlCommand cmd = new SqlCommand("SP_INSERTAR_SUB_PROYECTO_FUENTE_VERIFICACION", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyectoFuente.SubProAno);
                cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyectoFuente.SubProCod);
                cmd.Parameters.AddWithValue("@P_SUBPROFUEVERNOM", fileName);
                cmd.Parameters.AddWithValue("@P_SUBPROFUEVERPES", fileSize);
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
        
        public async Task<(string? message, string? messageType)> EliminarArchivo(SubProyectoFuente subProyectoFuente, FileData fileData, string uploadsDirectory)
        {
            // var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";

            try
            {
                cn.getcn.Open();

                // Aquí tienes los datos del archivo
                var data = fileData.Data;
                var fileName = subProyectoFuente.SubProSap + "_" + fileData.FileName;
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

                SqlCommand cmd = new SqlCommand("SP_ELIMINAR_SUB_PROYECTO_FUENTE_VERIFICACION", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyectoFuente.SubProAno);
                cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyectoFuente.SubProCod);
                cmd.Parameters.AddWithValue("@P_SUBPROFUEVERNOM", fileData.FileName);
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

        public IEnumerable<SubProyectoFuente> BuscarArchivos(ClaimsIdentity? identity, string? subProAno, string? subProCod, string? subProFueVerNom = null, string? subProFueVerPes = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);
            Console.WriteLine(subProAno);
            Console.WriteLine(subProCod);
            
            List<SubProyectoFuente>? temporal = new List<SubProyectoFuente>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_SUB_PROYECTO_FUENTE_VERIFICACION", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                // Aquí puedes agregar los parámetros necesarios para tu procedimiento almacenado
                cmd.Parameters.AddWithValue("@P_SUBPROANO", subProAno);
                cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProCod);
                cmd.Parameters.AddWithValue("@P_SUBPROFUEVERNOM", string.IsNullOrEmpty(subProFueVerNom) ? (object)DBNull.Value : subProFueVerNom);
                cmd.Parameters.AddWithValue("@P_SUBPROFUEVERPES", string.IsNullOrEmpty(subProFueVerPes) ? (object)DBNull.Value : subProFueVerPes);
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
                temporal = JsonConvert.DeserializeObject<List<SubProyectoFuente>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<SubProyectoFuente>();
        }

    }
        
}
