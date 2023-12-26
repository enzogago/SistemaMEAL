using Microsoft.Data.SqlClient;
using SistemaMEAL.Server.Models;
using System.Data;

namespace SistemaMEAL.Server.Modulos
{
    public class UsuarioDAO
    {
        private conexionDAO cn = new conexionDAO();

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
