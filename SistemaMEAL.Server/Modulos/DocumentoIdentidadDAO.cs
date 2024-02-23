using Microsoft.Data.SqlClient;
using System.Data;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;
using System.Text;
using Newtonsoft.Json;

namespace SistemaMEAL.Modulos
{
    public class DocumentoIdentidadDAO
    {
        private conexionDAO cn = new conexionDAO();

        public IEnumerable<DocumentoIdentidad> Listado(string? docIdeCod = null, string? docIdeNom = null, string? docIdeAbr = null)
        {
            List<DocumentoIdentidad>? temporal = new List<DocumentoIdentidad>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_DOCUMENTO_IDENTIDAD", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_DOCIDECOD", string.IsNullOrEmpty(docIdeCod) ? (object)DBNull.Value : docIdeCod);
                cmd.Parameters.AddWithValue("@P_DOCIDENOM", string.IsNullOrEmpty(docIdeNom) ? (object)DBNull.Value : docIdeNom);
                cmd.Parameters.AddWithValue("@P_DOCIDEABR", string.IsNullOrEmpty(docIdeAbr) ? (object)DBNull.Value : docIdeAbr);
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
                Console.WriteLine("desde jsonResult:"+jsonResult);
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
                // Deserializa la cadena JSON en una lista de objetos Estado
                temporal = JsonConvert.DeserializeObject<List<DocumentoIdentidad>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<DocumentoIdentidad>();
        }

        public (string message, string messageType) Insertar(DocumentoIdentidad documento)
        {
            string mensaje = "";
            string tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_INSERTAR_DOCUMENTO_IDENTIDAD", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_DOCIDENOM", documento.DocIdeNom);
                cmd.Parameters.AddWithValue("@P_DOCIDEABR", documento.DocIdeAbr);
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
            }
            finally
            {
                cn.getcn.Close();
            }
            return (mensaje, tipoMensaje);
        }

        public (string message, string messageType) Modificar(DocumentoIdentidad documento)
        {
            string mensaje = "";
            string tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_MODIFICAR_DOCUMENTO_IDENTIDAD", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_DOCIDECOD", documento.DocIdeCod);
                cmd.Parameters.AddWithValue("@P_DOCIDENOM", documento.DocIdeNom);
                cmd.Parameters.AddWithValue("@P_DOCIDEABR", documento.DocIdeAbr);
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

        public (string message, string messageType) Eliminar(string docIdeCod)
        {
            string mensaje = "";
            string tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_ELIMINAR_DOCUMENTO_IDENTIDAD", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_DOCIDECOD", docIdeCod);
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
    }
}
