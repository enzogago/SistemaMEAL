using Microsoft.Data.SqlClient;
using System.Data;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;

namespace SistemaMEAL.Modulos
{
    public class FinanciadorDAO
    {
        private conexionDAO cn = new conexionDAO();

        public IEnumerable<Financiador> Listado()
        {
            List<Financiador> temporal = new List<Financiador>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_LISTAR_FINANCIADORES", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                SqlDataReader rd = cmd.ExecuteReader();
                while (rd.Read())
                {
                    temporal.Add(new Financiador()
                    {
                        FinCod = rd.GetString(0),
                        FinNom = rd.GetString(1),
                        UsuIng = rd.GetString(2),
                        FecIng = rd.IsDBNull(3) ? (DateTime?)null : rd.GetDateTime(3),
                        UsuMod = rd.GetString(4),
                        FecMod = rd.IsDBNull(5) ? (DateTime?)null : rd.GetDateTime(5),
                        EstReg = rd.GetString(6)[0],
                    });
                }
                rd.Close();
            }
            catch (SqlException ex)
            {
                temporal = new List<Financiador>();
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal;
        }

        public (string message, string messageType) Insertar(Financiador financiador)
        {
            string mensaje = "";
            string tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_INSERTAR_FINANCIADOR", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_FINNOM", financiador.FinNom);
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
            }
            finally
            {
                cn.getcn.Close();
            }
            return (mensaje, tipoMensaje);
        }

        public (string message, string messageType) Modificar(Financiador financiador)
        {
            string mensaje = "";
            string tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_MODIFICAR_FINANCIADOR", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_FINCOD", financiador.FinCod);
                cmd.Parameters.AddWithValue("@P_FINNOM", financiador.FinNom);
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
            }
            finally
            {
                cn.getcn.Close();
            }
            return (mensaje, tipoMensaje);
        }

        public (string message, string messageType) Eliminar(string finCod)
        {
            string mensaje = "";
            string tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_ELIMINAR_FINANCIADOR", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_FINCOD", finCod);
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
            }
            finally
            {
                cn.getcn.Close();
            }
            return (mensaje, tipoMensaje);
        }



    }
}