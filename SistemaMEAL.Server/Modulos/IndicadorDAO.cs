using Microsoft.Data.SqlClient;
using System.Data;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;
using Newtonsoft.Json;
using System.Text;
using System.Transactions;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace SistemaMEAL.Modulos
{
    public class IndicadorDAO
    {
        private conexionDAO cn = new conexionDAO();

        public IEnumerable<Indicador> Buscar(ClaimsIdentity? identity, string? actAno = null, string? actCod = null,string? indAno = null, string? indCod = null, string? indNom = null, string? indNum = null, string? indTipInd = null, string? uniCod = null, string? tipValCod = null)
        {
            List<Indicador>? temporal = new List<Indicador>();
            try
            {
                var userClaims = new UserClaims().GetClaimsFromIdentity(identity);
                
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
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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

        // CASO PRESUPUESTO
        public IEnumerable<Indicador> BuscarIndicadorPorSubproyectoActividad(string? subProAno, string? subProCod)
        {
            List<Indicador>? temporal = new List<Indicador>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_INDICADOR_SUB_PROYECTO_ACTIVIDAD", cn.getcn);
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
        
        public IEnumerable<CadenaIndicador> BuscarCadenaPorPeriodoActividad(string? subProAno, string? subProCod)
        {
            List<CadenaIndicador>? temporal = new List<CadenaIndicador>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_CADENA_PERIODO_ACTIVIDAD", cn.getcn);
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
        public IEnumerable<CadenaIndicador> BuscarCadenaPorImplementadorActividad(string? subProAno, string? subProCod)
        {
            List<CadenaIndicador>? temporal = new List<CadenaIndicador>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_CADENA_IMPLEMENTADOR_ACTIVIDAD", cn.getcn);
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
        public IEnumerable<CadenaFinanciador> BuscarCadenaPorFinanciadorActividad(string? subProAno, string? subProCod)
        {
            List<CadenaFinanciador>? temporal = new List<CadenaFinanciador>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_CADENA_FINANCIADOR_ACTIVIDAD", cn.getcn);
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
                    }
                }
                // Deserializa la cadena JSON en una lista de objetos Estado
                temporal = JsonConvert.DeserializeObject<List<CadenaFinanciador>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<CadenaFinanciador>();
        }
        public IEnumerable<CadenaIndicador> BuscarCadenaPorUbicacionActividad(string? subProAno, string? subProCod)
        {
            List<CadenaIndicador>? temporal = new List<CadenaIndicador>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_CADENA_UBICACION_ACTIVIDAD", cn.getcn);
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

        public (string? anoOut,string? codOut,string? message, string? messageType) Insertar(ClaimsIdentity? identity, Indicador indicador)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

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
                            cmd.Parameters.AddWithValue("@P_USUING", userClaims.UsuNomUsu);
                            cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                            cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                            cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                            cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                            cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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
                        cmd.Parameters.AddWithValue("@P_INDTOTPRE", "");
                        cmd.Parameters.AddWithValue("@P_MONCOD", "00");
                        cmd.Parameters.AddWithValue("@P_USUING", userClaims.UsuNomUsu);
                        cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                        cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                        cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                        cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                        cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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

                        cmd = new SqlCommand("SP_BUSCAR_SUB_PROYECTO", cn.getcn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@P_SUBPROANO", indicador.SubProAno);
                        cmd.Parameters.AddWithValue("@P_SUBPROCOD", indicador.SubProCod);
                        cmd.Parameters.AddWithValue("@P_PROANO", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_PROCOD", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_SUBPRONOM", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_SUBPROSAP", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_SUBPROINVSUBACT", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_SUBPRORES", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_SUBPROPERANOINI", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_SUBPROPERMESINI", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_SUBPROPERANOFIN", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_SUBPROPERMESFIN", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                        cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                        cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                        cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                        cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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
                            int anoIni = int.Parse(subProyecto.SubProPerAnoIni);
                            int anoFin = int.Parse(subProyecto.SubProPerAnoFin);

                            // Itera a través de los años desde anoIni hasta anoFin
                            for (int ano = anoIni; ano <= anoFin; ano++)
                            {
                                // Aquí puedes realizar tu operación de inserción
                                cmd = new SqlCommand("SP_INSERTAR_CADENA_RESULTADO_PERIODO", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.AddWithValue("@P_INDANO", indAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD", indCod);
                                cmd.Parameters.AddWithValue("@P_CADRESPERANO", ano);
                                cmd.Parameters.AddWithValue("@P_CADRESPERMETTEC", "");
                                cmd.Parameters.AddWithValue("@P_CADRESPERMETPRE", "");
                                cmd.Parameters.AddWithValue("@P_USUING", userClaims.UsuNomUsu);
                                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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
                        cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                        cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                        cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                        cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                        cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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
                                cmd.Parameters.AddWithValue("@P_CADRESIMPMETTEC", "");
                                cmd.Parameters.AddWithValue("@P_CADRESIMPMETPRE", "");
                                cmd.Parameters.AddWithValue("@P_USUING", userClaims.UsuNomUsu);
                                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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

                        //
                        cmd = new SqlCommand("SP_BUSCAR_SUB_PROYECTO_FINANCIADOR", cn.getcn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@P_FINCOD", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_SUBPROANO", indicador.SubProAno);
                        cmd.Parameters.AddWithValue("@P_SUBPROCOD", indicador.SubProCod);
                        cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                        cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                        cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                        cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                        cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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
                        List<Financiador>? financiadores = JsonConvert.DeserializeObject<List<Financiador>>(jsonResult.ToString());
                        if (financiadores.Count > 0)
                        {
                            foreach (var financiador in financiadores)
                            {
                                cmd = new SqlCommand("SP_INSERTAR_CADENA_RESULTADO_FINANCIADOR", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.AddWithValue("@P_INDANO", indAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD", indCod);
                                cmd.Parameters.AddWithValue("@P_FINCOD", financiador.FinCod);
                                cmd.Parameters.AddWithValue("@P_CADRESFINMETPRE", "");
                                cmd.Parameters.AddWithValue("@P_USUING", userClaims.UsuNomUsu);
                                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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
                        cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                        cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                        cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                        cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                        cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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
                                cmd.Parameters.AddWithValue("@P_CADRESUBIMETTEC", "");
                                cmd.Parameters.AddWithValue("@P_CADRESUBIMETPRE", "");
                                cmd.Parameters.AddWithValue("@P_USUING", userClaims.UsuNomUsu);
                                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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

        public (string? message, string? messageType) Modificar(ClaimsIdentity? identity, Indicador indicador)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

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
                cmd.Parameters.AddWithValue("@P_USUMOD", userClaims.UsuNomUsu);
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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

        public (string? message, string? messageType) Eliminar(ClaimsIdentity? identity, Indicador indicador)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? tipoMensajeRes = "";
            string? mensajeRes = "";

            string? mensaje = "";
            string? tipoMensaje = "";


             using (TransactionScope scope = new TransactionScope())
            {
                using (SqlConnection connection = cn.getcn)
                {
                    try
                    {
                        SqlCommand cmd;
                        SqlParameter pDescripcionMensaje;
                        SqlParameter pTipoMensaje;
                        StringBuilder jsonResult;
                        SqlDataReader reader;
                        List<Indicador>? indicadores = null;

                        if (connection.State == ConnectionState.Closed)
                        {
                            connection.Open();
                        }

                        cmd = new SqlCommand("SP_ELIMINAR_INDICADOR", cn.getcn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@P_INDANO", indicador.IndAno);
                        cmd.Parameters.AddWithValue("@P_INDCOD", indicador.IndCod);
                        cmd.Parameters.AddWithValue("@P_USUMOD", userClaims.UsuNomUsu);
                        cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                        cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                        cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                        cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                        cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

                        pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                        pDescripcionMensaje.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(pDescripcionMensaje);

                        pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                        pTipoMensaje.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(pTipoMensaje);

                        cmd.ExecuteNonQuery();

                        mensaje = pDescripcionMensaje.Value.ToString();
                        tipoMensaje = pTipoMensaje.Value.ToString();

                        if (tipoMensaje != "3")
                        {
                            Console.WriteLine(mensaje);
                            throw new Exception(mensaje);
                        }

                        cmd = new SqlCommand("SP_ELIMINAR_CADENA_RESULTADO_PERIODO_GENERAL", cn.getcn);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@P_INDANO", indicador.IndAno);
                        cmd.Parameters.AddWithValue("@P_INDCOD", indicador.IndCod);
                        cmd.Parameters.AddWithValue("@P_USUMOD", userClaims.UsuNomUsu);
                        cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                        cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                        cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                        cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                        cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

                        pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                        pDescripcionMensaje.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(pDescripcionMensaje);
                        pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                        pTipoMensaje.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(pTipoMensaje);

                        cmd.ExecuteNonQuery();

                        mensajeRes = pDescripcionMensaje.Value.ToString();
                        tipoMensajeRes = pTipoMensaje.Value.ToString();

                        if (tipoMensajeRes != "3")
                        {
                            Console.WriteLine(mensajeRes);
                            throw new Exception(mensajeRes);
                        }

                        cmd = new SqlCommand("SP_ELIMINAR_CADENA_RESULTADO_IMPLEMENTADOR_GENERAL", cn.getcn);

                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@P_INDANO", indicador.IndAno);
                        cmd.Parameters.AddWithValue("@P_INDCOD", indicador.IndCod);
                        cmd.Parameters.AddWithValue("@P_USUMOD", userClaims.UsuNomUsu);
                        cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                        cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                        cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                        cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                        cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

                        pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                        pDescripcionMensaje.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(pDescripcionMensaje);
                        pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                        pTipoMensaje.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(pTipoMensaje);

                        cmd.ExecuteNonQuery();

                        mensajeRes = pDescripcionMensaje.Value.ToString();
                        tipoMensajeRes = pTipoMensaje.Value.ToString();

                        if (tipoMensajeRes != "3")
                        {
                            Console.WriteLine(mensajeRes);
                            throw new Exception(mensajeRes);
                        }

                        cmd = new SqlCommand("SP_ELIMINAR_CADENA_RESULTADO_FINANCIADOR_GENERAL", cn.getcn);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@P_INDANO", indicador.IndAno);
                        cmd.Parameters.AddWithValue("@P_INDCOD", indicador.IndCod);
                        cmd.Parameters.AddWithValue("@P_USUMOD", userClaims.UsuNomUsu);
                        cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                        cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                        cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                        cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                        cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

                        pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                        pDescripcionMensaje.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(pDescripcionMensaje);
                        pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                        pTipoMensaje.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(pTipoMensaje);
                        cmd.ExecuteNonQuery();
                        mensajeRes = pDescripcionMensaje.Value.ToString();
                        tipoMensajeRes = pTipoMensaje.Value.ToString();

                        if (tipoMensajeRes != "3")
                        {
                            Console.WriteLine(mensajeRes);
                            throw new Exception(tipoMensajeRes);
                        }

                        cmd = new SqlCommand("SP_ELIMINAR_CADENA_RESULTADO_UBICACION_GENERAL", cn.getcn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@P_INDANO", indicador.IndAno);
                        cmd.Parameters.AddWithValue("@P_INDCOD", indicador.IndCod);
                        cmd.Parameters.AddWithValue("@P_USUMOD", userClaims.UsuNomUsu);
                        cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                        cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                        cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                        cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                        cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);
                        pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                        pDescripcionMensaje.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(pDescripcionMensaje);
                        pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                        pTipoMensaje.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(pTipoMensaje);

                        cmd.ExecuteNonQuery();

                        mensajeRes = pDescripcionMensaje.Value.ToString();
                        tipoMensajeRes = pTipoMensaje.Value.ToString();

                        if (tipoMensajeRes != "3")
                        {
                            Console.WriteLine(mensajeRes);
                            throw new Exception(mensajeRes);
                        }

                        // Si todas las operaciones fueron exitosas, confirma la transacción
                        scope.Complete();
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

        public (string? message, string? messageType) ModificarCadenaIndicadorTecnico(ClaimsIdentity? identity, List<CadenaPeriodo> cadenaPeriodos, List<CadenaImplementador> cadenaImplementadores, List<CadenaUbicacion> cadenaUbicaciones)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";

            string? message = "No se realizaron cambios.";
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

                        if (connection.State == ConnectionState.Closed)
                        {
                            connection.Open();
                        }
                        if (cadenaPeriodos.Count > 0)
                        {
                            foreach (var periodo in cadenaPeriodos)
                            {
                                cmd = new SqlCommand("SP_MODIFICAR_CADENA_RESULTADO_PERIODO_PROGRAMATICO", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.AddWithValue("@P_INDANO", periodo.IndAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD", periodo.IndCod);
                                cmd.Parameters.AddWithValue("@P_CADRESPERANO", periodo.CadResPerAno);
                                cmd.Parameters.AddWithValue("@P_INDANO_ORIGINAL", periodo.IndAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD_ORIGINAL", periodo.IndCod);
                                cmd.Parameters.AddWithValue("@P_CADRESPERANO_ORIGINAL", periodo.CadResPerAno);
                                cmd.Parameters.AddWithValue("@P_CADRESPERMETTEC", periodo.CadResPerMetTec);
                                cmd.Parameters.AddWithValue("@P_USUMOD", userClaims.UsuNomUsu);
                                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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
                                } else {
                                    Console.WriteLine("Insertado");

                                }
                            }
                        }

                        if (cadenaImplementadores.Count > 0)
                        {
                            foreach (var implementador in cadenaImplementadores)
                            {
                                cmd = new SqlCommand("SP_MODIFICAR_CADENA_RESULTADO_IMPLEMENTADOR_PROGRAMATICO", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.AddWithValue("@P_INDANO", implementador.IndAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD", implementador.IndCod);
                                cmd.Parameters.AddWithValue("@P_IMPCOD", implementador.ImpCod);
                                cmd.Parameters.AddWithValue("@P_INDANO_ORIGINAL", implementador.IndAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD_ORIGINAL", implementador.IndCod);
                                cmd.Parameters.AddWithValue("@P_IMPCOD_ORIGINAL", implementador.ImpCod);
                                cmd.Parameters.AddWithValue("@P_CADRESIMPMETTEC", implementador.CadResImpMetTec);
                                cmd.Parameters.AddWithValue("@P_USUMOD", userClaims.UsuNomUsu);
                                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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
                        if (cadenaUbicaciones.Count > 0)
                        {
                            foreach (var ubicacion in cadenaUbicaciones)
                            {
                                cmd = new SqlCommand("SP_MODIFICAR_CADENA_RESULTADO_UBICACION_PROGRAMATICO", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.AddWithValue("@P_INDANO", ubicacion.IndAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD", ubicacion.IndCod);
                                cmd.Parameters.AddWithValue("@P_UBIANO", ubicacion.UbiAno);
                                cmd.Parameters.AddWithValue("@P_UBICOD", ubicacion.UbiCod);
                                cmd.Parameters.AddWithValue("@P_INDANO_ORIGINAL", ubicacion.IndAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD_ORIGINAL", ubicacion.IndCod);
                                cmd.Parameters.AddWithValue("@P_UBIANO_ORIGINAL", ubicacion.UbiAno);
                                cmd.Parameters.AddWithValue("@P_UBICOD_ORIGINAL", ubicacion.UbiCod);
                                cmd.Parameters.AddWithValue("@P_CADRESUBIMETTEC", ubicacion.CadResUbiMetTec);
                                cmd.Parameters.AddWithValue("@P_USUMOD", userClaims.UsuNomUsu);
                                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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
        public (string? message, string? messageType) ModificarCadenaIndicadorPresupuesto(ClaimsIdentity? identity, List<CadenaPeriodo> cadenaPeriodos, List<CadenaImplementador> cadenaImplementadores, List<CadenaFinanciador> cadenaFinanciadores, List<CadenaUbicacion> cadenaUbicaciones)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";

            string? message = "No se realizaron cambios.";
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

                        if (connection.State == ConnectionState.Closed)
                        {
                            connection.Open();
                        }
                        if (cadenaPeriodos.Count > 0)
                        {
                            foreach (var periodo in cadenaPeriodos)
                            {
                                cmd = new SqlCommand("SP_MODIFICAR_CADENA_RESULTADO_PERIODO_PRESUPUESTO", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.AddWithValue("@P_INDANO", periodo.IndAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD", periodo.IndCod);
                                cmd.Parameters.AddWithValue("@P_CADRESPERANO", periodo.CadResPerAno);
                                cmd.Parameters.AddWithValue("@P_INDANO_ORIGINAL", periodo.IndAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD_ORIGINAL", periodo.IndCod);
                                cmd.Parameters.AddWithValue("@P_CADRESPERANO_ORIGINAL", periodo.CadResPerAno);
                                cmd.Parameters.AddWithValue("@P_CADRESPERMETPRE", periodo.CadResPerMetPre);
                                cmd.Parameters.AddWithValue("@P_USUMOD", userClaims.UsuNomUsu);
                                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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
                                } else {
                                    Console.WriteLine("Insertado");

                                }
                            }
                        }

                        if (cadenaFinanciadores.Count > 0)
                        {
                            foreach (var financiador in cadenaFinanciadores)
                            {
                                cmd = new SqlCommand("SP_MODIFICAR_CADENA_RESULTADO_FINANCIADOR_PRESUPUESTO", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.AddWithValue("@P_INDANO", financiador.IndAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD", financiador.IndCod);
                                cmd.Parameters.AddWithValue("@P_FINCOD", financiador.FinCod);
                                cmd.Parameters.AddWithValue("@P_INDANO_ORIGINAL", financiador.IndAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD_ORIGINAL", financiador.IndCod);
                                cmd.Parameters.AddWithValue("@P_FINCOD_ORIGINAL", financiador.FinCod);
                                cmd.Parameters.AddWithValue("@P_CADRESFINMETPRE", financiador.CadResFinMetPre);
                                cmd.Parameters.AddWithValue("@P_USUMOD", userClaims.UsuNomUsu);
                                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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
                        if (cadenaImplementadores.Count > 0)
                        {
                            foreach (var implementador in cadenaImplementadores)
                            {
                                cmd = new SqlCommand("SP_MODIFICAR_CADENA_RESULTADO_IMPLEMENTADOR_PRESUPUESTO", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.AddWithValue("@P_INDANO", implementador.IndAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD", implementador.IndCod);
                                cmd.Parameters.AddWithValue("@P_IMPCOD", implementador.ImpCod);
                                cmd.Parameters.AddWithValue("@P_INDANO_ORIGINAL", implementador.IndAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD_ORIGINAL", implementador.IndCod);
                                cmd.Parameters.AddWithValue("@P_IMPCOD_ORIGINAL", implementador.ImpCod);
                                cmd.Parameters.AddWithValue("@P_CADRESIMPMETPRE", implementador.CadResImpMetPre);
                                cmd.Parameters.AddWithValue("@P_USUMOD", userClaims.UsuNomUsu);
                                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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
                        if (cadenaUbicaciones.Count > 0)
                        {
                            foreach (var ubicacion in cadenaUbicaciones)
                            {
                                cmd = new SqlCommand("SP_MODIFICAR_CADENA_RESULTADO_UBICACION_PRESUPUESTO", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.AddWithValue("@P_INDANO", ubicacion.IndAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD", ubicacion.IndCod);
                                cmd.Parameters.AddWithValue("@P_UBIANO", ubicacion.UbiAno);
                                cmd.Parameters.AddWithValue("@P_UBICOD", ubicacion.UbiCod);
                                cmd.Parameters.AddWithValue("@P_INDANO_ORIGINAL", ubicacion.IndAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD_ORIGINAL", ubicacion.IndCod);
                                cmd.Parameters.AddWithValue("@P_UBIANO_ORIGINAL", ubicacion.UbiAno);
                                cmd.Parameters.AddWithValue("@P_UBICOD_ORIGINAL", ubicacion.UbiCod);
                                cmd.Parameters.AddWithValue("@P_CADRESUBIMETPRE", ubicacion.CadResUbiMetPre);
                                cmd.Parameters.AddWithValue("@P_USUMOD", userClaims.UsuNomUsu);
                                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

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
