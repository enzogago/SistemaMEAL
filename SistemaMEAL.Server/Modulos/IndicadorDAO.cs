using Microsoft.Data.SqlClient;
using System.Data;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;
using Newtonsoft.Json;
using System.Text;
using System.Transactions;
using Microsoft.IdentityModel.Tokens;

namespace SistemaMEAL.Modulos
{
    public class IndicadorDAO
    {
        private conexionDAO cn = new conexionDAO();

        public IEnumerable<Indicador> Buscar(string? actAno = null, string? actCod = null,string? indAno = null, string? indCod = null, string? indNom = null, string? indNum = null, string? indTipInd = null, string? uniCod = null, string? tipValCod = null)
        {
            List<Indicador>? temporal = new List<Indicador>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_INDICADOR", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_INDANO", string.IsNullOrEmpty(indAno) ? (object)DBNull.Value : indAno);
                cmd.Parameters.AddWithValue("@P_INDCOD", string.IsNullOrEmpty(indCod) ? (object)DBNull.Value : indCod);
                cmd.Parameters.AddWithValue("@P_ACTANO", string.IsNullOrEmpty(actAno) ? (object)DBNull.Value : actAno);
                cmd.Parameters.AddWithValue("@P_ACTCOD", string.IsNullOrEmpty(actCod) ? (object)DBNull.Value : actCod);
                cmd.Parameters.AddWithValue("@P_INDNOM", string.IsNullOrEmpty(indNom) ? (object)DBNull.Value : indNom);
                cmd.Parameters.AddWithValue("@P_INDNUM", string.IsNullOrEmpty(indNum) ? (object)DBNull.Value : indNum);
                cmd.Parameters.AddWithValue("@P_INDTIPIND", string.IsNullOrEmpty(indTipInd) ? (object)DBNull.Value : indTipInd);
                cmd.Parameters.AddWithValue("@P_UNICOD", string.IsNullOrEmpty(uniCod) ? (object)DBNull.Value : uniCod);
                cmd.Parameters.AddWithValue("@P_TIPVALCOD", string.IsNullOrEmpty(tipValCod) ? (object)DBNull.Value : tipValCod);
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
                temporal = JsonConvert.DeserializeObject<List<Indicador>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<Indicador>();
        }

