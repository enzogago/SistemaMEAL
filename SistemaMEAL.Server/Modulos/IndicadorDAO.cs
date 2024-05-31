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

        public IEnumerable<Indicador> Buscar(ClaimsIdentity? identity, string? actAno = null, string? actCod = null,string? indAno = null, string? indCod = null, string? indNom = null, string? indNum = null, string? indTipInd = null, string? uniCod = null, string? tipValCod = null, string? indTotPre = null, string? monCod = null, string? indLinBas = null, string? indFor = null, string? subProAno = null, string? subProCod = null)
        {
            List<Indicador>? temporal = new List<Indicador>();
            try
            {
                var userClaims = new UserClaims().GetClaimsFromIdentity(identity);
                
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_INDICADOR", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_SUBPROANO", string.IsNullOrEmpty(subProAno) ? (object)DBNull.Value : subProAno);
                cmd.Parameters.AddWithValue("@P_SUBPROCOD", string.IsNullOrEmpty(subProCod) ? (object)DBNull.Value : subProCod);
                cmd.Parameters.AddWithValue("@P_INDANO", string.IsNullOrEmpty(indAno) ? (object)DBNull.Value : indAno);
                cmd.Parameters.AddWithValue("@P_INDCOD", string.IsNullOrEmpty(indCod) ? (object)DBNull.Value : indCod);
                cmd.Parameters.AddWithValue("@P_ACTANO", string.IsNullOrEmpty(actAno) ? (object)DBNull.Value : actAno);
                cmd.Parameters.AddWithValue("@P_ACTCOD", string.IsNullOrEmpty(actCod) ? (object)DBNull.Value : actCod);
                cmd.Parameters.AddWithValue("@P_INDNOM", string.IsNullOrEmpty(indNom) ? (object)DBNull.Value : indNom);
                cmd.Parameters.AddWithValue("@P_INDNUM", string.IsNullOrEmpty(indNum) ? (object)DBNull.Value : indNum);
                cmd.Parameters.AddWithValue("@P_INDTIPIND", string.IsNullOrEmpty(indTipInd) ? (object)DBNull.Value : indTipInd);
                cmd.Parameters.AddWithValue("@P_UNICOD", string.IsNullOrEmpty(uniCod) ? (object)DBNull.Value : uniCod);
                cmd.Parameters.AddWithValue("@P_TIPVALCOD", string.IsNullOrEmpty(tipValCod) ? (object)DBNull.Value : tipValCod);
                cmd.Parameters.AddWithValue("@P_INDTOTPRE", string.IsNullOrEmpty(indTotPre) ? (object)DBNull.Value : indTotPre);
                cmd.Parameters.AddWithValue("@P_MONCOD", string.IsNullOrEmpty(monCod) ? (object)DBNull.Value : monCod);
                cmd.Parameters.AddWithValue("@P_INDLINBAS", string.IsNullOrEmpty(indLinBas) ? (object)DBNull.Value : indLinBas);
                cmd.Parameters.AddWithValue("@P_INDFOR", string.IsNullOrEmpty(indFor) ? (object)DBNull.Value : indFor);
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

        public IEnumerable<Indicador> BuscarIndicadorPorSubproyecto(ClaimsIdentity? identity, string? subProAno, string? subProCod)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);
            
            List<Indicador>? temporal = new List<Indicador>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_INDICADOR", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_SUBPROANO", string.IsNullOrEmpty(subProAno) ? (object)DBNull.Value : subProAno);
                cmd.Parameters.AddWithValue("@P_SUBPROCOD", string.IsNullOrEmpty(subProCod) ? (object)DBNull.Value : subProCod);
                cmd.Parameters.AddWithValue("@P_INDANO", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_INDCOD", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_ACTANO", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_ACTCOD", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_INDNOM", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_INDNUM", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_INDTIPIND", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_UNICOD", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_TIPVALCOD", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_INDTOTPRE", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_MONCOD", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_INDLINBAS", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_INDFOR", (object)DBNull.Value);
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
        
        public IEnumerable<CadenaIndicador> BuscarCadenaPorPeriodo(ClaimsIdentity? identity, string? subProAno = null, string? subProCod = null, string? indAno = null, string? indCod = null, string? indTipInd = null, string? carResPerAno = null, string? cadResPerMetTec = null, string? cadResPerMetPre = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);
            
            List<CadenaIndicador>? temporal = new List<CadenaIndicador>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_CADENA_RESULTADO_PERIODO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_INDANO", string.IsNullOrEmpty(indAno) ? (object)DBNull.Value : indAno);
                cmd.Parameters.AddWithValue("@P_INDCOD", string.IsNullOrEmpty(indCod) ? (object)DBNull.Value : indCod);
                cmd.Parameters.AddWithValue("@P_INDTIPIND", string.IsNullOrEmpty(indTipInd) ? (object)DBNull.Value : indTipInd);
                cmd.Parameters.AddWithValue("@P_SUBPROANO", string.IsNullOrEmpty(subProAno) ? (object)DBNull.Value : subProAno);
                cmd.Parameters.AddWithValue("@P_SUBPROCOD", string.IsNullOrEmpty(subProCod) ? (object)DBNull.Value : subProCod);
                cmd.Parameters.AddWithValue("@P_CADRESPERANO", string.IsNullOrEmpty(carResPerAno) ? (object)DBNull.Value : carResPerAno);
                cmd.Parameters.AddWithValue("@P_CADRESPERMETTEC", string.IsNullOrEmpty(cadResPerMetTec) ? (object)DBNull.Value : cadResPerMetTec);
                cmd.Parameters.AddWithValue("@P_CADRESPERMETPRE", string.IsNullOrEmpty(cadResPerMetPre) ? (object)DBNull.Value : cadResPerMetPre);
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

        public IEnumerable<CadenaIndicador> BuscarCadenaPorImplementador(ClaimsIdentity? identity, string? subProAno = null, string? subProCod = null, string? indAno = null, string? indCod = null, string? indTipInd = null, string? impCod = null, string? cadResImpMetTec = null, string? cadResImpMetPre = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);
            List<CadenaIndicador>? temporal = new List<CadenaIndicador>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_CADENA_RESULTADO_IMPLEMENTADOR", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_INDANO", string.IsNullOrEmpty(indAno) ? (object)DBNull.Value : indAno);
                cmd.Parameters.AddWithValue("@P_INDCOD", string.IsNullOrEmpty(indCod) ? (object)DBNull.Value : indCod);
                cmd.Parameters.AddWithValue("@P_IMPCOD", string.IsNullOrEmpty(impCod) ? (object)DBNull.Value : impCod);
                cmd.Parameters.AddWithValue("@P_CADRESIMPMETTEC", string.IsNullOrEmpty(cadResImpMetTec) ? (object)DBNull.Value : cadResImpMetTec);
                cmd.Parameters.AddWithValue("@P_CADRESIMPMETPRE", string.IsNullOrEmpty(cadResImpMetPre) ? (object)DBNull.Value : cadResImpMetPre);
                cmd.Parameters.AddWithValue("@P_INDTIPIND", string.IsNullOrEmpty(indTipInd) ? (object)DBNull.Value : indTipInd);
                cmd.Parameters.AddWithValue("@P_SUBPROANO", string.IsNullOrEmpty(subProAno) ? (object)DBNull.Value : subProAno);
                cmd.Parameters.AddWithValue("@P_SUBPROCOD", string.IsNullOrEmpty(subProCod) ? (object)DBNull.Value : subProCod);
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
        public IEnumerable<CadenaIndicador> BuscarCadenaPorUbicacion(ClaimsIdentity? identity, string? subProAno = null, string? subProCod = null, string? indAno = null, string? indCod = null, string? indTipInd = null, string? ubiAno = null, string? ubiCod = null, string? cadResUbiMetTec = null, string? cadResUbiMetPre = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            List<CadenaIndicador>? temporal = new List<CadenaIndicador>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_CADENA_RESULTADO_UBICACION", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_INDANO", string.IsNullOrEmpty(indAno) ? (object)DBNull.Value : indAno);
                cmd.Parameters.AddWithValue("@P_INDCOD", string.IsNullOrEmpty(indCod) ? (object)DBNull.Value : indCod);
                cmd.Parameters.AddWithValue("@P_UBIANO", string.IsNullOrEmpty(ubiAno) ? (object)DBNull.Value : ubiAno);
                cmd.Parameters.AddWithValue("@P_UBICOD", string.IsNullOrEmpty(ubiCod) ? (object)DBNull.Value : ubiCod);
                cmd.Parameters.AddWithValue("@P_CADRESUBIMETTEC", string.IsNullOrEmpty(cadResUbiMetTec) ? (object)DBNull.Value : cadResUbiMetTec);
                cmd.Parameters.AddWithValue("@P_CADRESUBIMETPRE", string.IsNullOrEmpty(cadResUbiMetPre) ? (object)DBNull.Value : cadResUbiMetPre);
                cmd.Parameters.AddWithValue("@P_INDTIPIND", string.IsNullOrEmpty(indTipInd) ? (object)DBNull.Value : indTipInd);
                cmd.Parameters.AddWithValue("@P_SUBPROANO", string.IsNullOrEmpty(subProAno) ? (object)DBNull.Value : subProAno);
                cmd.Parameters.AddWithValue("@P_SUBPROCOD", string.IsNullOrEmpty(subProCod) ? (object)DBNull.Value : subProCod);
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
        public IEnumerable<Indicador> BuscarIndicadorPorSubproyectoActividad(ClaimsIdentity? identity, string? subProAno, string? subProCod)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);


            List<Indicador>? temporal = new List<Indicador>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_INDICADOR", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@P_SUBPROANO", string.IsNullOrEmpty(subProAno) ? (object)DBNull.Value : subProAno);
                            cmd.Parameters.AddWithValue("@P_SUBPROCOD", string.IsNullOrEmpty(subProCod) ? (object)DBNull.Value : subProCod);
                            cmd.Parameters.AddWithValue("@P_INDANO", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_INDCOD", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_ACTANO", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_ACTCOD", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_INDNOM", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_INDNUM", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_INDTIPIND", "IAC");
                            cmd.Parameters.AddWithValue("@P_UNICOD", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_TIPVALCOD", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_INDTOTPRE", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_MONCOD", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_INDLINBAS", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_INDFOR", (object)DBNull.Value);
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
        public IEnumerable<CadenaFinanciador> BuscarCadenaPorFinanciador(ClaimsIdentity? identity, string? subProAno = null, string? subProCod = null, string? indAno = null, string? indCod = null, string? indTipInd = null, string? finCod = null, string? cadResFinMetPre = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);
            
            List<CadenaFinanciador>? temporal = new List<CadenaFinanciador>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_CADENA_RESULTADO_FINANCIADOR", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_INDANO", string.IsNullOrEmpty(indAno) ? (object)DBNull.Value : indAno);
                cmd.Parameters.AddWithValue("@P_INDCOD", string.IsNullOrEmpty(indCod) ? (object)DBNull.Value : indCod);
                cmd.Parameters.AddWithValue("@P_FINCOD", string.IsNullOrEmpty(finCod) ? (object)DBNull.Value : finCod);
                cmd.Parameters.AddWithValue("@P_CADRESFINMETPRE", string.IsNullOrEmpty(cadResFinMetPre) ? (object)DBNull.Value : cadResFinMetPre);
                cmd.Parameters.AddWithValue("@P_INDTIPIND", string.IsNullOrEmpty(indTipInd) ? (object)DBNull.Value : indTipInd);
                cmd.Parameters.AddWithValue("@P_SUBPROANO", string.IsNullOrEmpty(subProAno) ? (object)DBNull.Value : subProAno);
                cmd.Parameters.AddWithValue("@P_SUBPROCOD", string.IsNullOrEmpty(subProCod) ? (object)DBNull.Value : subProCod);
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

                        if (!indicador.ObjAno.IsNullOrEmpty() && !indicador.ObjCod.IsNullOrEmpty() && indicador.ObjEspAno.IsNullOrEmpty() && indicador.ObjEspCod.IsNullOrEmpty()) {
                            cmd = new SqlCommand("SP_BUSCAR_OBJETIVO_ESPECIFICO", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@P_OBJANO", indicador.ObjAno);
                            cmd.Parameters.AddWithValue("@P_OBJCOD", indicador.ObjCod);
                            cmd.Parameters.AddWithValue("@P_OBJESPANO", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_OBJESPCOD", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_OBJESPNOM", "NA");
                            cmd.Parameters.AddWithValue("@P_OBJESPNUM", "NA");
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
                            List<ObjetivoEspecifico>? objetivoEspecificos = JsonConvert.DeserializeObject<List<ObjetivoEspecifico>>(jsonResult.ToString());
                            ObjetivoEspecifico? dataObjEsp = new ObjetivoEspecifico();

                            if (objetivoEspecificos.Count > 0) {
                                dataObjEsp = objetivoEspecificos[0];
                            } else {
                                // INSERTAMOS OBJETIVO ESPECIFICO NA
                                cmd = new SqlCommand("SP_INSERTAR_OBJETIVO_ESPECIFICO", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;

                                cmd.Parameters.AddWithValue("@P_OBJANO", indicador.ObjAno);
                                cmd.Parameters.AddWithValue("@P_OBJCOD", indicador.ObjCod);
                                cmd.Parameters.AddWithValue("@P_OBJESPNOM", "NA");
                                cmd.Parameters.AddWithValue("@P_OBJESPNUM", "NA");
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

                                pAno = new SqlParameter("@P_OBJESPANO_OUT", SqlDbType.NVarChar, 4);
                                pAno.Direction = ParameterDirection.Output;
                                cmd.Parameters.Add(pAno);

                                pCod = new SqlParameter("@P_OBJESPCOD_OUT", SqlDbType.Char, 6);
                                pCod.Direction = ParameterDirection.Output;
                                cmd.Parameters.Add(pCod);

                                cmd.ExecuteNonQuery();

                                var objEspAno = pAno.Value.ToString();
                                var objEspCod = pCod.Value.ToString();
                                mensaje = pDescripcionMensaje.Value.ToString();
                                tipoMensaje = pTipoMensaje.Value.ToString();

                                if (tipoMensaje != "3")
                                {
                                    Console.WriteLine(mensaje);
                                    throw new Exception(mensaje);
                                }

                                dataObjEsp.ObjEspAno = objEspAno;
                                dataObjEsp.ObjEspCod = objEspCod;
                            }

                            cmd = new SqlCommand("SP_BUSCAR_RESULTADO", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@P_RESANO", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_RESCOD", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_OBJESPANO", dataObjEsp.ObjEspAno);
                            cmd.Parameters.AddWithValue("@P_OBJESPCOD", dataObjEsp.ObjEspCod);
                            cmd.Parameters.AddWithValue("@P_RESNOM", "NA");
                            cmd.Parameters.AddWithValue("@P_RESNUM", "NA");
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
                            List<Resultado>? resultados = JsonConvert.DeserializeObject<List<Resultado>>(jsonResult.ToString());
                            Resultado? dataRes = new Resultado();

                            if (resultados.Count > 0) {
                                dataRes = resultados[0];
                            } else {
                                // INSERTAMOS RESULTADO NA
                                cmd = new SqlCommand("SP_INSERTAR_RESULTADO", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;

                                cmd.Parameters.AddWithValue("@P_OBJESPANO", dataObjEsp.ObjEspAno);
                                cmd.Parameters.AddWithValue("@P_OBJESPCOD", dataObjEsp.ObjEspCod);
                                cmd.Parameters.AddWithValue("@P_RESNOM", "NA");
                                cmd.Parameters.AddWithValue("@P_RESNUM", "NA");
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

                                pAno = new SqlParameter("@P_RESANO_OUT", SqlDbType.NVarChar, 4);
                                pAno.Direction = ParameterDirection.Output;
                                cmd.Parameters.Add(pAno);

                                pCod = new SqlParameter("@P_RESCOD_OUT", SqlDbType.Char, 6);
                                pCod.Direction = ParameterDirection.Output;
                                cmd.Parameters.Add(pCod);

                                cmd.ExecuteNonQuery();

                                var resAno = pAno.Value.ToString();
                                var resCod = pCod.Value.ToString();
                                mensaje = pDescripcionMensaje.Value.ToString();
                                tipoMensaje = pTipoMensaje.Value.ToString();

                                // Inserta el beneficiario
                                if (tipoMensaje != "3")
                                {
                                    Console.WriteLine(mensaje);
                                    throw new Exception(mensaje);
                                }

                                dataRes.ResAno = resAno;
                                dataRes.ResCod = resCod;
                            }

                            cmd = new SqlCommand("SP_BUSCAR_ACTIVIDAD", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@P_ACTANO", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_ACTCOD", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_RESANO", dataRes.ResAno);
                            cmd.Parameters.AddWithValue("@P_RESCOD", dataRes.ResCod);
                            cmd.Parameters.AddWithValue("@P_ACTNOM", "NA");
                            cmd.Parameters.AddWithValue("@P_ACTNUM", "NA");
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
                            List<Actividad>? actividades = JsonConvert.DeserializeObject<List<Actividad>>(jsonResult.ToString());
                            Actividad? dataAct = new Actividad();

                            if (actividades.Count > 0) {
                                dataAct = actividades[0];
                            } else {
                                // INSERTAMOS ACTIVIDAD NA
                                cmd = new SqlCommand("SP_INSERTAR_ACTIVIDAD", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;

                                cmd.Parameters.AddWithValue("@P_RESANO", dataRes.ResAno);
                                cmd.Parameters.AddWithValue("@P_RESCOD", dataRes.ResCod);
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

                                dataAct.ActAno = actAno;
                                dataAct.ActCod = actCod;
                            }

                            indicador.ActAno = dataAct.ActAno;
                            indicador.ActCod = dataAct.ActCod;
                        } 
                        else if(!indicador.ObjEspAno.IsNullOrEmpty() && !indicador.ObjEspCod.IsNullOrEmpty()) 
                        {
                            cmd = new SqlCommand("SP_BUSCAR_RESULTADO", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@P_RESANO", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_RESCOD", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_OBJESPANO", indicador.ObjEspAno);
                            cmd.Parameters.AddWithValue("@P_OBJESPCOD", indicador.ObjEspCod);
                            cmd.Parameters.AddWithValue("@P_RESNOM", "NA");
                            cmd.Parameters.AddWithValue("@P_RESNUM", "NA");
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
                            List<Resultado>? resultados = JsonConvert.DeserializeObject<List<Resultado>>(jsonResult.ToString());
                            Resultado? dataRes = new Resultado();

                            if (resultados.Count > 0) {
                                dataRes = resultados[0];
                            } else {
                                // INSERTAMOS RESULTADO NA
                                cmd = new SqlCommand("SP_INSERTAR_RESULTADO", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;

                                cmd.Parameters.AddWithValue("@P_OBJESPANO", indicador.ObjEspAno);
                                cmd.Parameters.AddWithValue("@P_OBJESPCOD", indicador.ObjEspCod);
                                cmd.Parameters.AddWithValue("@P_RESNOM", "NA");
                                cmd.Parameters.AddWithValue("@P_RESNUM", "NA");
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

                                pAno = new SqlParameter("@P_RESANO_OUT", SqlDbType.NVarChar, 4);
                                pAno.Direction = ParameterDirection.Output;
                                cmd.Parameters.Add(pAno);

                                pCod = new SqlParameter("@P_RESCOD_OUT", SqlDbType.Char, 6);
                                pCod.Direction = ParameterDirection.Output;
                                cmd.Parameters.Add(pCod);

                                cmd.ExecuteNonQuery();

                                var resAno = pAno.Value.ToString();
                                var resCod = pCod.Value.ToString();
                                mensaje = pDescripcionMensaje.Value.ToString();
                                tipoMensaje = pTipoMensaje.Value.ToString();

                                // Inserta el beneficiario
                                if (tipoMensaje != "3")
                                {
                                    Console.WriteLine(mensaje);
                                    throw new Exception(mensaje);
                                }

                                dataRes.ResAno = resAno;
                                dataRes.ResCod = resCod;
                            }

                            cmd = new SqlCommand("SP_BUSCAR_ACTIVIDAD", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@P_ACTANO", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_ACTCOD", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_RESANO", dataRes.ResAno);
                            cmd.Parameters.AddWithValue("@P_RESCOD", dataRes.ResCod);
                            cmd.Parameters.AddWithValue("@P_ACTNOM", "NA");
                            cmd.Parameters.AddWithValue("@P_ACTNUM", "NA");
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
                            List<Actividad>? actividades = JsonConvert.DeserializeObject<List<Actividad>>(jsonResult.ToString());
                            Actividad? dataAct = new Actividad();

                            if (actividades.Count > 0) {
                                dataAct = actividades[0];
                            } else {
                                // INSERTAMOS ACTIVIDAD NA
                                cmd = new SqlCommand("SP_INSERTAR_ACTIVIDAD", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;

                                cmd.Parameters.AddWithValue("@P_RESANO", dataRes.ResAno);
                                cmd.Parameters.AddWithValue("@P_RESCOD", dataRes.ResCod);
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

                                dataAct.ActAno = actAno;
                                dataAct.ActCod = actCod;
                            }

                            indicador.ActAno = dataAct.ActAno;
                            indicador.ActCod = dataAct.ActCod;
                        }
                        else if (indicador.ActAno.IsNullOrEmpty() && indicador.ActCod.IsNullOrEmpty())
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

                            cmd = new SqlCommand("SP_BUSCAR_RESULTADO", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            cmd.Parameters.AddWithValue("@P_RESANO", indicador.ResAno);
                            cmd.Parameters.AddWithValue("@P_RESCOD", indicador.ResCod);
                            cmd.Parameters.AddWithValue("@P_OBJESPANO", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_OBJESPCOD", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_RESNOM", (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@P_RESNUM", (object)DBNull.Value);
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
                            List<Resultado>? temporalAct = JsonConvert.DeserializeObject<List<Resultado>>(jsonResult.ToString());
                            Resultado consultaAct = temporalAct[0];

                            var accPadAct = "PROYECTO-" + consultaAct.ProAno + "-" + consultaAct.ProCod + "-SUB_PROYECTO-" + consultaAct.SubProAno + "-" + consultaAct.SubProCod + "-OBJETIVO-" + consultaAct.ObjAno + "-" + consultaAct.ObjCod + "-OBJETIVO_ESPECIFICO-" + consultaAct.ObjEspAno + "-" + consultaAct.ObjEspCod + "-RESULTADO-" + consultaAct.ResAno + "-" + consultaAct.ResCod + "-ACTIVIDAD-" + actAno + "-" + actCod;

                            Console.WriteLine(accPadAct);

                            cmd = new SqlCommand("SP_INSERTAR_USUARIO_ACCESO", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.Parameters.AddWithValue("@P_USUANO", userClaims.UsuAno);
                            cmd.Parameters.AddWithValue("@P_USUCOD", userClaims.UsuCod);
                            cmd.Parameters.AddWithValue("@P_USUACCTIP", "ACTIVIDAD");
                            cmd.Parameters.AddWithValue("@P_USUACCANO", actAno);
                            cmd.Parameters.AddWithValue("@P_USUACCCOD", actCod);
                            cmd.Parameters.AddWithValue("@P_USUACCPAD", accPadAct);
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

                            mensaje = pDescripcionMensaje.Value.ToString();
                            tipoMensaje = pTipoMensaje.Value.ToString();

                            Console.WriteLine(mensaje);

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
                        cmd.Parameters.AddWithValue("@P_INDLINBAS", "");
                        cmd.Parameters.AddWithValue("@P_INDFOR", indicador.IndFor);
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

                        cmd = new SqlCommand("SP_BUSCAR_ACTIVIDAD", cn.getcn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@P_ACTANO", indicador.ActAno);
                        cmd.Parameters.AddWithValue("@P_ACTCOD", indicador.ActCod);
                        cmd.Parameters.AddWithValue("@P_RESANO", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_RESCOD", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_ACTNOM", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_ACTNUM", (object)DBNull.Value);
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
                        List<Actividad>? temporal = JsonConvert.DeserializeObject<List<Actividad>>(jsonResult.ToString());
                        Actividad consulta = new Actividad();

                        if (temporal.Count > 0)
                        {
                            consulta = temporal[0];
                        }

                        var accPad = "PROYECTO-" + consulta.ProAno + "-" + consulta.ProCod + "-SUB_PROYECTO-" + consulta.SubProAno + "-" + consulta.SubProCod + "-OBJETIVO-" + consulta.ObjAno + "-" + consulta.ObjCod + "-OBJETIVO_ESPECIFICO-" + consulta.ObjEspAno + "-" + consulta.ObjEspCod + "-RESULTADO-" + consulta.ResAno + "-" + consulta.ResCod + "-ACTIVIDAD-" + consulta.ActAno + "-" + consulta.ActCod + "-INDICADOR-" + indAno + "-" + indCod;     

                        cmd = new SqlCommand("SP_INSERTAR_USUARIO_ACCESO", cn.getcn);
                        cmd.CommandType = CommandType.StoredProcedure;
                        
                        cmd.Parameters.AddWithValue("@P_USUANO", userClaims.UsuAno);
                        cmd.Parameters.AddWithValue("@P_USUCOD", userClaims.UsuCod);
                        cmd.Parameters.AddWithValue("@P_USUACCTIP", "INDICADOR");
                        cmd.Parameters.AddWithValue("@P_USUACCANO", indAno);
                        cmd.Parameters.AddWithValue("@P_USUACCCOD", indCod);
                        cmd.Parameters.AddWithValue("@P_USUACCPAD", accPad);
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

                        mensaje = pDescripcionMensaje.Value.ToString();
                        tipoMensaje = pTipoMensaje.Value.ToString();

                        cmd = new SqlCommand("SP_BUSCAR_SUB_PROYECTO", cn.getcn);
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@P_SUBPROANO", indicador.SubProAno);
                        cmd.Parameters.AddWithValue("@P_SUBPROCOD", indicador.SubProCod);
                        cmd.Parameters.AddWithValue("@P_PROANO", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_PROCOD", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_SUBPRONOM", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_SUBPROSAP", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_SUBPROINVSUBACT", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_USUANO", (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@P_USUCOD", (object)DBNull.Value);
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
                cmd.Parameters.AddWithValue("@P_MONCOD", indicador.MonCod);
                cmd.Parameters.AddWithValue("@P_INDTOTPRE", indicador.IndTotPre);
                cmd.Parameters.AddWithValue("@P_INDFOR", indicador.IndFor);
                cmd.Parameters.AddWithValue("@P_INDLINBAS", indicador.IndLinBas);
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

        public (string? message, string? messageType) ModificarCadenaIndicadorTecnico(ClaimsIdentity? identity, List<CadenaPeriodo> cadenaPeriodos, List<CadenaImplementador> cadenaImplementadores, List<CadenaUbicacion> cadenaUbicaciones, List<Indicador> indicadores)
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

                        if (indicadores.Count > 0)
                        {
                            foreach (var item in indicadores)
                            {
                                cmd = new SqlCommand("SP_MODIFICAR_CADENA_RESULTADO_INDICADOR_TECNICO", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.AddWithValue("@P_INDANO", item.IndAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD", item.IndCod);
                                cmd.Parameters.AddWithValue("@P_INDLINBAS", item.IndLinBas);
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

                        if (cadenaPeriodos.Count > 0)
                        {
                            foreach (var periodo in cadenaPeriodos)
                            {
                                cmd = new SqlCommand("SP_MODIFICAR_CADENA_RESULTADO_PERIODO", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.AddWithValue("@P_INDANO", periodo.IndAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD", periodo.IndCod);
                                cmd.Parameters.AddWithValue("@P_CADRESPERANO", periodo.CadResPerAno);
                                cmd.Parameters.AddWithValue("@P_INDANO_ORIGINAL", periodo.IndAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD_ORIGINAL", periodo.IndCod);
                                cmd.Parameters.AddWithValue("@P_CADRESPERANO_ORIGINAL", periodo.CadResPerAno);
                                cmd.Parameters.AddWithValue("@P_CADRESPERMETTEC", periodo.CadResPerMetTec);
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
                                } 
                            }
                        }

                        if (cadenaImplementadores.Count > 0)
                        {
                            foreach (var implementador in cadenaImplementadores)
                            {
                                cmd = new SqlCommand("SP_MODIFICAR_CADENA_RESULTADO_IMPLEMENTADOR", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.AddWithValue("@P_INDANO", implementador.IndAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD", implementador.IndCod);
                                cmd.Parameters.AddWithValue("@P_IMPCOD", implementador.ImpCod);
                                cmd.Parameters.AddWithValue("@P_INDANO_ORIGINAL", implementador.IndAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD_ORIGINAL", implementador.IndCod);
                                cmd.Parameters.AddWithValue("@P_IMPCOD_ORIGINAL", implementador.ImpCod);
                                cmd.Parameters.AddWithValue("@P_CADRESIMPMETTEC", implementador.CadResImpMetTec);
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
                                cmd = new SqlCommand("SP_MODIFICAR_CADENA_RESULTADO_UBICACION", cn.getcn);
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
        public (string? message, string? messageType) ModificarCadenaIndicadorPresupuesto(ClaimsIdentity? identity, List<CadenaPeriodo> cadenaPeriodos, List<CadenaImplementador> cadenaImplementadores, List<CadenaFinanciador> cadenaFinanciadores, List<CadenaUbicacion> cadenaUbicaciones, List<Indicador> indicadores)
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
                        if (indicadores.Count > 0)
                        {
                            foreach (var item in indicadores)
                            {
                                cmd = new SqlCommand("SP_MODIFICAR_CADENA_RESULTADO_INDICADOR_PRESUPUESTO", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.AddWithValue("@P_INDANO", item.IndAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD", item.IndCod);
                                cmd.Parameters.AddWithValue("@P_INDTOTPRE", item.IndTotPre);
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

                        if (cadenaPeriodos.Count > 0)
                        {
                            foreach (var periodo in cadenaPeriodos)
                            {
                                cmd = new SqlCommand("SP_MODIFICAR_CADENA_RESULTADO_PERIODO", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.AddWithValue("@P_INDANO", periodo.IndAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD", periodo.IndCod);
                                cmd.Parameters.AddWithValue("@P_CADRESPERANO", periodo.CadResPerAno);
                                cmd.Parameters.AddWithValue("@P_INDANO_ORIGINAL", periodo.IndAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD_ORIGINAL", periodo.IndCod);
                                cmd.Parameters.AddWithValue("@P_CADRESPERANO_ORIGINAL", periodo.CadResPerAno);
                                cmd.Parameters.AddWithValue("@P_CADRESPERMETPRE", periodo.CadResPerMetPre);
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
                                }
                            }
                        }

                        if (cadenaFinanciadores.Count > 0)
                        {
                            foreach (var financiador in cadenaFinanciadores)
                            {
                                cmd = new SqlCommand("SP_MODIFICAR_CADENA_RESULTADO_FINANCIADOR", cn.getcn);
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
                                cmd = new SqlCommand("SP_MODIFICAR_CADENA_RESULTADO_IMPLEMENTADOR", cn.getcn);
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.AddWithValue("@P_INDANO", implementador.IndAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD", implementador.IndCod);
                                cmd.Parameters.AddWithValue("@P_IMPCOD", implementador.ImpCod);
                                cmd.Parameters.AddWithValue("@P_INDANO_ORIGINAL", implementador.IndAno);
                                cmd.Parameters.AddWithValue("@P_INDCOD_ORIGINAL", implementador.IndCod);
                                cmd.Parameters.AddWithValue("@P_IMPCOD_ORIGINAL", implementador.ImpCod);
                                cmd.Parameters.AddWithValue("@P_CADRESIMPMETPRE", implementador.CadResImpMetPre);
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
                                cmd = new SqlCommand("SP_MODIFICAR_CADENA_RESULTADO_UBICACION", cn.getcn);
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

    }
}
