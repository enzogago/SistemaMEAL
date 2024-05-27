using Microsoft.Data.SqlClient;
using System.Data;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;
using System.Text;
using Newtonsoft.Json;
using System.Security.Claims;

namespace SistemaMEAL.Modulos
{
     public class MenuDAO
    {
        private conexionDAO cn = new conexionDAO();

        public (string? message, string? messageType) InsertarMenuUsuario(ClaimsIdentity? identity, Usuario? usuario, List<MenuUsuario>? menuUsuarioInsertar,List<MenuUsuario>? menuUsuarioEliminar)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            string? mensaje = "No se realizaron cambios.";
            string? tipoMensaje = "3";

            try
            {
                cn.getcn.Open();

                if (menuUsuarioInsertar.Count > 0)
                {
                    foreach (var item in menuUsuarioInsertar)
                    {
                        SqlCommand cmd = new SqlCommand("SP_INSERTAR_MENU_USUARIO", cn.getcn);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@P_USUANO", usuario.UsuAno);
                        cmd.Parameters.AddWithValue("@P_USUCOD", usuario.UsuCod);
                        cmd.Parameters.AddWithValue("@P_MENANO", item.MenAno);
                        cmd.Parameters.AddWithValue("@P_MENCOD", item.MenCod);
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

                        cmd.ExecuteNonQuery();

                        mensaje = pDescripcionMensaje.Value.ToString();
                        tipoMensaje = pTipoMensaje.Value.ToString();
                    }
                }

                if (menuUsuarioEliminar.Count > 0)
                {
                    foreach (var item in menuUsuarioEliminar)
                    {
                        SqlCommand cmd = new SqlCommand("SP_ELIMINAR_MENU_USUARIO", cn.getcn);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@P_USUANO", usuario.UsuAno);
                        cmd.Parameters.AddWithValue("@P_USUCOD", usuario.UsuCod);
                        cmd.Parameters.AddWithValue("@P_MENANO", item.MenAno);
                        cmd.Parameters.AddWithValue("@P_MENCOD", item.MenCod);
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
            return (mensaje, tipoMensaje);
        }
        
        public IEnumerable<Menu> ListadoMenuPorUsuario(ClaimsIdentity? identity, string? menAno = null, string? menCod = null, string? usuAno = null, string? usuCod = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            List<Menu>? temporal = new List<Menu>();

            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_MENU_USUARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@P_MENANO", string.IsNullOrEmpty(menAno) ? (object)DBNull.Value : menAno);
                cmd.Parameters.AddWithValue("@P_MENCOD", string.IsNullOrEmpty(menCod) ? (object)DBNull.Value : menCod);
                cmd.Parameters.AddWithValue("@P_USUANO", string.IsNullOrEmpty(usuAno) ? (object)DBNull.Value : usuAno);
                cmd.Parameters.AddWithValue("@P_USUCOD", string.IsNullOrEmpty(usuCod) ? (object)DBNull.Value : usuCod);
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
                temporal = JsonConvert.DeserializeObject<List<Menu>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<Menu>();
        }


        public IEnumerable<Menu> Buscar(ClaimsIdentity? identity, string? menAno = null, string? menCod = null, string? menNom = null, string? menRef = null, string? menIco = null, string? menOrd = null, string? menAnoPad = null, string? menCodPad = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            List<Menu>? temporal = new List<Menu>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_MENU", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@P_MENANO", string.IsNullOrEmpty(menAno) ? (object)DBNull.Value : menAno);
                cmd.Parameters.AddWithValue("@P_MENCOD", string.IsNullOrEmpty(menCod) ? (object)DBNull.Value : menCod);
                cmd.Parameters.AddWithValue("@P_MENNOM", string.IsNullOrEmpty(menNom) ? (object)DBNull.Value : menNom);
                cmd.Parameters.AddWithValue("@P_MENREF", string.IsNullOrEmpty(menRef) ? (object)DBNull.Value : menRef);
                cmd.Parameters.AddWithValue("@P_MENICO", string.IsNullOrEmpty(menIco) ? (object)DBNull.Value : menIco);
                cmd.Parameters.AddWithValue("@P_MENORD", string.IsNullOrEmpty(menOrd) ? (object)DBNull.Value : menOrd);
                cmd.Parameters.AddWithValue("@P_MENANOPAD", string.IsNullOrEmpty(menAnoPad) ? (object)DBNull.Value : menAnoPad);
                cmd.Parameters.AddWithValue("@P_MENCODPAD", string.IsNullOrEmpty(menCodPad) ? (object)DBNull.Value : menCodPad);
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
                temporal = JsonConvert.DeserializeObject<List<Menu>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                temporal = new List<Menu>();
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<Menu>();
        }
        
        public IEnumerable<Menu> BuscarRecursivo(ClaimsIdentity? identity, string? menAno = null, string? menCod = null, string? menNom = null, string? menRef = null, string? menIco = null, string? menOrd = null, string? menAnoPad = null, string? menCodPad = null)
        {
            var userClaims = new UserClaims().GetClaimsFromIdentity(identity);

            List<Menu>? temporal = new List<Menu>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_LISTAR_MENU_RECURSIVO", cn.getcn);
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
                // Deserializa la cadena JSON en una lista de objetos Estado
                temporal = JsonConvert.DeserializeObject<List<Menu>>(jsonResult.ToString());
            }
            catch (SqlException ex)
            {
                temporal = new List<Menu>();
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal?? new List<Menu>();
        }

    }
}