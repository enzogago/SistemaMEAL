using Microsoft.Data.SqlClient;
using System.Data;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;
using Newtonsoft.Json;
using System.Text;

namespace SistemaMEAL.Modulos
{
    public class ProyectoDAO
    {
        private conexionDAO cn = new conexionDAO();

        public void ModificarExclusiones(string usuAno, string usuCod, List<Proyecto> proyectos, List<SubProyecto> subProyectos, string operacion)
        {
            try
            {
                
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_MODIFICAR_EXCLUSIONES", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@USUANO", usuAno);
                cmd.Parameters.AddWithValue("@USUCOD", usuCod);

                // Crea una tabla de valores para los proyectos
                DataTable dtProyectos = new DataTable();
                dtProyectos.Columns.Add("PROANO", typeof(string));
                dtProyectos.Columns.Add("PROCOD", typeof(string));
                Console.WriteLine("Número de columnas en dtProyectos: " + dtProyectos.Columns.Count);
                foreach (var proyecto in proyectos)
                {
                    dtProyectos.Rows.Add(proyecto.ProAno, proyecto.ProCod);
                }
                SqlParameter parameter = cmd.Parameters.AddWithValue("@PROYECTOS", dtProyectos);
                parameter.SqlDbType = SqlDbType.Structured;
                parameter.TypeName = "ProyectoTableType";

                // Crea una tabla de valores para los subproyectos
                DataTable dtSubProyectos = new DataTable();
                Console.WriteLine(dtSubProyectos);
                dtSubProyectos.Columns.Add("SUBPROANO", typeof(string));
                dtSubProyectos.Columns.Add("SUBPROCOD", typeof(string));
                foreach (var subProyecto in subProyectos)
                {
                    dtSubProyectos.Rows.Add(subProyecto.SubProAno, subProyecto.SubProCod);
                }
                SqlParameter parameter2 = cmd.Parameters.AddWithValue("@SUBPROYECTOS", dtSubProyectos);
                parameter2.SqlDbType = SqlDbType.Structured;
                parameter2.TypeName = "SubProyectoTableType";

                cmd.Parameters.AddWithValue("@OPERACION", operacion);

                cmd.ExecuteNonQuery();
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
        }

        public IEnumerable<Proyecto> ListadoAccesibles(string usuAno, string usuCod)
        {
            List<Proyecto> temporal = new List<Proyecto>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_LISTAR_EXCLUSIONES_USUARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@USUANO", usuAno);
                cmd.Parameters.AddWithValue("@USUCOD", usuCod);

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

                // Deserializa la cadena JSON en un objeto Proyecto
                temporal = JsonConvert.DeserializeObject<List<Proyecto>>(jsonResult.ToString());
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


        public IEnumerable<Proyecto> Listado()
        {
            List<Proyecto> temporal = new List<Proyecto>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_LISTAR_SUBPROYECTO_PROYECTO", cn.getcn);
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

                // Deserializa la cadena JSON en un objeto Proyecto
                temporal = JsonConvert.DeserializeObject<List<Proyecto>>(jsonResult.ToString());
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

        public IEnumerable<Proyecto> ListarProyectosUsuario(string usuAno, string usuCod)
        {
            List<Proyecto> proyectos = new List<Proyecto>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_OBTENER_PROYECTOS_USUARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@USUANO", usuAno);
                cmd.Parameters.AddWithValue("@USUCOD", usuCod);

                SqlDataReader rd = cmd.ExecuteReader();
                while (rd.Read())
                {
                    Proyecto proyecto = new Proyecto()
                    {
                        ProAno = rd.GetString(0),
                        ProCod = rd.GetString(1),
                        ProNom = rd.GetString(2),
                        ProRes = rd.GetString(3),
                        ProPer = rd.GetString(4)
                    };

                    proyectos.Add(proyecto);
                }
                rd.Close();
            }
            catch (SqlException ex)
            {
                proyectos = new List<Proyecto>();
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return proyectos;
        }

        public IEnumerable<Proyecto> ObtenerDetallesProyectoUsuario(string usuAno, string usuCod, string proAno, string proCod)
        {
            List<Proyecto> temporal = new List<Proyecto>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_OBTENER_DETALLES_PROYECTO_USUARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@USUANO", usuAno);
                cmd.Parameters.AddWithValue("@USUCOD", usuCod);
                cmd.Parameters.AddWithValue("@PROANO", proAno);
                cmd.Parameters.AddWithValue("@PROCOD", proCod);

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
                // Deserializa la cadena JSON en un objeto Proyecto
                temporal = JsonConvert.DeserializeObject<List<Proyecto>>(jsonResult.ToString());
                Console.WriteLine(temporal);
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






    }
}