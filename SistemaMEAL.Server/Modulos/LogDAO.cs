using Microsoft.Data.SqlClient;
using System.Data;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;
using System.Text;
using Newtonsoft.Json;

namespace SistemaMEAL.Modulos
{
     public class LogDAO
    {
        private conexionDAO cn = new conexionDAO();

        public IEnumerable<Log> ActividadesRecientes()
        {
            List<Log>? temporal = new List<Log>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_ACTIVIDADES_RECIENTES", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

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
                temporal = JsonConvert.DeserializeObject<List<Log>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<Log>();
        }
    }
}