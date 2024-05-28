using Microsoft.Data.SqlClient;
using System.Data;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;
using Newtonsoft.Json;
using System.Text;
using System.Security.Claims;

namespace SistemaMEAL.Modulos
{
    public class ObjetivoDAO
    {
        private conexionDAO cn = new conexionDAO();

        public IEnumerable<Objetivo> Buscar(ClaimsIdentity? identity, string? subProAno = null, string? subProCod = null,string? objAno = null, string? objCod = null, string? objNom = null, string? objNum = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            List<Objetivo>? temporal = new List<Objetivo>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_OBJETIVO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_OBJANO", string.IsNullOrEmpty(objAno) ? (object)DBNull.Value : objAno);
                cmd.Parameters.AddWithValue("@P_OBJCOD", string.IsNullOrEmpty(objCod) ? (object)DBNull.Value : objCod);
                cmd.Parameters.AddWithValue("@P_SUBPROANO", string.IsNullOrEmpty(subProAno) ? (object)DBNull.Value : subProAno);
                cmd.Parameters.AddWithValue("@P_SUBPROCOD", string.IsNullOrEmpty(subProCod) ? (object)DBNull.Value : subProCod);
                cmd.Parameters.AddWithValue("@P_OBJNOM", string.IsNullOrEmpty(objNom) ? (object)DBNull.Value : objNom);
                cmd.Parameters.AddWithValue("@P_OBJNUM", string.IsNullOrEmpty(objNum) ? (object)DBNull.Value : objNum);
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
                temporal = JsonConvert.DeserializeObject<List<Objetivo>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<Objetivo>();
        }

         public (string? anoOut,string? codOut,string? message, string? messageType) Insertar(ClaimsIdentity? identity, Objetivo objetivo)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";
            string? anoOut = "";
            string? codOut = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_INSERTAR_OBJETIVO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_SUBPROANO", objetivo.SubProAno);
                cmd.Parameters.AddWithValue("@P_SUBPROCOD", objetivo.SubProCod);
                cmd.Parameters.AddWithValue("@P_OBJNOM", objetivo.ObjNom);
                cmd.Parameters.AddWithValue("@P_OBJNUM", objetivo.ObjNum);
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

                SqlParameter pAno = new SqlParameter("@P_OBJANO_OUT", SqlDbType.NVarChar, 4);
                pAno.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pAno);

                SqlParameter pCod = new SqlParameter("@P_OBJCOD_OUT", SqlDbType.Char, 6);
                pCod.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pCod);

                cmd.ExecuteNonQuery();

                anoOut = pAno.Value.ToString();
                codOut = pCod.Value.ToString();
                mensaje = pDescripcionMensaje.Value.ToString();
                tipoMensaje = pTipoMensaje.Value.ToString();

                cmd = new SqlCommand("SP_INSERTAR_USUARIO_ACCESO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@P_USUANO", userClaims.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD", userClaims.UsuCod);
                cmd.Parameters.AddWithValue("@P_USUACCTIP", "OBJETIVO");
                cmd.Parameters.AddWithValue("@P_USUACCANO", anoOut);
                cmd.Parameters.AddWithValue("@P_USUACCCOD", codOut);
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
                cn.getcn.Close();
            }
            return (anoOut, codOut, mensaje, tipoMensaje);
        }

        public (string? message, string? messageType) Modificar(ClaimsIdentity? identity, Objetivo objetivo)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_MODIFICAR_OBJETIVO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_SUBPROANO", objetivo.SubProAno);
                cmd.Parameters.AddWithValue("@P_SUBPROCOD", objetivo.SubProCod);
                cmd.Parameters.AddWithValue("@P_OBJANO", objetivo.ObjAno);
                cmd.Parameters.AddWithValue("@P_OBJCOD", objetivo.ObjCod);
                cmd.Parameters.AddWithValue("@P_OBJNOM", objetivo.ObjNom);
                cmd.Parameters.AddWithValue("@P_OBJNUM", objetivo.ObjNum);
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
        public (string? message, string? messageType) Eliminar(ClaimsIdentity? identity, Objetivo objetivo)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_ELIMINAR_OBJETIVO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_OBJANO", objetivo.ObjAno);
                cmd.Parameters.AddWithValue("@P_OBJCOD", objetivo.ObjCod);
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
