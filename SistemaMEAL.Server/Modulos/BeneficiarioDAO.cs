using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using SistemaMEAL.Server.Models;
using System.Data;
using System.Text;

namespace SistemaMEAL.Server.Modulos
{

    public class BeneficiarioDAO
    {
        private conexionDAO cn = new conexionDAO();

        public (string? message, string? messageType) Insertar(Beneficiario beneficiario)
        {
            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_INSERTAR_BENEFICIARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_DOCIDECOD", beneficiario.DocIdeCod);
                cmd.Parameters.AddWithValue("@P_BENNUMDOC", beneficiario.BenNumDoc);
                cmd.Parameters.AddWithValue("@P_BENNOM", beneficiario.BenNom);
                cmd.Parameters.AddWithValue("@P_BENAPE", beneficiario.BenApe);
                cmd.Parameters.AddWithValue("@P_BENFECNAC", beneficiario.BenFecNac);
                cmd.Parameters.AddWithValue("@P_BENSEX", beneficiario.BenSex);
                // cmd.Parameters.AddWithValue("@P_BENCORELE", beneficiario.BenCorEle);
                // cmd.Parameters.AddWithValue("@P_BENTEL", beneficiario.BenTel);
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
