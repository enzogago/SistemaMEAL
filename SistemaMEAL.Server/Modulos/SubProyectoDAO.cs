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

        public IEnumerable<SubProyecto> Buscar(ClaimsIdentity? identity, string? subProAno = null, string? subProCod = null,string? proAno = null, string? proCod = null, string? subProNom = null, string? subProSap = null)
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

        public (string? message, string? messageType) InsertarSubProyectoImplementadorUbicacion(ClaimsIdentity? identity, SubProyecto subProyecto, List<SubProyectoImplementador> subProyectoImplementadores, List<SubProyectoUbicacion> subProyectoUbicaciones)
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
        public (string? message, string? messageType) ModificarSubProyectoImplementadorUbicacion(ClaimsIdentity? identity, SubProyecto subProyecto, List<SubProyectoImplementador> subProyectoImplementadores, List<SubProyectoUbicacion> subProyectoUbicaciones)
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

                        if (connection.State == ConnectionState.Closed)
                        {
                            connection.Open();
                        }

                        if (subProyecto != null)
                        {
                            cmd = new SqlCommand("SP_MODIFICAR_SUB_PROYECTO", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyecto.SubProAno);
                            cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyecto.SubProCod);
                            cmd.Parameters.AddWithValue("@P_PROANO", subProyecto.ProAno);
                            cmd.Parameters.AddWithValue("@P_PROCOD", subProyecto.ProCod);
                            cmd.Parameters.AddWithValue("@P_SUBPRONOM", subProyecto.SubProNom);
                            cmd.Parameters.AddWithValue("@P_SUBPROSAP", subProyecto.SubProSap);
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

                        if (subProyectoImplementadores.Count > 0)
                        {
                            cmd = new SqlCommand("SP_ELIMINAR_SUB_PROYECTO_IMPLEMENTADOR", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyectoImplementadores[0].SubProAno);
                            cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyectoImplementadores[0].SubProCod);
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

                            foreach (var implementador in subProyectoImplementadores)
                            {
                                cmd = new SqlCommand("SP_INSERTAR_SUB_PROYECTO_IMPLEMENTADOR", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.AddWithValue("@P_SUBPROANO", implementador.SubProAno);
                                cmd.Parameters.AddWithValue("@P_SUBPROCOD", implementador.SubProCod);
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
                                
                                // Inserta el beneficiario
                                if (messageType != "3")
                                {
                                    Console.WriteLine(message);
                                    throw new Exception(message);
                                }
                            }
                        }

                        if (subProyectoUbicaciones.Count > 0)
                        {
                            cmd = new SqlCommand("SP_ELIMINAR_SUB_PROYECTO_UBICACION", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyectoUbicaciones[0].SubProAno);
                            cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyectoUbicaciones[0].SubProCod);
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

                            foreach (var ubicaciones in subProyectoUbicaciones)
                            {
                                cmd = new SqlCommand("SP_INSERTAR_SUB_PROYECTO_UBICACION", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.AddWithValue("@P_SUBPROANO", ubicaciones.SubProAno);
                                cmd.Parameters.AddWithValue("@P_SUBPROCOD", ubicaciones.SubProCod);
                                cmd.Parameters.AddWithValue("@P_UBIANO", ubicaciones.UbiAno);
                                cmd.Parameters.AddWithValue("@P_UBICOD", ubicaciones.UbiCod);
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

                        if (connection.State == ConnectionState.Closed)
                        {
                            connection.Open();
                        }

                        cmd = new SqlCommand("SP_BUSCAR_INDICADOR_SUB_PROYECTO", cn.getcn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyecto.SubProAno);
                        cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyecto.SubProCod);

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
                        List<Indicador>? indicadores = JsonConvert.DeserializeObject<List<Indicador>>(jsonResult.ToString());


                        // Convierte los años a enteros
                        int anoIni = int.Parse(subProyecto.ProPerAnoIni);
                        int anoFin = int.Parse(subProyecto.ProPerAnoFin);
                        for (int ano = anoIni; ano <= anoFin; ano++)
                        {
                            if (indicadores.Count > 0)
                            {
                                foreach (var indicador in indicadores)
                                {
                                    Console.WriteLine("Desde Periodo");
                                    cmd = new SqlCommand("SP_INSERTAR_CADENA_RESULTADO_PERIODO", cn.getcn);
                                    cmd.CommandType = CommandType.StoredProcedure;
                                    cmd.Parameters.AddWithValue("@P_INDANO", indicador.IndAno);
                                    cmd.Parameters.AddWithValue("@P_INDCOD", indicador.IndCod);
                                    cmd.Parameters.AddWithValue("@P_CADRESPERANO", ano);
                                    cmd.Parameters.AddWithValue("@P_CADRESPERMETTEC", "");
                                    cmd.Parameters.AddWithValue("@P_CADRESPERMETPRE", "");
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

                        foreach (var implementador in subProyectoImplementadores)
                        {
                            cmd = new SqlCommand("SP_INSERTAR_SUB_PROYECTO_IMPLEMENTADOR", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyecto.SubProAno);
                            cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyecto.SubProCod);
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
                            if (indicadores.Count > 0)
                            {
                                foreach (var indicador in indicadores)
                                {
                                    Console.WriteLine("Desde Implementadores");
                                    cmd = new SqlCommand("SP_INSERTAR_CADENA_RESULTADO_IMPLEMENTADOR", cn.getcn);
                                    cmd.CommandType = CommandType.StoredProcedure;
                                    cmd.Parameters.AddWithValue("@P_INDANO", indicador.IndAno);
                                    cmd.Parameters.AddWithValue("@P_INDCOD", indicador.IndCod);
                                    cmd.Parameters.AddWithValue("@P_IMPCOD", implementador.ImpCod);
                                    cmd.Parameters.AddWithValue("@P_CADRESIMPMETTEC", "");
                                    cmd.Parameters.AddWithValue("@P_CADRESIMPMETPRE", "");
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
                            }
                        }

                        // Inserta cada DocumentoBeneficiario
                        foreach (var ubicacion in subProyectoUbicaciones)
                        {
                            cmd = new SqlCommand("SP_INSERTAR_SUB_PROYECTO_UBICACION", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@P_SUBPROANO", subProyecto.SubProAno);
                            cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProyecto.SubProCod);
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
                            if (indicadores.Count > 0)
                            {
                                foreach (var indicador in indicadores)
                                {
                                    Console.WriteLine("Desde Ubicaciones");
                                    cmd = new SqlCommand("SP_INSERTAR_CADENA_RESULTADO_UBICACION", cn.getcn);
                                    cmd.CommandType = CommandType.StoredProcedure;
                                    cmd.Parameters.AddWithValue("@P_INDANO", indicador.IndAno);
                                    cmd.Parameters.AddWithValue("@P_INDCOD", indicador.IndCod);
                                    cmd.Parameters.AddWithValue("@P_UBIANO", ubicacion.UbiAno);
                                    cmd.Parameters.AddWithValue("@P_UBICOD", ubicacion.UbiCod);
                                    cmd.Parameters.AddWithValue("@P_CADRESUBIMETTEC", "");
                                    cmd.Parameters.AddWithValue("@P_CADRESUBIMETPRE", "");
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

    }
        
}
