using Microsoft.Data.SqlClient;
using System.Data;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;
using Newtonsoft.Json;
using System.Text;
using System.Security.Claims;

namespace SistemaMEAL.Modulos
{
    public class ActividadDAO
    {
        private conexionDAO cn = new conexionDAO();

        public IEnumerable<Actividad> Buscar(ClaimsIdentity? identity, string? resAno = null, string? resCod = null,string? actAno = null, string? actCod = null, string? actNom = null, string? actNum = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            List<Actividad>? temporal = new List<Actividad>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_ACTIVIDAD", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_ACTANO", string.IsNullOrEmpty(actAno) ? (object)DBNull.Value : actAno);
                cmd.Parameters.AddWithValue("@P_ACTCOD", string.IsNullOrEmpty(actCod) ? (object)DBNull.Value : actCod);
                cmd.Parameters.AddWithValue("@P_RESANO", string.IsNullOrEmpty(resAno) ? (object)DBNull.Value : resAno);
                cmd.Parameters.AddWithValue("@P_RESCOD", string.IsNullOrEmpty(resCod) ? (object)DBNull.Value : resCod);
                cmd.Parameters.AddWithValue("@P_ACTNOM", string.IsNullOrEmpty(actNom) ? (object)DBNull.Value : actNom);
                cmd.Parameters.AddWithValue("@P_ACTNUM", string.IsNullOrEmpty(actNum) ? (object)DBNull.Value : actNum);
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
                temporal = JsonConvert.DeserializeObject<List<Actividad>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<Actividad>();
        }

         public (string? anoOut,string? codOut,string? message, string? messageType) Insertar(ClaimsIdentity? identity, Actividad actividad)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";
            string? anoOut = "";
            string? codOut = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_INSERTAR_ACTIVIDAD", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_RESANO", actividad.ResAno);
                cmd.Parameters.AddWithValue("@P_RESCOD", actividad.ResCod);
                cmd.Parameters.AddWithValue("@P_ACTNOM", actividad.ActNom);
                cmd.Parameters.AddWithValue("@P_ACTNUM", actividad.ActNum);
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

                SqlParameter pAno = new SqlParameter("@P_RESANO_OUT", SqlDbType.NVarChar, 4);
                pAno.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pAno);

                SqlParameter pCod = new SqlParameter("@P_RESCOD_OUT", SqlDbType.Char, 6);
                pCod.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pCod);

                cmd.ExecuteNonQuery();

                anoOut = pAno.Value.ToString();
                codOut = pCod.Value.ToString();
                mensaje = pDescripcionMensaje.Value.ToString();
                tipoMensaje = pTipoMensaje.Value.ToString();

                cmd = new SqlCommand("SP_BUSCAR_RESULTADO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_RESANO", actividad.ResAno);
                cmd.Parameters.AddWithValue("@P_RESCOD", actividad.ResCod);
                cmd.Parameters.AddWithValue("@P_OBJESPANO", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_OBJESPCOD", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_RESNOM", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_RESNUM", (object)DBNull.Value);
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
                // Deserializa la cadena JSON en una lista de objetos Estado
                List<Resultado>? temporal = JsonConvert.DeserializeObject<List<Resultado>>(jsonResult.ToString());
                Resultado consulta = temporal[0];

                var accPad = "PROYECTO-" + consulta.ProAno + "-" + consulta.ProCod + "-SUB_PROYECTO-" + consulta.SubProAno + "-" + consulta.SubProCod + "-OBJETIVO-" + consulta.ObjAno + "-" + consulta.ObjCod + "-OBJETIVO_ESPECIFICO-" + consulta.ObjEspAno + "-" + consulta.ObjEspCod + "-RESULTADO-" + consulta.ResAno + "-" + consulta.ResCod + "-ACTIVIDAD-" + anoOut + "-" + codOut;

                cmd = new SqlCommand("SP_INSERTAR_USUARIO_ACCESO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@P_USUANO", userClaims.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD", userClaims.UsuCod);
                cmd.Parameters.AddWithValue("@P_USUACCTIP", "ACTIVIDAD");
                cmd.Parameters.AddWithValue("@P_USUACCANO", anoOut);
                cmd.Parameters.AddWithValue("@P_USUACCCOD", codOut);
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

        public (string? message, string? messageType) Modificar(ClaimsIdentity? identity, Actividad actividad)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_MODIFICAR_ACTIVIDAD", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_RESANO", actividad.ResAno);
                cmd.Parameters.AddWithValue("@P_RESCOD", actividad.ResCod);
                cmd.Parameters.AddWithValue("@P_ACTANO", actividad.ActAno);
                cmd.Parameters.AddWithValue("@P_ACTCOD", actividad.ActCod);
                cmd.Parameters.AddWithValue("@P_ACTNOM", actividad.ActNom);
                cmd.Parameters.AddWithValue("@P_ACTNUM", actividad.ActNum);
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
        
        public (string? message, string? messageType) Eliminar(ClaimsIdentity? identity, Actividad actividad)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_ELIMINAR_ACTIVIDAD", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_ACTANO", actividad.ActAno);
                cmd.Parameters.AddWithValue("@P_ACTCOD", actividad.ActCod);
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

    }
        
}
