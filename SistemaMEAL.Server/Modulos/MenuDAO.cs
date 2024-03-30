using Microsoft.Data.SqlClient;
using System.Data;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;

namespace SistemaMEAL.Modulos
{
     public class MenuDAO
    {
        private conexionDAO cn = new conexionDAO();

        public bool InsertarMenuUsuario(string usuAno, string usuCod, string menAno, string menCod)
        {
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_INSERTAR_MENU_USUARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@USUANO", usuAno);
                cmd.Parameters.AddWithValue("@USUCOD", usuCod);
                cmd.Parameters.AddWithValue("@MENANO", menAno);
                cmd.Parameters.AddWithValue("@MENCOD", menCod);
                cmd.ExecuteNonQuery();

                return true;
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
            finally
            {
                cn.getcn.Close();
            }
        }

        public bool EliminarMenuUsuario(string usuAno, string usuCod, string menAno, string menCod)
        {
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_ELIMINAR_MENU_USUARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@USUANO", usuAno);
                cmd.Parameters.AddWithValue("@USUCOD", usuCod);
                cmd.Parameters.AddWithValue("@MENANO", menAno);
                cmd.Parameters.AddWithValue("@MENCOD", menCod);
                cmd.ExecuteNonQuery();

                return true;
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
            finally
            {
                cn.getcn.Close();
            }
        }
        public IEnumerable<Menu> ListadoMenuPorUsuario(string usuAno, string usuCod)
        {
            List<Menu> temporal = new List<Menu>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_LISTAR_MENU_POR_USUARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UsuAno", usuAno);
                cmd.Parameters.AddWithValue("@UsuCod", usuCod);
                SqlDataReader rd = cmd.ExecuteReader();
                while (rd.Read())
                {
                    temporal.Add(new Menu()
                    {
                        MenAno = rd.GetString(0),
                        MenCod = rd.GetString(1),
                        MenNom = rd.GetString(2),
                        MenRef = rd.GetString(3),
                        MenIco = rd.IsDBNull(4) ? null : rd.GetString(4),
                        MenOrd = rd.IsDBNull(5) ? null : rd.GetString(5),
                        MenAnoPad = rd.IsDBNull(6) ? null : rd.GetString(6),
                        MenCodPad = rd.IsDBNull(7) ? null : rd.GetString(7),
                        UsuIng = rd.GetString(8),
                        FecIng = rd.IsDBNull(9) ? (DateTime?)null : rd.GetDateTime(9),
                        UsuMod = rd.GetString(10),
                        FecMod = rd.IsDBNull(11) ? (DateTime?)null : rd.GetDateTime(11),
                        EstReg = rd.GetString(12)[0]
                    });
                }
                rd.Close();
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
            return temporal;
        }


        public IEnumerable<Menu> ListadoMenuPorRol(string rolCod)
        {
            List<Menu> temporal = new List<Menu>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_LISTAR_MENU_POR_ROL", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@RolCod", rolCod);
                SqlDataReader rd = cmd.ExecuteReader();
                while (rd.Read())
                {
                    temporal.Add(new Menu()
                    {
                        MenAno = rd.GetString(0),
                        MenCod = rd.GetString(1),
                        MenNom = rd.GetString(2),
                        MenRef = rd.GetString(3),
                        MenAnoPad = rd.IsDBNull(4) ? null : rd.GetString(4),
                        MenCodPad = rd.IsDBNull(5) ? null : rd.GetString(5),
                        UsuIng = rd.GetString(6),
                        FecIng = rd.IsDBNull(7) ? (DateTime?)null : rd.GetDateTime(7),
                        UsuMod = rd.GetString(8),
                        FecMod = rd.IsDBNull(9) ? (DateTime?)null : rd.GetDateTime(9),
                        EstReg = rd.GetString(10)[0],
                        MenIco = rd.IsDBNull(11) ? null : rd.GetString(11)
                    });
                }
                rd.Close();
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
            return temporal;
        }

        public IEnumerable<Menu> ListadoMenu()
        {
            List<Menu> temporal = new List<Menu>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_LISTAR_MENU", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                SqlDataReader rd = cmd.ExecuteReader();
                while (rd.Read())
                {
                    temporal.Add(new Menu()
                    {
                        MenAno = rd.GetString(0),
                        MenCod = rd.GetString(1),
                        MenNom = rd.GetString(2),
                        MenRef = rd.GetString(3),
                        MenIco = rd.IsDBNull(4) ? null : rd.GetString(4),
                        MenOrd = rd.IsDBNull(5) ? null : rd.GetString(5),
                        MenAnoPad = rd.IsDBNull(6) ? null : rd.GetString(6),
                        MenCodPad = rd.IsDBNull(7) ? null : rd.GetString(7),
                        UsuIng = rd.GetString(8),
                        FecIng = rd.IsDBNull(9) ? (DateTime?)null : rd.GetDateTime(9),
                        UsuMod = rd.GetString(10),
                        FecMod = rd.IsDBNull(11) ? (DateTime?)null : rd.GetDateTime(11),
                        EstReg = rd.GetString(12)[0]
                    });
                }
                rd.Close();
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
            return temporal;
        }

    }
}