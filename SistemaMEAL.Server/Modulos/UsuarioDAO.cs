using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using SistemaMEAL.Server.Models;
using System.Data;
using System.Text;
using System.Security.Claims;
using Microsoft.SharePoint.Client;
using System.Transactions;

namespace SistemaMEAL.Server.Modulos
{

    public class UsuarioDAO
    {
        private conexionDAO cn = new conexionDAO();

        public (string? message, string? messageType) Modificar(ClaimsIdentity? identity, Usuario usuario)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                // Obtén el primer carácter de usuario.usuNom
                string? primerCaracterUsuNom = usuario.UsuNom?.Substring(0, 1);

                // Obtén la primera palabra de usuario.usuApe
                string? primeraPalabraUsuApe = usuario.UsuApe?.Split(' ')[0];

                // Concatena el primer carácter de usuario.usuNom y la primera palabra de usuario.usuApe
                string usuNomUsu = primerCaracterUsuNom + primeraPalabraUsuApe;

                SqlCommand cmd = new SqlCommand("SP_MODIFICAR_USUARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                // Aquí debes agregar todos los parámetros que necesita tu procedimiento almacenado
                cmd.Parameters.AddWithValue("@P_USUANO", usuario.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD", usuario.UsuCod);
                cmd.Parameters.AddWithValue("@P_DOCIDECOD", usuario.DocIdeCod);
                cmd.Parameters.AddWithValue("@P_USUNUMDOC", usuario.UsuNumDoc);
                cmd.Parameters.AddWithValue("@P_USUNOM", usuario.UsuNom);
                cmd.Parameters.AddWithValue("@P_USUAPE", usuario.UsuApe);
                cmd.Parameters.AddWithValue("@P_USUFECNAC", usuario.UsuFecNac);
                cmd.Parameters.AddWithValue("@P_USUSEX", usuario.UsuSex);
                cmd.Parameters.AddWithValue("@P_USUCORELE", usuario.UsuCorEle);
                cmd.Parameters.AddWithValue("@P_CARCOD", usuario.CarCod);
                cmd.Parameters.AddWithValue("@P_USUFECINC", usuario.UsuFecInc);
                cmd.Parameters.AddWithValue("@P_USUTEL", usuario.UsuTel);
                cmd.Parameters.AddWithValue("@P_USUNOMUSU", usuNomUsu);
                cmd.Parameters.AddWithValue("@P_USUPAS", usuario.UsuPas);
                cmd.Parameters.AddWithValue("@P_USUEST", usuario.UsuEst);
                cmd.Parameters.AddWithValue("@P_ROLCOD", usuario.RolCod);
                cmd.Parameters.AddWithValue("@P_UBIANO", usuario.UbiAno);
                cmd.Parameters.AddWithValue("@P_UBICOD", usuario.UbiCod);
                cmd.Parameters.AddWithValue("@P_USUSES", usuario.UsuSes);
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
            }
            finally
            {
                cn.getcn.Close();
            }
            return (mensaje, tipoMensaje);
        }

