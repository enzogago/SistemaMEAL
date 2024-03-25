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
            Console.WriteLine(indicador.ActAno);
            Console.WriteLine(indicador.ActCod);
            if (indicador.ActAno.IsNullOrEmpty() && indicador.ActCod.IsNullOrEmpty())
            {
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

                                cmd = new SqlCommand("SP_INSERTAR_INDICADOR", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.AddWithValue("@P_ACTANO", actAno);
                                cmd.Parameters.AddWithValue("@P_ACTCOD", actCod);
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

                                message = pDescripcionMensaje.Value.ToString();
                                messageType = pTipoMensaje.Value.ToString();

                                // Inserta el DocumentoBeneficiario
                                if (messageType != "3")
                                {
                                    Console.WriteLine(message);
                                    throw new Exception(message);
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
            }
            else
            {
                try
                {
                    cn.getcn.Open();

                    SqlCommand cmd = new SqlCommand("SP_INSERTAR_INDICADOR", cn.getcn);
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

                    SqlParameter pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                    pDescripcionMensaje.Direction = ParameterDirection.Output;
                    cmd.Parameters.Add(pDescripcionMensaje);

                    SqlParameter pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                    pTipoMensaje.Direction = ParameterDirection.Output;
                    cmd.Parameters.Add(pTipoMensaje);

                    SqlParameter pAno = new SqlParameter("@P_INDANO_OUT", SqlDbType.NVarChar, 4);
                    pAno.Direction = ParameterDirection.Output;
                    cmd.Parameters.Add(pAno);

                    SqlParameter pCod = new SqlParameter("@P_INDCOD_OUT", SqlDbType.Char, 6);
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

    }
        
}
