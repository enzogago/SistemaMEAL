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
                foreach (var proyecto in proyectos)
                {
                    dtProyectos.Rows.Add(proyecto.ProAno, proyecto.ProCod);
                }
                SqlParameter parameter = cmd.Parameters.AddWithValue("@PROYECTOS", dtProyectos);
                parameter.SqlDbType = SqlDbType.Structured;
                parameter.TypeName = "ProyectoTableType";

                // Crea una tabla de valores para los subproyectos
                DataTable dtSubProyectos = new DataTable();
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
            List<Proyecto>? temporal = new List<Proyecto>();
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
            return temporal?? new List<Proyecto>();
        }

        public IEnumerable<Proyecto> ListarProyectosUsuario(string usuAno, string usuCod)
        {
             List<Proyecto>? temporal = new List<Proyecto>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_OBTENER_PROYECTOS_USUARIO", cn.getcn);
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
                // Deserializa la cadena JSON en una lista de objetos Estado
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
            return temporal?? new List<Proyecto>();
        }

        public IEnumerable<Proyecto> ObtenerDetallesProyectoUsuario(string usuAno, string usuCod, string proAno, string proCod)
        {
            List<Proyecto>? temporal = new List<Proyecto>();
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
            return temporal?? new List<Proyecto>();
        }

        public IEnumerable<Proyecto> Listado(string? proAno = null, string? proCod = null, string? proNom = null, string? proDes = null, string? proRes = null, string? proPerAnoIni = null, string? proPerMesIni = null, string? proPerAnoFin = null, string? proPerMesFin = null)
        {
            List<Proyecto>? temporal = new List<Proyecto>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_PROYECTO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_PROANO", string.IsNullOrEmpty(proAno) ? (object)DBNull.Value : proAno);
                cmd.Parameters.AddWithValue("@P_PROCOD", string.IsNullOrEmpty(proCod) ? (object)DBNull.Value : proCod);
                cmd.Parameters.AddWithValue("@P_PRONOM", string.IsNullOrEmpty(proNom) ? (object)DBNull.Value : proNom);
                cmd.Parameters.AddWithValue("@P_PRODES", string.IsNullOrEmpty(proDes) ? (object)DBNull.Value : proDes);
                cmd.Parameters.AddWithValue("@P_PRORES", string.IsNullOrEmpty(proRes) ? (object)DBNull.Value : proRes);
                cmd.Parameters.AddWithValue("@P_PROPERANOINI", string.IsNullOrEmpty(proPerAnoIni) ? (object)DBNull.Value : proPerAnoIni);
                cmd.Parameters.AddWithValue("@P_PROPERMESINI", string.IsNullOrEmpty(proPerMesIni) ? (object)DBNull.Value : proPerMesIni);
                cmd.Parameters.AddWithValue("@P_PROPERANOFIN", string.IsNullOrEmpty(proPerAnoFin) ? (object)DBNull.Value : proPerAnoFin);
                cmd.Parameters.AddWithValue("@P_PROPERMESFIN", string.IsNullOrEmpty(proPerMesFin) ? (object)DBNull.Value : proPerMesFin);
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
                // Deserializa la cadena JSON en una lista de objetos Estado
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
            return temporal?? new List<Proyecto>();
        }




    }
}