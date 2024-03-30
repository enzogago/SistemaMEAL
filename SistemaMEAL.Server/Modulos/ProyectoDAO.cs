using Microsoft.Data.SqlClient;
using System.Data;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;
using Newtonsoft.Json;
using System.Text;
using System.Transactions;

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

        public IEnumerable<Proyecto> ListarProyectosSubproyectos()
        {
            List<Proyecto>? temporal = new List<Proyecto>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_LISTAR_MONITOREO_PERMISO", cn.getcn);
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

        public IEnumerable<Proyecto> Listado(string? proAno = null, string? proCod = null, string? proNom = null, string? proDes = null, string? proRes = null, string? proPerAnoIni = null, string? proPerMesIni = null, string? proPerAnoFin = null, string? proPerMesFin = null, string? proInvSubAct = null)
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
                cmd.Parameters.AddWithValue("@P_PROINVSUBACT", string.IsNullOrEmpty(proInvSubAct) ? (object)DBNull.Value : proInvSubAct);
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

        public (string? anoOut,string? codOut,string? message, string? messageType) Insertar(Proyecto proyecto)
        {
            string? mensaje = "";
            string? tipoMensaje = "";
            string? anoOut = "";
            string? codOut = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_INSERTAR_PROYECTO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_PRONOM", proyecto.ProNom);
                cmd.Parameters.AddWithValue("@P_PRODES", proyecto.ProDes);
                cmd.Parameters.AddWithValue("@P_PRORES", proyecto.ProRes);
                cmd.Parameters.AddWithValue("@P_PROPERANOINI", proyecto.ProPerAnoIni);
                cmd.Parameters.AddWithValue("@P_PROPERMESINI", proyecto.ProPerMesIni);
                cmd.Parameters.AddWithValue("@P_PROPERANOFIN", proyecto.ProPerAnoFin);
                cmd.Parameters.AddWithValue("@P_PROPERMESFIN", proyecto.ProPerMesFin);
                cmd.Parameters.AddWithValue("@P_PROINVSUBACT", proyecto.ProInvSubAct);
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

                SqlParameter pAno = new SqlParameter("@P_PROANO_OUT", SqlDbType.NVarChar, 4);
                pAno.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pAno);

                SqlParameter pCod = new SqlParameter("@P_PROCOD_OUT", SqlDbType.Char, 6);
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

        public (string? message, string? messageType) Modificar(Proyecto proyecto)
        {
            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_MODIFICAR_PROYECTO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_PROANO", proyecto.ProAno);
                cmd.Parameters.AddWithValue("@P_PROCOD", proyecto.ProCod);
                cmd.Parameters.AddWithValue("@P_PRONOM", proyecto.ProNom);
                cmd.Parameters.AddWithValue("@P_PRODES", proyecto.ProDes);
                cmd.Parameters.AddWithValue("@P_PRORES", proyecto.ProRes);
                cmd.Parameters.AddWithValue("@P_PROPERANOINI", proyecto.ProPerAnoIni);
                cmd.Parameters.AddWithValue("@P_PROPERMESINI", proyecto.ProPerMesIni);
                cmd.Parameters.AddWithValue("@P_PROPERANOFIN", proyecto.ProPerAnoFin);
                cmd.Parameters.AddWithValue("@P_PROPERMESFIN", proyecto.ProPerMesFin);
                cmd.Parameters.AddWithValue("@P_PROINVSUBACT", proyecto.ProInvSubAct);
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
        public (string? message, string? messageType) Eliminar(Proyecto proyecto)
        {
            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_ELIMINAR_PROYECTO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_PROANO", proyecto.ProAno);
                cmd.Parameters.AddWithValue("@P_PROCOD", proyecto.ProCod);
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

        public (string? message, string? messageType, List<ErrorCell> errorCells) InsertarMasivo(List<Proyecto> proyectos)
        {
            string? mensaje = "";
            string? tipoMensaje = "";
            List<ErrorCell> errorCells = new List<ErrorCell>();

            string? message;
            string? messageType;

            try
            {
                cn.getcn.Open();

                // Declara las variables aquí
                SqlCommand cmd;
                SqlParameter pDescripcionMensaje;
                SqlParameter pTipoMensaje;
                SqlParameter pAno;
                SqlParameter pCod;

                int indiceProyecto = 0;
                foreach (var proyecto in proyectos)
                {
                    // Inserta el proyecto
                    cmd = new SqlCommand("SP_INSERTAR_PROYECTO", cn.getcn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@P_PRONOM", proyecto.ProNom);
                    cmd.Parameters.AddWithValue("@P_PRODES", proyecto.ProDes);
                    cmd.Parameters.AddWithValue("@P_PRORES", proyecto.ProRes);
                    cmd.Parameters.AddWithValue("@P_PROPERANOINI", proyecto.ProPerAnoIni);
                    cmd.Parameters.AddWithValue("@P_PROPERMESINI", proyecto.ProPerMesIni);
                    cmd.Parameters.AddWithValue("@P_PROPERANOFIN", proyecto.ProPerAnoFin);
                    cmd.Parameters.AddWithValue("@P_PROPERMESFIN", proyecto.ProPerMesFin);  
                    cmd.Parameters.AddWithValue("@P_PROINVSUBACT", proyecto.ProInvSubAct);  
                    cmd.Parameters.AddWithValue("@P_USUING", "Usuario");
                    cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                    cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                    cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                    cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                    cmd.Parameters.AddWithValue("@P_USUAPE_U", "GAGO");

                    pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                    pDescripcionMensaje.Direction = ParameterDirection.Output;
                    cmd.Parameters.Add(pDescripcionMensaje);

                    pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                    pTipoMensaje.Direction = ParameterDirection.Output;
                    cmd.Parameters.Add(pTipoMensaje);

                    pAno = new SqlParameter("@P_PROANO_OUT", SqlDbType.NVarChar, 4);
                    pAno.Direction = ParameterDirection.Output;
                    cmd.Parameters.Add(pAno);

                    pCod = new SqlParameter("@P_PROCOD_OUT", SqlDbType.Char, 6);
                    pCod.Direction = ParameterDirection.Output;
                    cmd.Parameters.Add(pCod);

                    cmd.ExecuteNonQuery();

                    var proAno = pAno.Value.ToString();
                    var proCod = pCod.Value.ToString();
                    message = pDescripcionMensaje.Value.ToString();
                    messageType = pTipoMensaje.Value.ToString();
                    Console.WriteLine(proAno);
                    Console.WriteLine(proCod);
                    Console.WriteLine(message);
                    Console.WriteLine(messageType);

                    if (messageType != "3") // Si hay un error o el proyecto ya existe, retorna el mensaje
                    {
                        if (messageType == "2")
                        {
                            return (message, messageType, errorCells);
                        }
                        errorCells.Add(new ErrorCell { Row = indiceProyecto, Column = 0, Message = message });
                    }

                    int indiceSubproyecto = 0;
                    // Inserta los subproyectos del proyecto
                    foreach (var subproyecto in proyecto.SubProyectos)
                    {
                        subproyecto.ProAno = proAno; // Establece la clave foránea
                        subproyecto.ProCod = proCod; // Establece la clave foránea
                        // Inserta el proyecto
                        cmd = new SqlCommand("SP_INSERTAR_SUB_PROYECTO", cn.getcn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@P_PROANO", subproyecto.ProAno);
                        cmd.Parameters.AddWithValue("@P_PROCOD", subproyecto.ProCod);
                        cmd.Parameters.AddWithValue("@P_SUBPRONOM", subproyecto.SubProNom);
                        cmd.Parameters.AddWithValue("@P_SUBPROSAP", subproyecto.SubProSap);
                        cmd.Parameters.AddWithValue("@P_USUING", "Usuario");
                        cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                        cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                        cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                        cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                        cmd.Parameters.AddWithValue("@P_USUAPE_U", "GAGO");

                        pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                        pDescripcionMensaje.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(pDescripcionMensaje);

                        pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                        pTipoMensaje.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(pTipoMensaje);

                        pAno = new SqlParameter("@P_SUBPROANO_OUT", SqlDbType.NVarChar, 4);
                        pAno.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(pAno);

                        pCod = new SqlParameter("@P_SUBPROCOD_OUT", SqlDbType.Char, 6);
                        pCod.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(pCod);

                        cmd.ExecuteNonQuery();

                        var subProAno = pAno.Value.ToString();
                        var subproCod = pCod.Value.ToString();
                        message = pDescripcionMensaje.Value.ToString();
                        messageType = pTipoMensaje.Value.ToString();

                        if (messageType != "3") // Si hay un error o el proyecto ya existe, retorna el mensaje
                        {
                            if (messageType == "1")
                            {
                                return (message, messageType, errorCells);
                            }
                            errorCells.Add(new ErrorCell { Row = indiceProyecto, Column = indiceSubproyecto, Message = message });
                        }
                        
                        int indiceObjetivo = 0;
                        // Insertamos Objetivos
                        foreach (var objetivo in subproyecto.Objetivos)
                        {
                            objetivo.SubProAno = subProAno; // Establece la clave foránea
                            objetivo.SubProCod = subproCod; // Establece la clave foránea
                            // Inserta el proyecto
                            cmd = new SqlCommand("SP_INSERTAR_OBJETIVO", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@P_SUBPROANO", objetivo.SubProAno);
                            cmd.Parameters.AddWithValue("@P_SUBPROCOD", objetivo.SubProCod);
                            cmd.Parameters.AddWithValue("@P_OBJNOM", objetivo.ObjNom);
                            cmd.Parameters.AddWithValue("@P_OBJNUM", objetivo.ObjNum);
                            cmd.Parameters.AddWithValue("@P_USUING", "Usuario");
                            cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                            cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                            cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                            cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                            cmd.Parameters.AddWithValue("@P_USUAPE_U", "GAGO");

                            pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                            pDescripcionMensaje.Direction = ParameterDirection.Output;
                            cmd.Parameters.Add(pDescripcionMensaje);

                            pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                            pTipoMensaje.Direction = ParameterDirection.Output;
                            cmd.Parameters.Add(pTipoMensaje);

                            pAno = new SqlParameter("@P_OBJANO_OUT", SqlDbType.NVarChar, 4);
                            pAno.Direction = ParameterDirection.Output;
                            cmd.Parameters.Add(pAno);

                            pCod = new SqlParameter("@P_OBJCOD_OUT", SqlDbType.Char, 6);
                            pCod.Direction = ParameterDirection.Output;
                            cmd.Parameters.Add(pCod);

                            cmd.ExecuteNonQuery();

                            var objAno = pAno.Value.ToString();
                            var objCod = pCod.Value.ToString();
                            message = pDescripcionMensaje.Value.ToString();
                            messageType = pTipoMensaje.Value.ToString();

                            if (messageType != "3") // Si hay un error o el proyecto ya existe, retorna el mensaje
                            {
                                if (messageType == "1")
                                {
                                    return (message, messageType, errorCells);
                                }
                                errorCells.Add(new ErrorCell { Row = indiceSubproyecto, Column = indiceObjetivo, Message = message });
                            }
                            
                            int indiceObjetivoEspecifico = 0;
                            foreach (var objetivoEspecifico in objetivo.ObjetivosEspecificos)
                            {
                                objetivoEspecifico.ObjAno = objAno; // Establece la clave foránea
                                objetivoEspecifico.ObjCod = objCod; // Establece la clave foránea
                                // Inserta el proyecto
                                cmd = new SqlCommand("SP_INSERTAR_OBJETIVO_ESPECIFICO", cn.getcn);
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

                                pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                                pDescripcionMensaje.Direction = ParameterDirection.Output;
                                cmd.Parameters.Add(pDescripcionMensaje);

                                pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                                pTipoMensaje.Direction = ParameterDirection.Output;
                                cmd.Parameters.Add(pTipoMensaje);

                                pAno = new SqlParameter("@P_OBJESPANO_OUT", SqlDbType.NVarChar, 4);
                                pAno.Direction = ParameterDirection.Output;
                                cmd.Parameters.Add(pAno);

                                pCod = new SqlParameter("@P_OBJESPCOD_OUT", SqlDbType.Char, 6);
                                pCod.Direction = ParameterDirection.Output;
                                cmd.Parameters.Add(pCod);

                                cmd.ExecuteNonQuery();

                                var objEspAno = pAno.Value.ToString();
                                var objEspCod = pCod.Value.ToString();
                                message = pDescripcionMensaje.Value.ToString();
                                messageType = pTipoMensaje.Value.ToString();

                                if (messageType != "3") // Si hay un error o el proyecto ya existe, retorna el mensaje
                                {
                                    if (messageType == "1")
                                    {
                                        return (message, messageType, errorCells);
                                    }
                                    errorCells.Add(new ErrorCell { Row = indiceObjetivo, Column = indiceObjetivoEspecifico, Message = message });
                                }
                                
                                int indiceResultado = 0;

                                foreach (var resultado in objetivoEspecifico.Resultados)
                                {
                                    resultado.ObjEspAno = objEspAno; // Establece la clave foránea
                                    resultado.ObjEspCod = objEspCod; // Establece la clave foránea

                                    if (resultado.ResNom.Equals("") || resultado.ResNum.Equals("") ){
                                        // Insertamos Indicador de Objetivo

                                        // int indiceIndicador = 0;

                                        // foreach (var indicador in resultado.Indicadores)
                                        // {

                                        //     cmd = new SqlCommand("SP_INSERTAR_INDICADOR_OBJETIVO", cn.getcn);
                                        //     cmd.CommandType = CommandType.StoredProcedure;

                                        //     cmd.Parameters.AddWithValue("@P_OBJANO", objAno);
                                        //     cmd.Parameters.AddWithValue("@P_OBJCOD", objCod);
                                        //     cmd.Parameters.AddWithValue("@P_INDOBJNOM", indicador.IndNom);
                                        //     cmd.Parameters.AddWithValue("@P_INDOBJNUM", indicador.IndNum);
                                        //     cmd.Parameters.AddWithValue("@P_USUING", "Usuario");
                                        //     cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                                        //     cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                                        //     cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                                        //     cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                                        //     cmd.Parameters.AddWithValue("@P_USUAPE_U", "GAGO");

                                        //     pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                                        //     pDescripcionMensaje.Direction = ParameterDirection.Output;
                                        //     cmd.Parameters.Add(pDescripcionMensaje);

                                        //     pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                                        //     pTipoMensaje.Direction = ParameterDirection.Output;
                                        //     cmd.Parameters.Add(pTipoMensaje);

                                        //     pAno = new SqlParameter("@P_INDOBJANO_OUT", SqlDbType.NVarChar, 4);
                                        //     pAno.Direction = ParameterDirection.Output;
                                        //     cmd.Parameters.Add(pAno);

                                        //     pCod = new SqlParameter("@P_INDOBJCOD_OUT", SqlDbType.Char, 6);
                                        //     pCod.Direction = ParameterDirection.Output;
                                        //     cmd.Parameters.Add(pCod);

                                        //     cmd.ExecuteNonQuery();

                                        //     var resAno = pAno.Value.ToString();
                                        //     var resCod = pCod.Value.ToString();
                                        //     message = pDescripcionMensaje.Value.ToString();
                                        //     messageType = pTipoMensaje.Value.ToString();

                                        //     if (messageType != "3") // Si hay un error o el proyecto ya existe, retorna el mensaje
                                        //     {
                                        //         if (messageType == "1")
                                        //         {
                                        //             return (message, messageType, errorCells);
                                        //         }
                                        //         errorCells.Add(new ErrorCell { Row = indiceResultado, Column = indiceIndicador, Message = message });
                                        //     }
                                        // }
                                        // indiceIndicador++;
                                    } else {
                                        // Continuamos con Indicadores 
                                        // Inserta el proyecto
                                        cmd = new SqlCommand("SP_INSERTAR_RESULTADO", cn.getcn);
                                        cmd.CommandType = CommandType.StoredProcedure;

                                        cmd.Parameters.AddWithValue("@P_OBJESPANO", resultado.ObjEspAno);
                                        cmd.Parameters.AddWithValue("@P_OBJESPCOD", resultado.ObjEspCod);
                                        cmd.Parameters.AddWithValue("@P_RESNOM", resultado.ResNom);
                                        cmd.Parameters.AddWithValue("@P_RESNUM", resultado.ResNum);
                                        cmd.Parameters.AddWithValue("@P_USUING", "Usuario");
                                        cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                                        cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                                        cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                                        cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                                        cmd.Parameters.AddWithValue("@P_USUAPE_U", "GAGO");

                                        pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                                        pDescripcionMensaje.Direction = ParameterDirection.Output;
                                        cmd.Parameters.Add(pDescripcionMensaje);

                                        pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                                        pTipoMensaje.Direction = ParameterDirection.Output;
                                        cmd.Parameters.Add(pTipoMensaje);

                                        pAno = new SqlParameter("@P_RESANO_OUT", SqlDbType.NVarChar, 4);
                                        pAno.Direction = ParameterDirection.Output;
                                        cmd.Parameters.Add(pAno);

                                        pCod = new SqlParameter("@P_RESCOD_OUT", SqlDbType.Char, 6);
                                        pCod.Direction = ParameterDirection.Output;
                                        cmd.Parameters.Add(pCod);

                                        cmd.ExecuteNonQuery();

                                        var resAno = pAno.Value.ToString();
                                        var resCod = pCod.Value.ToString();
                                        message = pDescripcionMensaje.Value.ToString();
                                        messageType = pTipoMensaje.Value.ToString();

                                        if (messageType != "3")
                                        {
                                            if (messageType == "1")
                                            {
                                                return (message, messageType, errorCells);
                                            }
                                            errorCells.Add(new ErrorCell { Row = indiceObjetivoEspecifico, Column = indiceResultado, Message = message });
                                        }

                                        //
                                        cmd = new SqlCommand("SP_INSERTAR_ACTIVIDAD", cn.getcn);
                                        cmd.CommandType = CommandType.StoredProcedure;

                                        cmd.Parameters.AddWithValue("@P_RESANO", resAno);
                                        cmd.Parameters.AddWithValue("@P_RESCOD", resCod);
                                        cmd.Parameters.AddWithValue("@P_ACTNOM", "NA");
                                        cmd.Parameters.AddWithValue("@P_ACTNUM", "NA");
                                        cmd.Parameters.AddWithValue("@P_USUING", "Usuario");
                                        cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                                        cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                                        cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                                        cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                                        cmd.Parameters.AddWithValue("@P_USUAPE_U", "GAGO");

                                        pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                                        pDescripcionMensaje.Direction = ParameterDirection.Output;
                                        cmd.Parameters.Add(pDescripcionMensaje);

                                        pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                                        pTipoMensaje.Direction = ParameterDirection.Output;
                                        cmd.Parameters.Add(pTipoMensaje);

                                        pAno = new SqlParameter("@P_ACTANO_OUT", SqlDbType.NVarChar, 4);
                                        pAno.Direction = ParameterDirection.Output;
                                        cmd.Parameters.Add(pAno);

                                        pCod = new SqlParameter("@P_ACTCOD_OUT", SqlDbType.Char, 6);
                                        pCod.Direction = ParameterDirection.Output;
                                        cmd.Parameters.Add(pCod);

                                        cmd.ExecuteNonQuery();

                                        var actAno = pAno.Value.ToString();
                                        var actCod = pCod.Value.ToString();
                                        message = pDescripcionMensaje.Value.ToString();
                                        messageType = pTipoMensaje.Value.ToString();

                                        //
                                        
                                        int indiceIndicador = 0;

                                        foreach (var indicador in resultado.Indicadores)
                                        {
                                            indicador.ActAno = actAno; // Establece la clave foránea
                                            indicador.ActCod = actCod; // Establece la clave foránea

                                            // Inserta el proyecto
                                            cmd = new SqlCommand("SP_INSERTAR_INDICADOR", cn.getcn);
                                            cmd.CommandType = CommandType.StoredProcedure;

                                            cmd.Parameters.AddWithValue("@P_ACTANO", indicador.ActAno);
                                            cmd.Parameters.AddWithValue("@P_ACTCOD", indicador.ActCod);
                                            cmd.Parameters.AddWithValue("@P_INDNOM", indicador.IndNom);
                                            cmd.Parameters.AddWithValue("@P_INDNUM", indicador.IndNum);
                                            cmd.Parameters.AddWithValue("@P_INDTIPIND", indicador.IndTipInd);
                                            cmd.Parameters.AddWithValue("@P_UNICOD", indicador.UniCod);
                                            cmd.Parameters.AddWithValue("@P_TIPVALCOD", indicador.TipValCod);
                                            cmd.Parameters.AddWithValue("@P_USUING", "Usuario");
                                            cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                                            cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                                            cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                                            cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                                            cmd.Parameters.AddWithValue("@P_USUAPE_U", "GAGO");

                                            pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                                            pDescripcionMensaje.Direction = ParameterDirection.Output;
                                            cmd.Parameters.Add(pDescripcionMensaje);

                                            pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                                            pTipoMensaje.Direction = ParameterDirection.Output;
                                            cmd.Parameters.Add(pTipoMensaje);


                                            pAno = new SqlParameter("@P_INDANO_OUT", SqlDbType.NVarChar, 4);
                                            pAno.Direction = ParameterDirection.Output;
                                            cmd.Parameters.Add(pAno);

                                            pCod = new SqlParameter("@P_INDCOD_OUT", SqlDbType.Char, 6);
                                            pCod.Direction = ParameterDirection.Output;
                                            cmd.Parameters.Add(pCod);
                                            
                                            cmd.ExecuteNonQuery();

                                            var indActResAno = pAno.Value.ToString();
                                            var indActResCod = pCod.Value.ToString();
                                            message = pDescripcionMensaje.Value.ToString();
                                            messageType = pTipoMensaje.Value.ToString();

                                             if (messageType != "3") // Si hay un error o el proyecto ya existe, retorna el mensaje
                                            {
                                                if (messageType == "1")
                                                {
                                                    return (message, messageType, errorCells);
                                                }
                                                errorCells.Add(new ErrorCell { Row = indiceResultado, Column = indiceIndicador, Message = message });
                                            }

                                        }
                                        indiceIndicador++;
                                    }
                                }
                                indiceResultado++;
                            }
                            indiceObjetivoEspecifico++;
                        }
                        indiceObjetivo++;
                    }
                    indiceSubproyecto++;
                }
                indiceProyecto++;

                if (errorCells.Count > 0)
                {
                    mensaje = "Se encontraron errores durante la inserción masiva";
                    tipoMensaje = "1";
                }
                else
                {
                    mensaje = "Todos los proyectos se insertaron correctamente";
                    tipoMensaje = "3";
                }
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

            return (mensaje, tipoMensaje, errorCells);
        }


        public (string? message, string? messageType) InsertarProyectoImplementadorUbicacion(Proyecto proyecto, List<Implementador> implementadores, List<Ubicacion> ubicaciones)
        {
            string? mensaje = "";
            string? tipoMensaje = "";

            string? message;
            string? messageType;

            using (TransactionScope scope = new TransactionScope())
            {
                using (SqlConnection connection = cn.getcn)
                {
                    try
                    {
                        SqlCommand cmd;
                        SqlParameter pDescripcionMensaje;
                        SqlParameter pTipoMensaje;
                        SqlParameter pAno;
                        SqlParameter pCod;

                        if (connection.State == ConnectionState.Closed)
                        {
                            connection.Open();
                        }


                        cmd = new SqlCommand("SP_INSERTAR_PROYECTO", cn.getcn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@P_PRONOM", proyecto.ProNom);
                        cmd.Parameters.AddWithValue("@P_PRODES", proyecto.ProDes);
                        cmd.Parameters.AddWithValue("@P_PRORES", proyecto.ProRes);
                        cmd.Parameters.AddWithValue("@P_PROPERANOINI", proyecto.ProPerAnoIni);
                        cmd.Parameters.AddWithValue("@P_PROPERMESINI", proyecto.ProPerMesIni);
                        cmd.Parameters.AddWithValue("@P_PROPERANOFIN", proyecto.ProPerAnoFin);
                        cmd.Parameters.AddWithValue("@P_PROPERMESFIN", proyecto.ProPerMesFin);  
                        cmd.Parameters.AddWithValue("@P_PROINVSUBACT", "N");  
                        cmd.Parameters.AddWithValue("@P_USUING", "Usuario");
                        cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                        cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                        cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                        cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                        cmd.Parameters.AddWithValue("@P_USUAPE_U", "GAGO");

                        pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                        pDescripcionMensaje.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(pDescripcionMensaje);

                        pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                        pTipoMensaje.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(pTipoMensaje);

                        pAno = new SqlParameter("@P_PROANO_OUT", SqlDbType.NVarChar, 4);
                        pAno.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(pAno);

                        pCod = new SqlParameter("@P_PROCOD_OUT", SqlDbType.Char, 6);
                        pCod.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(pCod);

                        cmd.ExecuteNonQuery();

                        var proAno = pAno.Value.ToString();
                        var proCod = pCod.Value.ToString();
                        message = pDescripcionMensaje.Value.ToString();
                        messageType = pTipoMensaje.Value.ToString();

                        // Inserta el beneficiario
                        if (messageType != "3")
                        {
                            Console.WriteLine(message);
                            throw new Exception(message);
                        }

                        foreach (var implementador in implementadores)
                        {
                            cmd = new SqlCommand("SP_INSERTAR_PROYECTO_IMPLEMENTADOR", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@P_PROANO", proAno);
                            cmd.Parameters.AddWithValue("@P_PROCOD", proCod);
                            cmd.Parameters.AddWithValue("@P_IMPCOD", implementador.ImpCod);
                            cmd.Parameters.AddWithValue("@P_USUING", "Usuario");
                            cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                            cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                            cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                            cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                            cmd.Parameters.AddWithValue("@P_USUAPE_U", "GAGO");

                            pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                            pDescripcionMensaje.Direction = ParameterDirection.Output;
                            cmd.Parameters.Add(pDescripcionMensaje);

                            pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                            pTipoMensaje.Direction = ParameterDirection.Output;
                            cmd.Parameters.Add(pTipoMensaje);


                            // Actualiza el DocumentoBeneficiario con los IDs del beneficiario insertado
                            message = pDescripcionMensaje.Value.ToString();
                            messageType = pTipoMensaje.Value.ToString();

                            // Inserta el DocumentoBeneficiario
                            if (messageType != "3")
                            {
                                Console.WriteLine(message);
                                throw new Exception(message);
                            }
                        }

                        // Inserta cada DocumentoBeneficiario
                        foreach (var ubicacion in ubicaciones)
                        {
                            cmd = new SqlCommand("SP_INSERTAR_PROYECTO_UBICACION", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@P_PROANO", proAno);
                            cmd.Parameters.AddWithValue("@P_PROCOD", proCod);
                            cmd.Parameters.AddWithValue("@P_UBIANO", ubicacion.UbiAno);
                            cmd.Parameters.AddWithValue("@P_UBICOD", ubicacion.UbiCod);
                            cmd.Parameters.AddWithValue("@P_USUING", "Usuario");
                            cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                            cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                            cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                            cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                            cmd.Parameters.AddWithValue("@P_USUAPE_U", "GAGO");

                            pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                            pDescripcionMensaje.Direction = ParameterDirection.Output;
                            cmd.Parameters.Add(pDescripcionMensaje);

                            pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                            pTipoMensaje.Direction = ParameterDirection.Output;
                            cmd.Parameters.Add(pTipoMensaje);

                            message = pDescripcionMensaje.Value.ToString();
                            messageType = pTipoMensaje.Value.ToString();

                            // Inserta el DocumentoBeneficiario
                            if (messageType != "3")
                            {
                                Console.WriteLine(message);
                                throw new Exception(message);
                            }
                        }

                        // Si todas las operaciones fueron exitosas, confirma la transacción
                        scope.Complete();
                        mensaje = message;
                        tipoMensaje = "3";
                    }
                    catch (Exception ex)
                    {
                        // Si alguna operación falló, la transacción se revierte.
                        mensaje = ex.Message;
                        tipoMensaje = "1";
                        Console.WriteLine(ex);
                    }
                }
            }

            return (mensaje, tipoMensaje);
        }


    }
}