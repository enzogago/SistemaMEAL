using Microsoft.Data.SqlClient;
using System.Data;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;
using Newtonsoft.Json;
using System.Text;

namespace SistemaMEAL.Modulos
{
    public class ObjetivoEspecificoDAO
    {
        private conexionDAO cn = new conexionDAO();

        public IEnumerable<ObjetivoEspecifico> Buscar(string? objEspAno = null, string? objEspCod = null,string? objAno = null, string? objCod = null, string? objEspNom = null, string? objEspNum = null)
        {
            List<ObjetivoEspecifico>? temporal = new List<ObjetivoEspecifico>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_OBJETIVO_ESPECIFICO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_OBJESPANO", string.IsNullOrEmpty(objEspAno) ? (object)DBNull.Value : objEspAno);
                cmd.Parameters.AddWithValue("@P_OBJESPCOD", string.IsNullOrEmpty(objEspCod) ? (object)DBNull.Value : objEspCod);
                cmd.Parameters.AddWithValue("@P_OBJANO", string.IsNullOrEmpty(objAno) ? (object)DBNull.Value : objAno);
                cmd.Parameters.AddWithValue("@P_OBJCOD", string.IsNullOrEmpty(objCod) ? (object)DBNull.Value : objCod);
                cmd.Parameters.AddWithValue("@P_OBJESPNOM", string.IsNullOrEmpty(objEspNom) ? (object)DBNull.Value : objEspNom);
                cmd.Parameters.AddWithValue("@P_OBJESPNUM", string.IsNullOrEmpty(objEspNum) ? (object)DBNull.Value : objEspNum);
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                cmd.Parameters.AddWithValue("@P_USUANO_U", "2024");
                cmd.Parameters.AddWithValue("@P_USUCOD_U", "0001");
                cmd.Parameters.AddWithValue("@P_USUNOM_U", "Juan");
                cmd.Parameters.AddWithValue("@P_USUAPE_U", "Perez");

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
                temporal = JsonConvert.DeserializeObject<List<ObjetivoEspecifico>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<ObjetivoEspecifico>();
        }

         public (string? anoOut,string? codOut,string? message, string? messageType) Insertar(ObjetivoEspecifico objetivoEspecifico)
        {
            string? mensaje = "";
            string? tipoMensaje = "";
            string? anoOut = "";
            string? codOut = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_INSERTAR_OBJETIVO_ESPECIFICO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_OBJANO", objetivoEspecifico.ObjAno);
                cmd.Parameters.AddWithValue("@P_OBJCOD", objetivoEspecifico.ObjCod);
                cmd.Parameters.AddWithValue("@P_OBJESPNOM", objetivoEspecifico.ObjEspNom);
                cmd.Parameters.AddWithValue("@P_OBJESPNUM", objetivoEspecifico.ObjEspNum);
                cmd.Parameters.AddWithValue("@P_USUING", "Usuario");
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                cmd.Parameters.AddWithValue("@P_USUAPE_U", "GAGO");

                SqlParameter pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                pDescripcionMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pDescripcionMensaje);

                SqlParameter pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                pTipoMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pTipoMensaje);

                SqlParameter pAno = new SqlParameter("@P_OBJESPANO_OUT", SqlDbType.NVarChar, 4);
                pAno.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pAno);

                SqlParameter pCod = new SqlParameter("@P_OBJESPCOD_OUT", SqlDbType.Char, 6);
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

        public (string? message, string? messageType) Modificar(ObjetivoEspecifico objetivoEspecifico)
        {
            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_MODIFICAR_OBJETIVO_ESPECIFICO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_OBJANO", objetivoEspecifico.ObjAno);
                cmd.Parameters.AddWithValue("@P_OBJCOD", objetivoEspecifico.ObjCod);
                cmd.Parameters.AddWithValue("@P_OBJESPANO", objetivoEspecifico.ObjEspAno);
                cmd.Parameters.AddWithValue("@P_OBJESPCOD", objetivoEspecifico.ObjEspCod);
                cmd.Parameters.AddWithValue("@P_OBJESPNOM", objetivoEspecifico.ObjEspNom);
                cmd.Parameters.AddWithValue("@P_OBJESPNUM", objetivoEspecifico.ObjEspNum);
                cmd.Parameters.AddWithValue("@P_USUMOD", "Usuario");
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                cmd.Parameters.AddWithValue("@P_USUAPE_U", "GAGO");

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
        public (string? message, string? messageType) Eliminar(ObjetivoEspecifico objetivoEspecifico)
        {
            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_ELIMINAR_OBJETIVO_ESPECIFICO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_OBJESPANO", objetivoEspecifico.ObjEspAno);
                cmd.Parameters.AddWithValue("@P_OBJESPCOD", objetivoEspecifico.ObjEspCod);
                cmd.Parameters.AddWithValue("@P_USUMOD", "Usuario");
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                cmd.Parameters.AddWithValue("@P_USUAPE_U", "GAGO");

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
