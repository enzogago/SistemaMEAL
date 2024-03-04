using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using SistemaMEAL.Server.Models;
using System.Data;
using System.Text;
using System.Transactions;

namespace SistemaMEAL.Server.Modulos
{

    public class BeneficiarioDAO
    {
        private conexionDAO cn = new conexionDAO();

        public (string? benAnoOut,string? benCodOut,string? message, string? messageType) Insertar(Beneficiario beneficiario)
        {
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

        public (string? message, string? messageType) Modificar(Beneficiario beneficiario)
        {
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
                cmd.Parameters.AddWithValue("@P_BENTELCON", beneficiario.BenTel);
                cmd.Parameters.AddWithValue("@P_BENCODUNI", beneficiario.BenCodUni);
                cmd.Parameters.AddWithValue("@P_BENDIR", beneficiario.BenDir);
                cmd.Parameters.AddWithValue("@P_BENAUT", beneficiario.BenAut);
                cmd.Parameters.AddWithValue("@P_BENFECREG", "10-02-2024");
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

        public (string? message, string? messageType) InsertarBeneficiarioDocumento(Beneficiario beneficiario, DocumentoBeneficiario documentoBeneficiario)
        {
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
                    cmdBeneficiario.Parameters.AddWithValue("@P_USUING", "Usuario");
                    cmdBeneficiario.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                    cmdBeneficiario.Parameters.AddWithValue("@P_USUANO_U", "2023");
                    cmdBeneficiario.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                    cmdBeneficiario.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                    cmdBeneficiario.Parameters.AddWithValue("@P_USUAPEPAT_U", "GAGO");
                    cmdBeneficiario.Parameters.AddWithValue("@P_USUAPEMAT_U", "AGUIRRE");

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
                    cmdDocumento.Parameters.AddWithValue("@P_USUING", "Usuario");
                    cmdDocumento.Parameters.AddWithValue("@P_LOGIPMAQ", "192.168.1.1");
                    cmdDocumento.Parameters.AddWithValue("@P_USUANO_U", "2023");
                    cmdDocumento.Parameters.AddWithValue("@P_USUCOD_U", "000001");
                    cmdDocumento.Parameters.AddWithValue("@P_USUNOM_U", "ENZO");
                    cmdDocumento.Parameters.AddWithValue("@P_USUAPEPAT_U", "GAGO");
                    cmdDocumento.Parameters.AddWithValue("@P_USUAPEMAT_U", "AGUIRRE");

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


        public IEnumerable<Beneficiario> Listado(string? benAno = null, string? benCod = null, string? benNom = null, string? benApe = null, string? benFecNac = null, string? benTel = null, string? benCorEle = null, string? benSex = null, string? genCod = null, string? benFecReg = null, string? benCodUni = null, string? benTelCon = null, string? benNomApo = null, string? benApeApo = null, string? nacCod = null, string? benDir = null, string? benAut = null)
        {
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
                Console.WriteLine(jsonResult);
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


        public IEnumerable<Beneficiario> BuscarBeneficiarioPorDocumento(string? docIdeCod = null, string? docIdeBenNum = null)
        {
            List<Beneficiario>? temporal = new List<Beneficiario>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_BENEFICIARIO_POR_DOCUMENTO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                // Aquí puedes agregar los parámetros necesarios para tu procedimiento almacenado
                cmd.Parameters.AddWithValue("@P_DOCIDECOD", string.IsNullOrEmpty(docIdeCod) ? (object)DBNull.Value : docIdeCod);
                cmd.Parameters.AddWithValue("@P_DOCIDEBENNUM", string.IsNullOrEmpty(docIdeBenNum) ? (object)DBNull.Value : docIdeBenNum);
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

         public IEnumerable<Beneficiario> BuscarMetaBeneficiario(string? metAno = null, string? metCod = null, string? benAno = null, string? benCod = null, string? ubiAno = null, string? ubiCod = null, string? metBenEda = null, string? metBenAnoEjeTec = null, string? metBenMesEjeTec = null)
        {
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
                        Console.WriteLine("desde reader:"+reader.GetValue(0).ToString());
                        jsonResult.Append(reader.GetValue(0).ToString());
                    }
                }
                Console.WriteLine("desde jsonResult final:"+jsonResult);
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
                Console.WriteLine(jsonResult);
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
                Console.WriteLine(jsonResult);
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
                Console.WriteLine(jsonResult);
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

    }
}
