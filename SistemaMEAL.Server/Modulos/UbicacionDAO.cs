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

    }
}