        public IEnumerable<Indicador> BuscarIndicadorPorSubproyecto(string? subProAno, string? subProCod)
        {
            List<Indicador>? temporal = new List<Indicador>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_INDICADOR_SUB_PROYECTO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_SUBPROANO", string.IsNullOrEmpty(subProAno) ? (object)DBNull.Value : subProAno);
                cmd.Parameters.AddWithValue("@P_SUBPROCOD", string.IsNullOrEmpty(subProCod) ? (object)DBNull.Value : subProCod);

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
                        Console.WriteLine(jsonResult);
                    }
                }
                // Deserializa la cadena JSON en una lista de objetos Estado
                temporal = JsonConvert.DeserializeObject<List<Indicador>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<Indicador>();
        }
        
        public IEnumerable<CadenaIndicador> BuscarCadenaPorPeriodo(string? subProAno, string? subProCod)
        {
            List<CadenaIndicador>? temporal = new List<CadenaIndicador>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_CADENA_PERIODO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_SUBPROANO", string.IsNullOrEmpty(subProAno) ? (object)DBNull.Value : subProAno);
                cmd.Parameters.AddWithValue("@P_SUBPROCOD", string.IsNullOrEmpty(subProCod) ? (object)DBNull.Value : subProCod);

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
                        Console.WriteLine(jsonResult);
                    }
                }
                // Deserializa la cadena JSON en una lista de objetos Estado
                temporal = JsonConvert.DeserializeObject<List<CadenaIndicador>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<CadenaIndicador>();
        }
        public IEnumerable<CadenaIndicador> BuscarCadenaPorImplementador(string? subProAno, string? subProCod)
        {
            List<CadenaIndicador>? temporal = new List<CadenaIndicador>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_CADENA_IMPLEMENTADOR", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_SUBPROANO", string.IsNullOrEmpty(subProAno) ? (object)DBNull.Value : subProAno);
                cmd.Parameters.AddWithValue("@P_SUBPROCOD", string.IsNullOrEmpty(subProCod) ? (object)DBNull.Value : subProCod);

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
                        Console.WriteLine(jsonResult);
                    }
                }
                // Deserializa la cadena JSON en una lista de objetos Estado
                temporal = JsonConvert.DeserializeObject<List<CadenaIndicador>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<CadenaIndicador>();
        }
        public IEnumerable<CadenaIndicador> BuscarCadenaPorUbicacion(string? subProAno, string? subProCod)
        {
            List<CadenaIndicador>? temporal = new List<CadenaIndicador>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_CADENA_UBICACION", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_SUBPROANO", string.IsNullOrEmpty(subProAno) ? (object)DBNull.Value : subProAno);
                cmd.Parameters.AddWithValue("@P_SUBPROCOD", string.IsNullOrEmpty(subProCod) ? (object)DBNull.Value : subProCod);

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
                        Console.WriteLine(jsonResult);
                    }
                }
                // Deserializa la cadena JSON en una lista de objetos Estado
                temporal = JsonConvert.DeserializeObject<List<CadenaIndicador>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<CadenaIndicador>();
        }

        public (string? anoOut,string? codOut,string? message, string? messageType) Insertar(Indicador indicador)
        {
            string? mensaje = "";
            string? tipoMensaje = "";

            string? message;
            string? messageType;

            string? anoOut = "";
            string? codOut = "";
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
                        StringBuilder jsonResult;
                        SqlDataReader reader;

                        if (connection.State == ConnectionState.Closed)
                        {
                            connection.Open();
                        }

                        if (indicador.ActAno.IsNullOrEmpty() && indicador.ActCod.IsNullOrEmpty())
                        {
                            cmd = new SqlCommand("SP_INSERTAR_ACTIVIDAD", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@P_RESANO", indicador.ResAno);
                            cmd.Parameters.AddWithValue("@P_RESCOD", indicador.ResCod);
                            cmd.Parameters.AddWithValue("@P_ACTNOM", "NA");
                            cmd.Parameters.AddWithValue("@P_ACTNUM", "NA");
                            cmd.Parameters.AddWithValue("@P_USUING", "Usuario");
                            cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                            cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                            cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                            cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                            cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "GAGO");
                            cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "AGUIRRE");

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

                            // Inserta el beneficiario
                            if (messageType != "3")
                            {
                                Console.WriteLine(message);
                                throw new Exception(message);
                            }

                            indicador.ActAno = actAno;
                            indicador.ActCod = actCod;
                        }

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
                        cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "GAGO");
                        cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "AGUIRRE");

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

                        var indAno = pAno.Value.ToString();
                        var indCod = pCod.Value.ToString();
                        message = pDescripcionMensaje.Value.ToString();
                        messageType = pTipoMensaje.Value.ToString();

                        // Inserta el DocumentoBeneficiario
                        if (messageType != "3")
                        {
                            Console.WriteLine(message);
                            throw new Exception(message);
                        }

                        Console.WriteLine(indicador.SubProAno);
                        Console.WriteLine(indicador.SubProCod);
                        cmd = new SqlCommand("SP_BUSCAR_SUB_PROYECTO", cn.getcn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@P_SUBPROANO", indicador.SubProAno);
                        cmd.Parameters.AddWithValue("@P_SUBPROCOD", indicador.SubProCod);
                        cmd.Parameters.AddWithValue("@P_PROANO", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_PROCOD", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_SUBPRONOM", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_SUBPROSAP", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                        cmd.Parameters.AddWithValue("@P_USUANO_U", "2024");
                        cmd.Parameters.AddWithValue("@P_USUCOD_U", "0001");
                        cmd.Parameters.AddWithValue("@P_USUNOM_U", "Juan");
                        cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "Perez");
                        cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "Gomez");

                        pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                        pDescripcionMensaje.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(pDescripcionMensaje);

                        pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                        pTipoMensaje.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(pTipoMensaje);

                        jsonResult = new StringBuilder();
                        reader = cmd.ExecuteReader();
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
                        List<SubProyecto>? subProyectos = JsonConvert.DeserializeObject<List<SubProyecto>>(jsonResult.ToString());
                        if (subProyectos.Count > 0)
                        {
                            // Toma el primer SubProyecto de la lista
                            SubProyecto? subProyecto = subProyectos[0];

                            // Convierte los años a enteros
                            int anoIni = int.Parse(subProyecto.ProPerAnoIni);
                            int anoFin = int.Parse(subProyecto.ProPerAnoFin);

                            // Itera a través de los años desde anoIni hasta anoFin
                            for (int ano = anoIni; ano <= anoFin; ano++)
                            {
                                // Aquí puedes realizar tu operación de inserción
                                cmd = new SqlCommand("SP_INSERTAR_CADENA_RESULTADO_PERIODO", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.AddWithValue("@P_INDANO", indAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD", indCod);
                                cmd.Parameters.AddWithValue("@P_CADRESPERANO", ano);
                                cmd.Parameters.AddWithValue("@P_CADRESPERMETTEC", "1");
                                cmd.Parameters.AddWithValue("@P_CADRESPERMETPRE", "1");
                                cmd.Parameters.AddWithValue("@P_USUING", "Usuario");
                                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                                cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                                cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                                cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                                cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "GAGO");
                                cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "AGUIRRE");

                                pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                                pDescripcionMensaje.Direction = ParameterDirection.Output;
                                cmd.Parameters.Add(pDescripcionMensaje);

                                pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                                pTipoMensaje.Direction = ParameterDirection.Output;
                                cmd.Parameters.Add(pTipoMensaje);

                                cmd.ExecuteNonQuery();

                                message = pDescripcionMensaje.Value.ToString();
                                messageType = pTipoMensaje.Value.ToString();

                                if (messageType != "3")
                                {
                                    Console.WriteLine(message);
                                    throw new Exception(message);
                                }
                            }
                        }
                        else
                        {
                            throw new Exception("Error al insertar Indicador");
                        }

                        cmd = new SqlCommand("SP_BUSCAR_SUB_PROYECTO_IMPLEMENTADOR", cn.getcn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@P_IMPCOD", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_SUBPROANO", indicador.SubProAno);
                        cmd.Parameters.AddWithValue("@P_SUBPROCOD", indicador.SubProCod);
                        cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                        cmd.Parameters.AddWithValue("@P_USUANO_U", "2024");
                        cmd.Parameters.AddWithValue("@P_USUCOD_U", "0001");
                        cmd.Parameters.AddWithValue("@P_USUNOM_U", "Juan");
                        cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "Perez");
                        cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "Gomez");

                        pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                        pDescripcionMensaje.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(pDescripcionMensaje);

                        pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                        pTipoMensaje.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(pTipoMensaje);

                        jsonResult = new StringBuilder();
                        reader = cmd.ExecuteReader();
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
                        List<Implementador>? implementadores = JsonConvert.DeserializeObject<List<Implementador>>(jsonResult.ToString());
                        if (implementadores.Count > 0)
                        {
                            foreach (var implementador in implementadores)
                            {
                                cmd = new SqlCommand("SP_INSERTAR_CADENA_RESULTADO_IMPLEMENTADOR", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.AddWithValue("@P_INDANO", indAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD", indCod);
                                cmd.Parameters.AddWithValue("@P_IMPCOD", implementador.ImpCod);
                                cmd.Parameters.AddWithValue("@P_CADRESIMPMETTEC", "1");
                                cmd.Parameters.AddWithValue("@P_CADRESIMPMETPRE", "1");
                                cmd.Parameters.AddWithValue("@P_USUING", "Usuario");
                                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                                cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                                cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                                cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                                cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "GAGO");
                                cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "AGUIRRE");

                                pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                                pDescripcionMensaje.Direction = ParameterDirection.Output;
                                cmd.Parameters.Add(pDescripcionMensaje);

                                pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                                pTipoMensaje.Direction = ParameterDirection.Output;
                                cmd.Parameters.Add(pTipoMensaje);

                                cmd.ExecuteNonQuery();

                                message = pDescripcionMensaje.Value.ToString();
                                messageType = pTipoMensaje.Value.ToString();

                                // Inserta el DocumentoBeneficiario
                                if (messageType != "3")
                                {
                                    Console.WriteLine(message);
                                    throw new Exception(message);
                                }
                            }
                        }
                        else
                        {
                            throw new Exception("Error al insertar Indicador");
                        }

                        cmd = new SqlCommand("SP_BUSCAR_SUB_PROYECTO_UBICACION", cn.getcn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@P_UBIANO", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_UBICOD", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_SUBPROANO", indicador.SubProAno);
                        cmd.Parameters.AddWithValue("@P_SUBPROCOD", indicador.SubProCod);
                        cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                        cmd.Parameters.AddWithValue("@P_USUANO_U", "2024");
                        cmd.Parameters.AddWithValue("@P_USUCOD_U", "0001");
                        cmd.Parameters.AddWithValue("@P_USUNOM_U", "Juan");
                        cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "Perez");
                        cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "Gomez");

                        pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                        pDescripcionMensaje.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(pDescripcionMensaje);

                        pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                        pTipoMensaje.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(pTipoMensaje);

                        jsonResult = new StringBuilder();
                        reader = cmd.ExecuteReader();
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
                        List<Ubicacion>? ubicaciones = JsonConvert.DeserializeObject<List<Ubicacion>>(jsonResult.ToString());
                        if (ubicaciones.Count > 0)
                        {
                            foreach (var ubicacion in ubicaciones)
                            {
                                cmd = new SqlCommand("SP_INSERTAR_CADENA_RESULTADO_UBICACION", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.AddWithValue("@P_INDANO", indAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD", indCod);
                                cmd.Parameters.AddWithValue("@P_UBIANO", ubicacion.UbiAno);
                                cmd.Parameters.AddWithValue("@P_UBICOD", ubicacion.UbiCod);
                                cmd.Parameters.AddWithValue("@P_CADRESUBIMETTEC", "1");
                                cmd.Parameters.AddWithValue("@P_CADRESUBIMETPRE", "1");
                                cmd.Parameters.AddWithValue("@P_USUING", "Usuario");
                                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                                cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
                                cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                                cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                                cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "GAGO");
                                cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "AGUIRRE");

                                pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                                pDescripcionMensaje.Direction = ParameterDirection.Output;
                                cmd.Parameters.Add(pDescripcionMensaje);

                                pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                                pTipoMensaje.Direction = ParameterDirection.Output;
                                cmd.Parameters.Add(pTipoMensaje);

                                cmd.ExecuteNonQuery();

                                message = pDescripcionMensaje.Value.ToString();
                                messageType = pTipoMensaje.Value.ToString();

                                // Inserta el DocumentoBeneficiario
                                if (messageType != "3")
                                {
                                    Console.WriteLine(message);
                                    throw new Exception(message);
                                }
                            }
                        }
                        else
                        {
                            throw new Exception("Error al insertar Indicador");
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
            return (anoOut, codOut, mensaje, tipoMensaje);
        }

        public (string? message, string? messageType) Modificar(Indicador indicador)
        {
            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_MODIFICAR_INDICADOR", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_ACTANO", indicador.ActAno);
                cmd.Parameters.AddWithValue("@P_ACTCOD", indicador.ActCod);
                cmd.Parameters.AddWithValue("@P_INDANO", indicador.IndAno);
                cmd.Parameters.AddWithValue("@P_INDCOD", indicador.IndCod);
                cmd.Parameters.AddWithValue("@P_INDNOM", indicador.IndNom);
                cmd.Parameters.AddWithValue("@P_INDNUM", indicador.IndNum);
                cmd.Parameters.AddWithValue("@P_INDTIPIND", indicador.IndTipInd);
                cmd.Parameters.AddWithValue("@P_UNICOD", indicador.UniCod);
                cmd.Parameters.AddWithValue("@P_TIPVALCOD", indicador.TipValCod);
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
                tipoMensaje = "1";
            }
            finally
            {
                cn.getcn.Close();
            }
            return (mensaje, tipoMensaje);
        }
        public (string? message, string? messageType) Eliminar(Indicador indicador)
        {
            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_ELIMINAR_INDICADOR", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_INDANO", indicador.IndAno);
                cmd.Parameters.AddWithValue("@P_INDCOD", indicador.IndCod);
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
                tipoMensaje = "1";
            }
            finally
            {
                cn.getcn.Close();
            }
            return (mensaje, tipoMensaje);
        }

        // public (string? message, string? messageType) ModificarCadenaIndicador(List<CadenaPeriodo> cadenaPeriodos, List<CadenaImplementador> cadenaImplementadores, List<CadenaUbicacion> cadenaUbicaciones)
        // {
        //     string? mensaje = "";
        //     string? tipoMensaje = "";

        //     string? message;
        //     string? messageType;

        //     using (TransactionScope scope = new TransactionScope())
        //     {
        //         using (SqlConnection connection = cn.getcn)
        //         {
        //             try
        //             {
        //                 SqlCommand cmd;
        //                 SqlParameter pDescripcionMensaje;
        //                 SqlParameter pTipoMensaje;
        //                 SqlParameter pAno;
        //                 SqlParameter pCod;

        //                 if (connection.State == ConnectionState.Closed)
        //                 {
        //                     connection.Open();
        //                 }


        //                 cmd = new SqlCommand("SP_MODIFICAR_CADENA_RESULTADO_PERIODO", cn.getcn);
        //                 cmd.CommandType = CommandType.StoredProcedure;

        //                 cmd.Parameters.AddWithValue("@P_PROANO", subProyecto.ProAno);
        //                 cmd.Parameters.AddWithValue("@P_PROCOD", subProyecto.ProCod);
        //                 cmd.Parameters.AddWithValue("@P_SUBPRONOM", subProyecto.SubProNom);
        //                 cmd.Parameters.AddWithValue("@P_SUBPROSAP", subProyecto.SubProSap);
        //                 cmd.Parameters.AddWithValue("@P_USUING", "Usuario");
        //                 cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
        //                 cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
        //                 cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
        //                 cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
        //                 cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "GAGO");
        //                 cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "AGUIRRE");

        //                 pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
        //                 pDescripcionMensaje.Direction = ParameterDirection.Output;
        //                 cmd.Parameters.Add(pDescripcionMensaje);

        //                 pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
        //                 pTipoMensaje.Direction = ParameterDirection.Output;
        //                 cmd.Parameters.Add(pTipoMensaje);

        //                 pAno = new SqlParameter("@P_SUBPROANO_OUT", SqlDbType.NVarChar, 4);
        //                 pAno.Direction = ParameterDirection.Output;
        //                 cmd.Parameters.Add(pAno);

        //                 pCod = new SqlParameter("@P_SUBPROCOD_OUT", SqlDbType.Char, 6);
        //                 pCod.Direction = ParameterDirection.Output;
        //                 cmd.Parameters.Add(pCod);

        //                 cmd.ExecuteNonQuery();

        //                 var subProAno = pAno.Value.ToString();
        //                 var subProCod = pCod.Value.ToString();
        //                 message = pDescripcionMensaje.Value.ToString();
        //                 messageType = pTipoMensaje.Value.ToString();

        //                 // Inserta el beneficiario
        //                 if (messageType != "3")
        //                 {
        //                     Console.WriteLine(message);
        //                     throw new Exception(message);
        //                 }

        //                 foreach (var implementador in implementadores)
        //                 {
        //                     cmd = new SqlCommand("SP_INSERTAR_SUB_PROYECTO_IMPLEMENTADOR", cn.getcn);
        //                     cmd.CommandType = CommandType.StoredProcedure;
        //                     cmd.Parameters.AddWithValue("@P_SUBPROANO", subProAno);
        //                     cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProCod);
        //                     cmd.Parameters.AddWithValue("@P_IMPCOD", implementador.ImpCod);
        //                     cmd.Parameters.AddWithValue("@P_USUING", "Usuario");
        //                     cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
        //                     cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
        //                     cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
        //                     cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
        //                     cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "GAGO");
        //                     cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "AGUIRRE");

        //                     pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
        //                     pDescripcionMensaje.Direction = ParameterDirection.Output;
        //                     cmd.Parameters.Add(pDescripcionMensaje);

        //                     pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
        //                     pTipoMensaje.Direction = ParameterDirection.Output;
        //                     cmd.Parameters.Add(pTipoMensaje);

        //                     cmd.ExecuteNonQuery();

        //                     message = pDescripcionMensaje.Value.ToString();
        //                     messageType = pTipoMensaje.Value.ToString();

        //                     // Inserta el DocumentoBeneficiario
        //                     if (messageType != "3")
        //                     {
        //                         Console.WriteLine(message);
        //                         throw new Exception(message);
        //                     }
        //                 }

        //                 // Inserta cada DocumentoBeneficiario
        //                 foreach (var ubicacion in ubicaciones)
        //                 {
        //                     cmd = new SqlCommand("SP_INSERTAR_SUB_PROYECTO_UBICACION", cn.getcn);
        //                     cmd.CommandType = CommandType.StoredProcedure;

        //                     cmd.Parameters.AddWithValue("@P_SUBPROANO", subProAno);
        //                     cmd.Parameters.AddWithValue("@P_SUBPROCOD", subProCod);
        //                     cmd.Parameters.AddWithValue("@P_UBIANO", ubicacion.UbiAno);
        //                     cmd.Parameters.AddWithValue("@P_UBICOD", ubicacion.UbiCod);
        //                     cmd.Parameters.AddWithValue("@P_USUING", "Usuario");
        //                     cmd.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
        //                     cmd.Parameters.AddWithValue("@P_USUANO_U", "2023");
        //                     cmd.Parameters.AddWithValue("@P_USUCOD_U", "000001");
        //                     cmd.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
        //                     cmd.Parameters.AddWithValue("@P_USUAPEPAT_U", "GAGO");
        //                     cmd.Parameters.AddWithValue("@P_USUAPEMAT_U", "AGUIRRE");

        //                     pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
        //                     pDescripcionMensaje.Direction = ParameterDirection.Output;
        //                     cmd.Parameters.Add(pDescripcionMensaje);

        //                     pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
        //                     pTipoMensaje.Direction = ParameterDirection.Output;
        //                     cmd.Parameters.Add(pTipoMensaje);

        //                     cmd.ExecuteNonQuery();

        //                     message = pDescripcionMensaje.Value.ToString();
        //                     messageType = pTipoMensaje.Value.ToString();

        //                     // Inserta el DocumentoBeneficiario
        //                     if (messageType != "3")
        //                     {
        //                         Console.WriteLine(message);
        //                         throw new Exception(message);
        //                     }
        //                 }

        //                 // Si todas las operaciones fueron exitosas, confirma la transacción
        //                 scope.Complete();
        //                 mensaje = message;
        //                 tipoMensaje = "3";
        //             }
        //             catch (Exception ex)
        //             {
        //                 // Si alguna operación falló, la transacción se revierte.
        //                 mensaje = ex.Message;
        //                 tipoMensaje = "1";
        //                 Console.WriteLine(ex);
        //             }
        //         }
        //     }

        //     return (mensaje, tipoMensaje);
        // }

    }
}
