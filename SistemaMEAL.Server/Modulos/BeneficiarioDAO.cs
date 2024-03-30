using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using SistemaMEAL.Server.Models;
using System.Data;
using System.Security.Claims;
using System.Text;
using System.Transactions;

namespace SistemaMEAL.Server.Modulos
{

    public class BeneficiarioDAO
    {
        private conexionDAO cn = new conexionDAO();

        public (string? benAnoOut,string? benCodOut,string? message, string? messageType) Insertar(ClaimsIdentity? identity, Beneficiario beneficiario)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";
            string? benAnoOut = "";
            string? benCodOut = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_INSERTAR_BENEFICIARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_BENNOM", beneficiario.BenNom);
                cmd.Parameters.AddWithValue("@P_BENAPE", beneficiario.BenApe);
                cmd.Parameters.AddWithValue("@P_BENNOMAPO", beneficiario.BenNom);
                cmd.Parameters.AddWithValue("@P_BENAPEAPO", beneficiario.BenApe);
                cmd.Parameters.AddWithValue("@P_BENFECNAC", beneficiario.BenFecNac);
                cmd.Parameters.AddWithValue("@P_BENSEX", beneficiario.BenSex);
                cmd.Parameters.AddWithValue("@P_GENCOD", beneficiario.GenCod);
                cmd.Parameters.AddWithValue("@P_NACCOD", beneficiario.NacCod);
                cmd.Parameters.AddWithValue("@P_BENCORELE", beneficiario.BenCorEle);
                cmd.Parameters.AddWithValue("@P_BENTEL", beneficiario.BenTel);
                cmd.Parameters.AddWithValue("@P_BENTELCON", beneficiario.BenTel);
                cmd.Parameters.AddWithValue("@P_BENCODUNI", beneficiario.BenCodUni);
                cmd.Parameters.AddWithValue("@P_BENDIR", beneficiario.BenDir);
                cmd.Parameters.AddWithValue("@P_BENAUT", beneficiario.BenAut);
                cmd.Parameters.AddWithValue("@P_BENFECREG", "10-02-2024");
                cmd.Parameters.AddWithValue("@P_USUING", userClaims.UsuNomUsu);
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

                SqlParameter pBenAno = new SqlParameter("@P_BENANO_OUT", SqlDbType.NVarChar, 4);
                pBenAno.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pBenAno);