        public (string? message, string? messageType, Usuario? user) ModificarPerfilUsuario(ClaimsIdentity? identity, Usuario usuario)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";
            Usuario? user = new Usuario();
            try
            {
                SqlCommand cmd;
                SqlParameter pDescripcionMensaje;
                SqlParameter pTipoMensaje;

                cn.getcn.Open();

                // Obtén el primer carácter de usuario.usuNom
                string? primerCaracterUsuNom = usuario.UsuNom?.Substring(0, 1);

                // Obtén la primera palabra de usuario.usuApe
                string? primeraPalabraUsuApe = usuario.UsuApe?.Split(' ')[0];

                // Concatena el primer carácter de usuario.usuNom y la primera palabra de usuario.usuApe
                string usuNomUsu = primerCaracterUsuNom + primeraPalabraUsuApe;

                cmd = new SqlCommand("SP_MODIFICAR_PERFIL_USUARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                // Aquí debes agregar todos los parámetros que necesita tu procedimiento almacenado
                cmd.Parameters.AddWithValue("@P_USUANO", usuario.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD", usuario.UsuCod);
                cmd.Parameters.AddWithValue("@P_DOCIDECOD", usuario.DocIdeCod);
                cmd.Parameters.AddWithValue("@P_USUNUMDOC", usuario.UsuNumDoc);
                cmd.Parameters.AddWithValue("@P_USUNOM", usuario.UsuNom);
                cmd.Parameters.AddWithValue("@P_USUAPE", usuario.UsuApe);
                cmd.Parameters.AddWithValue("@P_USUFECNAC", usuario.UsuFecNac);
                cmd.Parameters.AddWithValue("@P_USUTEL", usuario.UsuTel);
                cmd.Parameters.AddWithValue("@P_USUNOMUSU", usuNomUsu);
                cmd.Parameters.AddWithValue("@P_CARCOD", usuario.CarCod);
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

                cmd = new SqlCommand("SP_BUSCAR_USUARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                // Aquí puedes agregar los parámetros necesarios para tu procedimiento almacenado
                cmd.Parameters.AddWithValue("@P_USUANO", usuario.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD", usuario.UsuCod);
                cmd.Parameters.AddWithValue("@P_DOCIDECOD", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUNUMDOC", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUNOM", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUAPE", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUFECNAC", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUSEX", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUCORELE", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_CARCOD", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUFECINC", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUTEL", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUNOMUSU", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUPAS", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUEST", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_ROLCOD", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_UBIANO", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_UBICOD", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUSES", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe ?? (object)DBNull.Value);

                pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                pDescripcionMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pDescripcionMensaje);

                pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
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
                List<Usuario>? usuarios = JsonConvert.DeserializeObject<List<Usuario>>(jsonResult.ToString());
                if (usuarios?.Count > 0)
                {
                    user = usuarios[0];
                }
            }
            catch (SqlException ex)
            {
                tipoMensaje = "1";
                mensaje = ex.Message;
            }
            finally
            {
                cn.getcn.Close();
            }
            return (mensaje, tipoMensaje, user);
        }

        public (string? message, string? messageType, Usuario? user) ModificarAvatarUsuario(ClaimsIdentity? identity, Usuario usuario)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";
            Usuario? user = new Usuario();
            try
            {
                SqlCommand cmd;
                SqlParameter pDescripcionMensaje;
                SqlParameter pTipoMensaje;

                cn.getcn.Open();

                cmd = new SqlCommand("SP_MODIFICAR_AVATAR_USUARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                // Aquí debes agregar todos los parámetros que necesita tu procedimiento almacenado
                cmd.Parameters.AddWithValue("@P_USUANO", usuario.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD", usuario.UsuCod);
                cmd.Parameters.AddWithValue("@P_USUAVA", usuario.UsuAva);
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

                cmd = new SqlCommand("SP_BUSCAR_USUARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                // Aquí puedes agregar los parámetros necesarios para tu procedimiento almacenado
                cmd.Parameters.AddWithValue("@P_USUANO", usuario.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD", usuario.UsuCod);
                cmd.Parameters.AddWithValue("@P_DOCIDECOD", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUNUMDOC", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUNOM", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUAPE", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUFECNAC", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUSEX", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUCORELE", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_CARCOD", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUFECINC", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUTEL", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUNOMUSU", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUPAS", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUEST", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_ROLCOD", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_UBIANO", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_UBICOD", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUSES", (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe ?? (object)DBNull.Value);

                pDescripcionMensaje = new SqlParameter("@P_DESCRIPCION_MENSAJE", SqlDbType.NVarChar, -1);
                pDescripcionMensaje.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pDescripcionMensaje);

                pTipoMensaje = new SqlParameter("@P_TIPO_MENSAJE", SqlDbType.Char, 1);
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
                List<Usuario>? usuarios = JsonConvert.DeserializeObject<List<Usuario>>(jsonResult.ToString());
                if (usuarios?.Count > 0)
                {
                    user = usuarios[0];
                }
            }
            catch (SqlException ex)
            {
                tipoMensaje = "1";
                mensaje = ex.Message;
            }
            finally
            {
                cn.getcn.Close();
            }
            return (mensaje, tipoMensaje, user);
        }

        public (string? message, string? messageType, string? usuAnoOut, string? usuCodOut) Insertar(ClaimsIdentity? identity, Usuario usuario)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";
            string? usuAnoOut = "";
            string? usuCodOut = "";
            try
            {
                cn.getcn.Open();

                // Obtén la fecha actual y formátala como una cadena en el formato "dd-MM-yyyy"
                string fechaActual = DateTime.Now.ToString("dd-MM-yyyy");

                // Obtén el primer carácter de usuario.usuNom
                string? primerCaracterUsuNom = usuario.UsuNom?.Substring(0, 1);

                // Obtén la primera palabra de usuario.usuApe
                string? primeraPalabraUsuApe = usuario.UsuApe?.Split(' ')[0];

                // Concatena el primer carácter de usuario.usuNom y la primera palabra de usuario.usuApe
                string usuNomUsu = primerCaracterUsuNom + primeraPalabraUsuApe;

                SqlCommand cmd = new SqlCommand("SP_INSERTAR_USUARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_DOCIDECOD", usuario.DocIdeCod);
                cmd.Parameters.AddWithValue("@P_USUNUMDOC", usuario.UsuNumDoc);
                cmd.Parameters.AddWithValue("@P_USUNOM", usuario.UsuNom);
                cmd.Parameters.AddWithValue("@P_USUAPE", usuario.UsuApe);
                cmd.Parameters.AddWithValue("@P_USUFECNAC", usuario.UsuFecNac);
                cmd.Parameters.AddWithValue("@P_USUSEX", usuario.UsuSex);
                cmd.Parameters.AddWithValue("@P_USUCORELE", usuario.UsuCorEle);
                cmd.Parameters.AddWithValue("@P_CARCOD", usuario.CarCod);
                cmd.Parameters.AddWithValue("@P_USUFECINC", fechaActual);
                cmd.Parameters.AddWithValue("@P_USUTEL", usuario.UsuTel);
                cmd.Parameters.AddWithValue("@P_USUNOMUSU", usuNomUsu);
                cmd.Parameters.AddWithValue("@P_USUPAS", usuario.UsuPas);
                cmd.Parameters.AddWithValue("@P_USUEST", usuario.UsuEst);
                cmd.Parameters.AddWithValue("@P_ROLCOD", usuario.RolCod);
                cmd.Parameters.AddWithValue("@P_UBIANO", usuario.UbiAno);
                cmd.Parameters.AddWithValue("@P_UBICOD", usuario.UbiCod);
                cmd.Parameters.AddWithValue("@P_USUSES", "S");
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

                SqlParameter pUsuAno = new SqlParameter("@P_USUANO_OUT", SqlDbType.NVarChar, 4);
                pUsuAno.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pUsuAno);

                SqlParameter pUsuCod = new SqlParameter("@P_USUCOD_OUT", SqlDbType.Char, 6);
                pUsuCod.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(pUsuCod);

                cmd.ExecuteNonQuery();

                usuAnoOut = pUsuAno.Value.ToString();
                usuCodOut = pUsuCod.Value.ToString();
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
            return (usuAnoOut, usuCodOut, mensaje, tipoMensaje);
        }

        public (string? message, string? messageType) RestablecerPassword(ClaimsIdentity? identity, Usuario usuario)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_CAMBIAR_CONTRASEÑA", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_USUANO", usuario.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD", usuario.UsuCod);
                cmd.Parameters.AddWithValue("@P_USUPAS", usuario.UsuPas);
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

        public (string? message, string? messageType) RestablecerPasswordOlvidada(Usuario usuario)
        {
            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_CAMBIAR_CONTRASEÑA", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_USUANO", usuario.UsuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD", usuario.UsuCod);
                cmd.Parameters.AddWithValue("@P_USUPAS", usuario.UsuPas);
                cmd.Parameters.AddWithValue("@P_USUMOD", "SYSTEM");
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", usuario.UsuIp);
                cmd.Parameters.AddWithValue("@P_USUANO_U", "0000");
                cmd.Parameters.AddWithValue("@P_USUCOD_U", "000000");
                cmd.Parameters.AddWithValue("@P_USUNOM_U", "SYSTEM");
                cmd.Parameters.AddWithValue("@P_USUAPE_U", "SYSTEM");

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

        public IEnumerable<Usuario> BuscarUsuarioPorCorreo(string usuCorEle)
        {
            List<Usuario>? temporal = new List<Usuario>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_VALIDAR_EMAIL", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@P_USUCORELE", usuCorEle);

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
                temporal = JsonConvert.DeserializeObject<List<Usuario>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<Usuario>();
        }

        public IEnumerable<Usuario> Listado(ClaimsIdentity? identity = null, string? usuAno = null, string? usuCod = null, string? docIdeCod = null, string? usuNumDoc = null, string? usuNom = null, string? usuApe = null, string? usuFecNac = null, string? usuSex = null, string? usuCorEle = null, string? usuCarCod = null, string? usuFecInc = null, string? usuTel = null, string? usuNomUsu = null, string? usuPas = null, string? usuEst = null, string? rolCod = null, string? ubiAno = null, string? ubiCod = null, byte[]? usuAva = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            List<Usuario>? temporal = new List<Usuario>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_USUARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                // Aquí puedes agregar los parámetros necesarios para tu procedimiento almacenado
                cmd.Parameters.AddWithValue("@P_USUANO", string.IsNullOrEmpty(usuAno) ? (object)DBNull.Value : usuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD", string.IsNullOrEmpty(usuCod) ? (object)DBNull.Value : usuCod);
                cmd.Parameters.AddWithValue("@P_DOCIDECOD", string.IsNullOrEmpty(docIdeCod) ? (object)DBNull.Value : docIdeCod);
                cmd.Parameters.AddWithValue("@P_USUNUMDOC", string.IsNullOrEmpty(usuNumDoc) ? (object)DBNull.Value : usuNumDoc);
                cmd.Parameters.AddWithValue("@P_USUNOM", string.IsNullOrEmpty(usuNom) ? (object)DBNull.Value : usuNom);
                cmd.Parameters.AddWithValue("@P_USUAPE", string.IsNullOrEmpty(usuApe) ? (object)DBNull.Value : usuApe);
                cmd.Parameters.AddWithValue("@P_USUFECNAC", string.IsNullOrEmpty(usuFecNac) ? (object)DBNull.Value : usuFecNac);
                cmd.Parameters.AddWithValue("@P_USUSEX", string.IsNullOrEmpty(usuSex) ? (object)DBNull.Value : usuSex);
                cmd.Parameters.AddWithValue("@P_USUCORELE", string.IsNullOrEmpty(usuCorEle) ? (object)DBNull.Value : usuCorEle);
                cmd.Parameters.AddWithValue("@P_CARCOD", string.IsNullOrEmpty(usuCarCod) ? (object)DBNull.Value : usuCarCod);
                cmd.Parameters.AddWithValue("@P_USUFECINC", string.IsNullOrEmpty(usuFecInc) ? (object)DBNull.Value : usuFecInc);
                cmd.Parameters.AddWithValue("@P_USUTEL", string.IsNullOrEmpty(usuTel) ? (object)DBNull.Value : usuTel);
                cmd.Parameters.AddWithValue("@P_USUNOMUSU", string.IsNullOrEmpty(usuNomUsu) ? (object)DBNull.Value : usuNomUsu);
                cmd.Parameters.AddWithValue("@P_USUPAS", string.IsNullOrEmpty(usuPas) ? (object)DBNull.Value : usuPas);
                cmd.Parameters.AddWithValue("@P_USUEST", string.IsNullOrEmpty(usuEst) ? (object)DBNull.Value : usuEst);
                cmd.Parameters.AddWithValue("@P_ROLCOD", string.IsNullOrEmpty(rolCod) ? (object)DBNull.Value : rolCod);
                cmd.Parameters.AddWithValue("@P_UBIANO", string.IsNullOrEmpty(ubiAno) ? (object)DBNull.Value : ubiAno);
                cmd.Parameters.AddWithValue("@P_UBICOD", string.IsNullOrEmpty(ubiCod) ? (object)DBNull.Value : ubiCod);
                cmd.Parameters.AddWithValue("@P_USUSES", string.IsNullOrEmpty(ubiCod) ? (object)DBNull.Value : ubiCod);
                cmd.Parameters.AddWithValue("@P_LOGIPMAQ", userClaims.UsuIp ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUANO_U", userClaims.UsuAno ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUCOD_U", userClaims.UsuCod ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUNOM_U", userClaims.UsuNom ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@P_USUAPE_U", userClaims.UsuApe ?? (object)DBNull.Value);

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
                temporal = JsonConvert.DeserializeObject<List<Usuario>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<Usuario>();
        }

        public (string? message, string? messageType) Eliminar(ClaimsIdentity? identity, string usuAno, string usuCod)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_ELIMINAR_USUARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@P_USUANO", usuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD", usuCod);
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
            }
            finally
            {
                cn.getcn.Close();
            }
            return (mensaje, tipoMensaje);
        }


        public IEnumerable<UsuarioAcceso> BuscarUsuarioAcceso(ClaimsIdentity? identity, string? usuAno, string? usuCod, string? usuAccTip = null, string? usuAccAno = null, string? usuAccCod = null, string? usuAccPad = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);
            
            List<UsuarioAcceso>? temporal = new List<UsuarioAcceso>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_USUARIO_ACCESO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                // Aquí puedes agregar los parámetros necesarios para tu procedimiento almacenado
                cmd.Parameters.AddWithValue("@P_USUANO", usuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD", usuCod);
                cmd.Parameters.AddWithValue("@P_USUACCTIP", string.IsNullOrEmpty(usuAccTip) ? (object)DBNull.Value : usuAccTip);
                cmd.Parameters.AddWithValue("@P_USUACCANO", string.IsNullOrEmpty(usuAccAno) ? (object)DBNull.Value : usuAccAno);
                cmd.Parameters.AddWithValue("@P_USUACCCOD", string.IsNullOrEmpty(usuAccCod) ? (object)DBNull.Value : usuAccCod);
                cmd.Parameters.AddWithValue("@P_USUACCPAD", string.IsNullOrEmpty(usuAccPad) ? (object)DBNull.Value : usuAccPad);
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
                temporal = JsonConvert.DeserializeObject<List<UsuarioAcceso>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<UsuarioAcceso>();
        }



        public (string? message, string? messageType) InsertarUsuarioAcceso(ClaimsIdentity? identity, List<UsuarioAcceso> accesosInsertar,List<UsuarioAcceso> accesosEliminar)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "";
            string? tipoMensaje = "";

            using (TransactionScope scope = new TransactionScope())
            {
                using (SqlConnection connection = cn.getcn)
                {
                    try
                    {
                        if (connection.State == ConnectionState.Closed)
                        {
                            connection.Open();
                        }

                        SqlCommand cmd;
                        SqlParameter pDescripcionMensaje;
                        SqlParameter pTipoMensaje;

                        DataTable dtAccesosUsuarioInsertar = new DataTable();
                        dtAccesosUsuarioInsertar.Columns.Add("USUACCTIP", typeof(string));
                        dtAccesosUsuarioInsertar.Columns.Add("USUACCANO", typeof(string));
                        dtAccesosUsuarioInsertar.Columns.Add("USUACCCOD", typeof(string));
                        dtAccesosUsuarioInsertar.Columns.Add("USUACCPAD", typeof(string));

                        if (accesosInsertar.Count > 0)
                        {
                            foreach (var acceso in accesosInsertar)
                            {
                                dtAccesosUsuarioInsertar.Rows.Add(acceso.UsuAccTip,acceso.UsuAccAno,acceso.UsuAccCod,acceso.UsuAccPad);
                            }

                            cmd = new SqlCommand("SP_INSERTAR_USUARIO_ACCESO_MASIVO", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            SqlParameter param = new SqlParameter();
                            param.ParameterName = "@UsuarioAcceso";
                            param.SqlDbType = SqlDbType.Structured;
                            param.Value = dtAccesosUsuarioInsertar;
                            param.TypeName = "UsuarioAccesoType";

                            cmd.Parameters.Add(param);
                            cmd.Parameters.AddWithValue("@P_USUANO", accesosInsertar[0].UsuAno);
                            cmd.Parameters.AddWithValue("@P_USUCOD", accesosInsertar[0].UsuCod);
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

                            if (tipoMensaje != "3")
                            {
                                Console.WriteLine(mensaje);
                                throw new Exception(mensaje);
                            }
                        }

                        DataTable dtAccesosUsuarioEliminar = new DataTable();
                        dtAccesosUsuarioEliminar.Columns.Add("USUACCTIP", typeof(string));
                        dtAccesosUsuarioEliminar.Columns.Add("USUACCANO", typeof(string));
                        dtAccesosUsuarioEliminar.Columns.Add("USUACCCOD", typeof(string));
                        dtAccesosUsuarioEliminar.Columns.Add("USUACCPAD", typeof(string));

                        if (accesosEliminar.Count > 0)
                        {
                            foreach (var acceso in accesosEliminar)
                            {
                                dtAccesosUsuarioEliminar.Rows.Add(acceso.UsuAccTip,acceso.UsuAccAno,acceso.UsuAccCod);
                            }

                            cmd = new SqlCommand("SP_ELIMINAR_USUARIO_ACCESO_MASIVO", cn.getcn);
                            cmd.CommandType = CommandType.StoredProcedure;

                            SqlParameter param = new SqlParameter();
                            param.ParameterName = "@UsuarioAcceso";
                            param.SqlDbType = SqlDbType.Structured;
                            param.Value = dtAccesosUsuarioEliminar;
                            param.TypeName = "UsuarioAccesoType";

                            cmd.Parameters.Add(param);
                            cmd.Parameters.AddWithValue("@P_USUANO", accesosEliminar[0].UsuAno);
                            cmd.Parameters.AddWithValue("@P_USUCOD", accesosEliminar[0].UsuCod);
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
                        }
                        

                        mensaje = "Accesos actualizados correctamente.";
                        tipoMensaje = "3";
                        scope.Complete();
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
