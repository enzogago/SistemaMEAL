using Microsoft.Data.SqlClient;
using System.Data;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;
using Newtonsoft.Json;
using System.Text;

namespace SistemaMEAL.Modulos
{
    public class UbicacionDAO
    {
        private conexionDAO cn = new conexionDAO();

        public IEnumerable<Ubicacion> ListadoPaises()
        {
            List<Ubicacion> temporal = new List<Ubicacion>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_LISTAR_PAISES", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                SqlDataReader rd = cmd.ExecuteReader();
                while (rd.Read())
                {
                    temporal.Add(new Ubicacion()
                    {
                        UbiAno = rd.GetString(0),
                        UbiCod = rd.GetString(1),
                        UbiNom = rd.GetString(2),
                    });
                }
                rd.Close();
            }
            catch (SqlException ex)
            {
                temporal = new List<Ubicacion>();
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal;
        }

        public IEnumerable<Ubicacion> ListadoJerarquiaUbicacion(string? ubiAno, string? ubiCod)
        {
            List<Ubicacion> temporal = new List<Ubicacion>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_LISTAR_JERARQUIA_UBICACION", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UBIANO", ubiAno);
                cmd.Parameters.AddWithValue("@UBICOD", ubiCod);
                SqlDataReader rd = cmd.ExecuteReader();
                while (rd.Read())
                {
                    temporal.Add(new Ubicacion()
                    {
                        UbiAno = rd.GetString(0),
                        UbiCod = rd.GetString(1),
                        UbiNom = rd.GetString(2),
                        UbiTip = rd.GetString(3),
                    });
                }
                rd.Close();
            }
            catch (SqlException ex)
            {
                temporal = new List<Ubicacion>();
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal;
        }

        public IEnumerable<Ubicacion> ListadoUbicacioSelect(string? ubiAno, string? ubiCod)
        {
            List<Ubicacion>? temporal = new List<Ubicacion>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_UBICACIONES_SELECT", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                // Aquí puedes agregar los parámetros necesarios para tu procedimiento almacenado
                cmd.Parameters.AddWithValue("@P_UBIANO", ubiAno);
                cmd.Parameters.AddWithValue("@P_UBICOD", ubiCod);


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
                temporal = JsonConvert.DeserializeObject<List<Ubicacion>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<Ubicacion>();
        }

         public IEnumerable<Ubicacion> BuscarUbicacionesSubProyecto(string? ubiAno = null, string? ubiCod = null, string? subProAno = null, string? subProCod = null)
        {
            List<Ubicacion>? temporal = new List<Ubicacion>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_SUB_PROYECTO_UBICACION", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_UBIANO", string.IsNullOrEmpty(ubiAno) ? (object)DBNull.Value : ubiAno);
                cmd.Parameters.AddWithValue("@P_UBICOD", string.IsNullOrEmpty(ubiCod) ? (object)DBNull.Value : ubiCod);
                cmd.Parameters.AddWithValue("@P_SUBPROANO", string.IsNullOrEmpty(subProAno) ? (object)DBNull.Value : subProAno);
                cmd.Parameters.AddWithValue("@P_SUBPROCOD", string.IsNullOrEmpty(subProCod) ? (object)DBNull.Value : subProCod);
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
                Console.WriteLine(jsonResult);
                // Deserializa la cadena JSON en una lista de objetos Estado
                temporal = JsonConvert.DeserializeObject<List<Ubicacion>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<Ubicacion>();
        }

    }
}