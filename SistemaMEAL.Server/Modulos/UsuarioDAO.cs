using Microsoft.Data.SqlClient;
using SistemaMEAL.Server.Models;
using System.Data;

namespace SistemaMEAL.Server.Modulos
{

    public class UsuarioDAO
    {
        private conexionDAO cn = new conexionDAO();


        public (string message, string messageType) Modificar(Usuario usuario)
        {
            string mensaje = "";
            string tipoMensaje = "";
            try
            {
                cn.getcn.Open();

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
                cmd.Parameters.AddWithValue("@P_USUNOMUSU", usuario.UsuNomUsu);
                cmd.Parameters.AddWithValue("@P_USUPAS", usuario.UsuPas);
                cmd.Parameters.AddWithValue("@P_USUEST", usuario.UsuEst);
                cmd.Parameters.AddWithValue("@P_ROLCOD", usuario.RolCod);
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

        public (string message, string messageType) Insertar(Usuario usuario)
        {
            string mensaje = "";
            string tipoMensaje = "";
            try
            {
                cn.getcn.Open();

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
                cmd.Parameters.AddWithValue("@P_USUFECINC", usuario.UsuFecInc);
                cmd.Parameters.AddWithValue("@P_USUTEL", usuario.UsuTel);
                cmd.Parameters.AddWithValue("@P_USUNOMUSU", usuario.UsuNomUsu);
                cmd.Parameters.AddWithValue("@P_USUPAS", usuario.UsuPas);
                cmd.Parameters.AddWithValue("@P_USUEST", usuario.UsuEst);
                cmd.Parameters.AddWithValue("@P_ROLCOD", usuario.RolCod);
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

        public IEnumerable<Usuario> Listado()
        {
            List<Usuario> temporal = new List<Usuario>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_LISTAR_USUARIOS", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                SqlDataReader rd = cmd.ExecuteReader();
                while (rd.Read())
                {
                    temporal.Add(new Usuario()
                    {
                        UsuAno = rd.GetString(0),
                        UsuCod = rd.GetString(1),
                        DocIdeCod = rd.GetString(2),
                        UsuNumDoc = rd.GetString(3),
                        UsuNom = rd.GetString(4),
                        UsuApe = rd.GetString(5),
                        UsuFecNac = rd.GetString(6),
                        UsuSex = rd.GetString(7)[0],
                        UsuCorEle = rd.GetString(8),
                        CarCod = rd.GetString(9),
                        UsuFecInc = rd.GetString(10),
                        UsuTel = rd.GetString(11),
                        UsuNomUsu = rd.GetString(12),
                        UsuPas = rd.GetString(13),
                        UsuEst = rd.GetString(14)[0],
                        RolCod = rd.GetString(15),
                        UsuIng = rd.GetString(16),
                        FecIng = rd.IsDBNull(17) ? (DateTime?)null : rd.GetDateTime(17),
                        UsuMod = rd.GetString(18),
                        FecMod = rd.IsDBNull(19) ? (DateTime?)null : rd.GetDateTime(19),
                        EstReg = rd.GetString(20)[0],
                        Cargo = new Cargo()
                        {
                            CarCod = rd.GetString(21),
                            CarNom = rd.GetString(22),
                            UsuIng = rd.GetString(23),
                            FecIng = rd.IsDBNull(24) ? (DateTime?)null : rd.GetDateTime(24),
                            UsuMod = rd.GetString(25),
                            FecMod = rd.IsDBNull(26) ? (DateTime?)null : rd.GetDateTime(26),
                            EstReg = rd.GetString(27)[0],
                        },
                        Rol = new Rol()
                        {
                            RolCod = rd.GetString(28),
                            RolNom = rd.GetString(29),
                            UsuIng = rd.GetString(30),
                            FecIng = rd.IsDBNull(31) ? (DateTime?)null : rd.GetDateTime(31),
                            UsuMod = rd.GetString(32),
                            FecMod = rd.IsDBNull(33) ? (DateTime?)null : rd.GetDateTime(33),
                            EstReg = rd.GetString(34)[0]
                        },
                        DocumentoIdentidad = new DocumentoIdentidad()
                        {
                            DocIdeCod = rd.GetString(35),
                            DocIdeNom = rd.GetString(36),
                            DocIdeAbr = rd.GetString(37),
                            UsuIng = rd.GetString(38),
                            FecIng = rd.IsDBNull(39) ? (DateTime?)null : rd.GetDateTime(39),
                            UsuMod = rd.GetString(40),
                            FecMod = rd.IsDBNull(41) ? (DateTime?)null : rd.GetDateTime(41),
                            EstReg = rd.GetString(42)[0]
                        }
                    });
                }
                rd.Close();
            }
            catch (SqlException ex)
            {
                temporal = new List<Usuario>();
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return temporal;
        }

        public bool TienePermiso(string usuAno, string usuCod, string perNom)
        {
            bool tienePermiso = false;

            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_VERIFICAR_PERMISO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UsuAno", usuAno);
                cmd.Parameters.AddWithValue("@UsuCod", usuCod);
                cmd.Parameters.AddWithValue("@PerNom", perNom);

                SqlDataReader rd = cmd.ExecuteReader();
                if (rd.Read())
                {
                    tienePermiso = rd.GetInt32(0) > 0;
                }
                rd.Close();
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }

            return tienePermiso;
        }

        public Usuario BuscarUsuario(string ano, string cod)
        {
            Usuario usuario = null;

            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_BUSCAR_USUARIO_AUTH", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Ano", ano);
                cmd.Parameters.AddWithValue("@Cod", cod);

                SqlDataReader rd = cmd.ExecuteReader();
                if (rd.Read())
                {
                    usuario = new Usuario()
                    {
                        UsuAno = rd.GetString(0),
                        UsuCod = rd.GetString(1),
                        DocIdeCod = rd.GetString(2),
                        UsuNumDoc = rd.GetString(3),
                        UsuNom = rd.GetString(4),
                        UsuApe = rd.GetString(5),
                        UsuFecNac = rd.GetString(6),
                        UsuSex = rd.GetString(7)[0],
                        UsuCorEle = rd.GetString(8),
                        CarCod = rd.GetString(9),
                        UsuFecInc = rd.GetString(10),
                        UsuTel = rd.GetString(11),
                        UsuNomUsu = rd.GetString(12),
                        UsuPas = rd.GetString(13),
                        UsuEst = rd.GetString(14)[0],
                        RolCod = rd.GetString(15),
                        UsuIng = rd.GetString(16),
                        FecIng = rd.IsDBNull(17) ? (DateTime?)null : rd.GetDateTime(17),
                        UsuMod = rd.GetString(18),
                        FecMod = rd.IsDBNull(19) ? (DateTime?)null : rd.GetDateTime(19),
                        EstReg = rd.GetString(20)[0]
                    };
                }
                rd.Close();
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }

            return usuario;
        }

        public Usuario ValidarUsuario(string email, string password)
        {
            Usuario usuario = null;

            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_VALIDAR_USUARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Email", email);
                cmd.Parameters.AddWithValue("@Password", password);

                SqlDataReader rd = cmd.ExecuteReader();
                if (rd.Read())
                {
                    usuario = new Usuario()
                    {
                        UsuAno = rd.GetString(0),
                        UsuCod = rd.GetString(1),
                        UsuNom = rd.GetString(4),
                        UsuApe = rd.GetString(5),
                        UsuNomUsu = rd.GetString(12),

                        Cargo = new Cargo()
                        {
                            CarNom = rd.GetString(22)
                        },

                        Rol = new Rol()
                        {
                            RolCod = rd.GetString(28),
                            RolNom = rd.GetString(29)
                        }
                    };
                }
                rd.Close();
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }

            return usuario;
        }


    }
}
