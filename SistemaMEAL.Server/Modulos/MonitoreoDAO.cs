using Microsoft.Data.SqlClient;
using System.Data;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;
using Newtonsoft.Json;
using System.Text;

namespace SistemaMEAL.Modulos
{
    public class MonitoreoDAO
    {
        private conexionDAO cn = new conexionDAO();

        public IEnumerable<Monitoreo> Listado()
        {
            List<Monitoreo>? temporal = new List<Monitoreo>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_LISTAR_MONITOREO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

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
                temporal = JsonConvert.DeserializeObject<List<Monitoreo>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal;
        }

        public IEnumerable<Monitoreo> BuscarMonitoreo(string? metAno, string? metCod)
        {
            List<Monitoreo>? temporal = new List<Monitoreo>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_MONITOREO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_METANO", metAno);
                cmd.Parameters.AddWithValue("@P_METCOD", metCod);

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
                temporal = JsonConvert.DeserializeObject<List<Monitoreo>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal;
        }
        
        public (string? message, string? messageType) InsertarMetaBeneficiario(MetaBeneficiario metaBeneficiario)
        {
            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_INSERTAR_META_BENEFICIARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_METANO", metaBeneficiario.MetAno);
                cmd.Parameters.AddWithValue("@P_METCOD", metaBeneficiario.MetCod);
                cmd.Parameters.AddWithValue("@P_BENANO", metaBeneficiario.BenAno);
                cmd.Parameters.AddWithValue("@P_BENCOD", metaBeneficiario.BenCod);
                cmd.Parameters.AddWithValue("@P_UBIANO", metaBeneficiario.UbiAno);
                cmd.Parameters.AddWithValue("@P_UBICOD", metaBeneficiario.UbiCod);

                cmd.ExecuteNonQuery();

                mensaje = "Excelente";
                tipoMensaje = "3";
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