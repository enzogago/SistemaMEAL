using Microsoft.Data.SqlClient;
using System.Data;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;

namespace SistemaMEAL.Modulos
{
    public class RolDAO
    {
        private conexionDAO cn = new conexionDAO();

        public IEnumerable<Rol> Listado()
        {
            List<Rol> temporal = new List<Rol>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_LISTAR_ROLES", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                SqlDataReader rd = cmd.ExecuteReader();
                while (rd.Read())
                {
                    temporal.Add(new Rol()
                    {
                        RolCod = rd.GetString(0),
                        RolNom = rd.GetString(1),
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
                temporal = new List<Rol>();
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