                SqlParameter pBenCod = new SqlParameter("@P_BENCOD_OUT", SqlDbType.Char, 6);
                pBenCod.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pBenCod);

                cmd.ExecuteNonQuery();

                benAnoOut = pBenAno.Value.ToString();
                benCodOut = pBenCod.Value.ToString();
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
            return (benAnoOut, benCodOut, mensaje, tipoMensaje);
        }

        public (string? message, string? messageType) Modificar(ClaimsIdentity? identity, Beneficiario beneficiario)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_MODIFICAR_BENEFICIARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_BENANO", beneficiario.BenAno);
                cmd.Parameters.AddWithValue("@P_BENCOD", beneficiario.BenCod);
                cmd.Parameters.AddWithValue("@P_BENNOM", beneficiario.BenNom);
                cmd.Parameters.AddWithValue("@P_BENAPE", beneficiario.BenApe);
                cmd.Parameters.AddWithValue("@P_BENNOMAPO", beneficiario.BenNom);
                cmd.Parameters.AddWithValue("@P_BENAPEAPO", beneficiario.BenApe);
                cmd.Parameters.AddWithValue("@P_BENFECNAC", beneficiario.BenFecNac);
                cmd.Parameters.AddWithValue("@P_BENSEX", beneficiario.BenSex);
                cmd.Parameters.AddWithValue("@P_GENCOD", beneficiario.GenCod);
                cmd.Parameters.AddWithValue("@P_NACCOD", beneficiario.NacCod);
                cmd.Parameters.AddWithValue("@P_BENCORELE", beneficiario.BenCorEle);
                cmd.Parameters.AddWithValue("@P_BENTEL", beneficiario.BenTel);
                cmd.Parameters.AddWithValue("@P_BENTELCON", beneficiario.BenTelCon);
                cmd.Parameters.AddWithValue("@P_BENCODUNI", beneficiario.BenCodUni);
                cmd.Parameters.AddWithValue("@P_BENDIR", beneficiario.BenDir);
                cmd.Parameters.AddWithValue("@P_BENAUT", beneficiario.BenAut);
                cmd.Parameters.AddWithValue("@P_BENFECREG", "10-02-2024");
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

        public (string? message, string? messageType) InsertarBeneficiarioDocumento(ClaimsIdentity? identity, Beneficiario beneficiario, DocumentoBeneficiario documentoBeneficiario)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";

            using (TransactionScope scope = new TransactionScope())
            {
                try
                {
                    cn.getcn.Open();

                    // Inserta el beneficiario
                    SqlCommand cmdBeneficiario = new SqlCommand("SP_INSERTAR_BENEFICIARIO", cn.getcn);
                    cmdBeneficiario.CommandType = CommandType.StoredProcedure;
                    cmdBeneficiario.Parameters.AddWithValue("@P_BENNOM", beneficiario.BenNom);
                    cmdBeneficiario.Parameters.AddWithValue("@P_BENAPE", beneficiario.BenApe);
                    cmdBeneficiario.Parameters.AddWithValue("@P_BENNOMAPO", beneficiario.BenNomApo);
                    cmdBeneficiario.Parameters.AddWithValue("@P_BENAPEAPO", beneficiario.BenApeApo);
                    cmdBeneficiario.Parameters.AddWithValue("@P_BENFECNAC", beneficiario.BenFecNac);
                    cmdBeneficiario.Parameters.AddWithValue("@P_BENSEX", beneficiario.BenSex);
                    cmdBeneficiario.Parameters.AddWithValue("@P_GENCOD", beneficiario.GenCod);
                    cmdBeneficiario.Parameters.AddWithValue("@P_NACCOD", beneficiario.NacCod);
                    cmdBeneficiario.Parameters.AddWithValue("@P_BENCORELE", beneficiario.BenCorEle);
                    cmdBeneficiario.Parameters.AddWithValue("@P_BENTEL", beneficiario.BenTel);
                    cmdBeneficiario.Parameters.AddWithValue("@P_BENTELCON", beneficiario.BenTelCon);
                    cmdBeneficiario.Parameters.AddWithValue("@P_BENCODUNI", beneficiario.BenCodUni);
                    cmdBeneficiario.Parameters.AddWithValue("@P_BENDIR", beneficiario.BenDir);
                    cmdBeneficiario.Parameters.AddWithValue("@P_BENAUT", beneficiario.BenAut);
                    cmdBeneficiario.Parameters.AddWithValue("@P_BENFECREG", "10-02-2024");
                    cmdBeneficiario.Parameters.AddWithValue("@P_USUING", userClaims.UsuNomUsu);
                    cmdBeneficiario.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                    cmdBeneficiario.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                    cmdBeneficiario.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                    cmdBeneficiario.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                    cmdBeneficiario.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

                    SqlParameter pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                    pDescripcionMensaje.Direction = ParameterDirection.Output;
                    cmdBeneficiario.Parameters.Add(pDescripcionMensaje);

                    SqlParameter pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                    pTipoMensaje.Direction = ParameterDirection.Output;
                    cmdBeneficiario.Parameters.Add(pTipoMensaje);

                    SqlParameter pBenAno = new SqlParameter("@P_BENANO_OUT", SqlDbType.NVarChar, 4);
                    pBenAno.Direction = ParameterDirection.Output;
                    cmdBeneficiario.Parameters.Add(pBenAno);

                    SqlParameter pBenCod = new SqlParameter("@P_BENCOD_OUT", SqlDbType.Char, 6);
                    pBenCod.Direction = ParameterDirection.Output;
                    cmdBeneficiario.Parameters.Add(pBenCod);

                    cmdBeneficiario.ExecuteNonQuery();

                    var benAnoOut = pBenAno.Value.ToString();
                    var benCodOut = pBenCod.Value.ToString();

                    // Inserta el DocumentoBeneficiario
                    SqlCommand cmdDocumento = new SqlCommand("SP_INSERTAR_DOCUMENTO_IDENTIDAD_BENEFICIARIO", cn.getcn);
                    cmdDocumento.CommandType = CommandType.StoredProcedure;
                    cmdDocumento.Parameters.AddWithValue("@P_DOCIDECOD", documentoBeneficiario.DocIdeCod);
                    cmdDocumento.Parameters.AddWithValue("@P_BENANO", benAnoOut);
                    cmdDocumento.Parameters.AddWithValue("@P_BENCOD", benCodOut);
                    cmdDocumento.Parameters.AddWithValue("@P_DOCIDEBENNUM", documentoBeneficiario.DocIdeBenNum);
                    cmdDocumento.Parameters.AddWithValue("@P_USUING", userClaims.UsuNomUsu);
                    cmdDocumento.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp);
                    cmdDocumento.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno);
                    cmdDocumento.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod);
                    cmdDocumento.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom);
                    cmdDocumento.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe);

                    pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                    pDescripcionMensaje.Direction = ParameterDirection.Output;
                    cmdDocumento.Parameters.Add(pDescripcionMensaje);

                    pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
                    pTipoMensaje.Direction = ParameterDirection.Output;
                    cmdDocumento.Parameters.Add(pTipoMensaje);

                    cmdDocumento.ExecuteNonQuery();

                    // Si todas las operaciones fueron exitosas, confirma la transacción
                    scope.Complete();
                    mensaje = pDescripcionMensaje.Value.ToString();
                    tipoMensaje = pTipoMensaje.Value.ToString();
                }
                catch (SqlException ex)
                {
                    // Si alguna operación falló, la transacción se revierte.
                    mensaje = ex.Message;
                    tipoMensaje = "1";
                }
                finally
                {
                    cn.getcn.Close();
                }
            }

            return (mensaje, tipoMensaje);
        }


        public IEnumerable<Beneficiario> Listado(ClaimsIdentity? identity, string? benAno = null, string? benCod = null, string? benNom = null, string? benApe = null, string? benFecNac = null, string? benTel = null, string? benCorEle = null, string? benSex = null, string? genCod = null, string? benFecReg = null, string? benCodUni = null, string? benTelCon = null, string? benNomApo = null, string? benApeApo = null, string? nacCod = null, string? benDir = null, string? benAut = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            List<Beneficiario>? temporal = new List<Beneficiario>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_BENEFICIARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                // Aquí puedes agregar los parámetros necesarios para tu procedimiento almacenado
                cmd.Parameters.AddWithValue("@P_BENANO", string.IsNullOrEmpty(benAno) ? (object)DBNull.Value : benAno);
                cmd.Parameters.AddWithValue("@P_BENCOD", string.IsNullOrEmpty(benCod) ? (object)DBNull.Value : benCod);
                cmd.Parameters.AddWithValue("@P_BENNOM", string.IsNullOrEmpty(benNom) ? (object)DBNull.Value : benNom);
                cmd.Parameters.AddWithValue("@P_BENAPE", string.IsNullOrEmpty(benApe) ? (object)DBNull.Value : benApe);
                cmd.Parameters.AddWithValue("@P_BENFECNAC", string.IsNullOrEmpty(benFecNac) ? (object)DBNull.Value : benFecNac);
                cmd.Parameters.AddWithValue("@P_BENTEL", string.IsNullOrEmpty(benTel) ? (object)DBNull.Value : benTel);
                cmd.Parameters.AddWithValue("@P_BENCORELE", string.IsNullOrEmpty(benCorEle) ? (object)DBNull.Value : benCorEle);
                cmd.Parameters.AddWithValue("@P_BENSEX", string.IsNullOrEmpty(benSex) ? (object)DBNull.Value : benSex);
                cmd.Parameters.AddWithValue("@P_GENCOD", string.IsNullOrEmpty(genCod) ? (object)DBNull.Value : genCod);
                cmd.Parameters.AddWithValue("@P_BENFECREG", string.IsNullOrEmpty(benFecReg) ? (object)DBNull.Value : benFecReg);
                cmd.Parameters.AddWithValue("@P_BENCODUNI", string.IsNullOrEmpty(benCodUni) ? (object)DBNull.Value : benCodUni);
                cmd.Parameters.AddWithValue("@P_BENTELCON", string.IsNullOrEmpty(benTelCon) ? (object)DBNull.Value : benTelCon);
                cmd.Parameters.AddWithValue("@P_BENNOMAPO", string.IsNullOrEmpty(benNomApo) ? (object)DBNull.Value : benNomApo);
                cmd.Parameters.AddWithValue("@P_BENAPEAPO", string.IsNullOrEmpty(benApeApo) ? (object)DBNull.Value : benApeApo);
                cmd.Parameters.AddWithValue("@P_NACCOD", string.IsNullOrEmpty(nacCod) ? (object)DBNull.Value : nacCod);
                cmd.Parameters.AddWithValue("@P_BENDIR", string.IsNullOrEmpty(benDir) ? (object)DBNull.Value : benDir);
                cmd.Parameters.AddWithValue("@P_BENAUT", string.IsNullOrEmpty(benAut) ? (object)DBNull.Value : benAut);
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
                // Deserializa la cadena JSON en una lista de objetos Usuario
                temporal = JsonConvert.DeserializeObject<List<Beneficiario>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<Beneficiario>();
        }


        public IEnumerable<Beneficiario> BuscarBeneficiarioPorDocumento(ClaimsIdentity? identity, string? docIdeCod = null, string? docIdeBenNum = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            List<Beneficiario>? temporal = new List<Beneficiario>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_BENEFICIARIO_POR_DOCUMENTO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                // Aquí puedes agregar los parámetros necesarios para tu procedimiento almacenado
                cmd.Parameters.AddWithValue("@P_DOCIDECOD", string.IsNullOrEmpty(docIdeCod) ? (object)DBNull.Value : docIdeCod);
                cmd.Parameters.AddWithValue("@P_DOCIDEBENNUM", string.IsNullOrEmpty(docIdeBenNum) ? (object)DBNull.Value : docIdeBenNum);
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
                // Deserializa la cadena JSON en una lista de objetos Usuario
                temporal = JsonConvert.DeserializeObject<List<Beneficiario>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<Beneficiario>();
        }

        public IEnumerable<Beneficiario> BuscarBeneficiarioPorNombres(string? tags)
        {
            List<Beneficiario>? temporal = new List<Beneficiario>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_BENEFICIARIO_POR_NOMBRE", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                // Aquí puedes agregar los parámetros necesarios para tu procedimiento almacenado
                cmd.Parameters.AddWithValue("@P_ETIQUETAS", tags ?? string.Empty);

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
                // Deserializa la cadena JSON en una lista de objetos Usuario
                temporal = JsonConvert.DeserializeObject<List<Beneficiario>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<Beneficiario>();
        }

        public IEnumerable<Beneficiario> BuscarMetaBeneficiario(ClaimsIdentity? identity, string? metAno = null, string? metCod = null, string? benAno = null, string? benCod = null, string? ubiAno = null, string? ubiCod = null, string? metBenEda = null, string? metBenAnoEjeTec = null, string? metBenMesEjeTec = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            List<Beneficiario>? temporal = new List<Beneficiario>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_META_BENEFICIARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                // Aquí puedes agregar los parámetros necesarios para tu procedimiento almacenado
                cmd.Parameters.AddWithValue("@P_METANO", string.IsNullOrEmpty(metAno) ? (object)DBNull.Value : metAno);
                cmd.Parameters.AddWithValue("@P_METCOD", string.IsNullOrEmpty(metCod) ? (object)DBNull.Value : metCod);
                cmd.Parameters.AddWithValue("@P_BENANO", string.IsNullOrEmpty(benAno) ? (object)DBNull.Value : benAno);
                cmd.Parameters.AddWithValue("@P_BENCOD", string.IsNullOrEmpty(benCod) ? (object)DBNull.Value : benCod);
                cmd.Parameters.AddWithValue("@P_UBIANO", string.IsNullOrEmpty(ubiAno) ? (object)DBNull.Value : ubiAno);
                cmd.Parameters.AddWithValue("@P_UBICOD", string.IsNullOrEmpty(ubiCod) ? (object)DBNull.Value : ubiCod);
                cmd.Parameters.AddWithValue("@P_METBENEDA", string.IsNullOrEmpty(metBenEda) ? (object)DBNull.Value : metBenEda);
                cmd.Parameters.AddWithValue("@P_METBENMESEJETEC", string.IsNullOrEmpty(metBenAnoEjeTec) ? (object)DBNull.Value : metBenAnoEjeTec);
                cmd.Parameters.AddWithValue("@P_METBENANOEJETEC", string.IsNullOrEmpty(metBenMesEjeTec) ? (object)DBNull.Value : metBenMesEjeTec);
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
                // Deserializa la cadena JSON en una lista de objetos Usuario
                temporal = JsonConvert.DeserializeObject<List<Beneficiario>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<Beneficiario>();
        }

        public IEnumerable<Beneficiario> ContarBeneficiariosHome(string? tags)
        {
            List<Beneficiario>? temporal = new List<Beneficiario>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_CONTAR_BENEFICIARIOS_HOME", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@P_TAGS", tags ?? string.Empty);

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
                // Deserializa la cadena JSON en una lista de objetos Usuario
                temporal = JsonConvert.DeserializeObject<List<Beneficiario>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<Beneficiario>();
        }
        public IEnumerable<Beneficiario> BuscarBeneficiariosHome(string? tags)
        {
            List<Beneficiario>? temporal = new List<Beneficiario>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_BENEFICIARIOS_HOME", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@P_TAGS", tags ?? string.Empty);

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
                // Deserializa la cadena JSON en una lista de objetos Usuario
                temporal = JsonConvert.DeserializeObject<List<Beneficiario>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<Beneficiario>();
        }
        public IEnumerable<Beneficiario> BuscarSexoHome(string? tags)
        {
            List<Beneficiario>? temporal = new List<Beneficiario>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_SEXO_HOME", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@P_TAGS", tags ?? string.Empty);

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
                // Deserializa la cadena JSON en una lista de objetos Usuario
                temporal = JsonConvert.DeserializeObject<List<Beneficiario>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<Beneficiario>();
        }
        public IEnumerable<Beneficiario> BuscarRangoHome(string? tags)
        {
            List<Beneficiario>? temporal = new List<Beneficiario>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_RANGO_EDAD_HOME", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@P_TAGS", tags ?? string.Empty);

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
                // Deserializa la cadena JSON en una lista de objetos Usuario
                temporal = JsonConvert.DeserializeObject<List<Beneficiario>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<Beneficiario>();
        }


        public IEnumerable<Beneficiario> ListadoNormal()
        {
            List<Beneficiario> temporal = new List<Beneficiario>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_LISTAR_BENEFICIARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                SqlDataReader rd = cmd.ExecuteReader();
                while (rd.Read())
                {
                    temporal.Add(new Beneficiario()
                    {
                        BenAno = rd.GetString(0),
                        BenCod = rd.GetString(1),
                        BenNom = rd.GetString(2),
                        BenApe = rd.GetString(3),
                        BenFecNac = rd.GetString(4),
                        BenTel = rd.GetString(5),
                        BenCorEle = rd.GetString(6),
                        BenSex = rd.GetString(7),
                        GenCod = rd.GetString(8),
                        GenNom = rd.GetString(9),
                        BenCodUni = rd.GetString(11),
                        BenTelCon = rd.GetString(12),
                        BenNomApo = rd.GetString(13),
                        BenApeApo = rd.GetString(14),
                        NacCod = rd.GetString(15),
                        NacNom = rd.GetString(16),
                        BenDir = rd.GetString(17),
                        BenAut = rd.GetString(18),
                        UsuIng = rd.GetString(19),
                        FecIng = rd.IsDBNull(20) ? (DateTime?)null : rd.GetDateTime(20),
                        UsuMod = rd.GetString(21),
                        FecMod = rd.IsDBNull(22) ? (DateTime?)null : rd.GetDateTime(22),
                        EstReg = rd.GetString(23)[0]
                    });
                }
                rd.Close();
            }
            catch (SqlException ex)
            {
                temporal = new List<Beneficiario>();
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
