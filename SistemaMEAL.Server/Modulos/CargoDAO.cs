using Microsoft.Data.SqlClient;
using System.Data;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;

namespace SistemaMEAL.Modulos
{
    public class CargoDAO
    {
        private conexionDAO cn = new conexionDAO();

        public IEnumerable<Cargo> Listado()
        {
            List<Cargo> temporal = new List<Cargo>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_LISTAR_CARGOS", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                SqlDataReader rd = cmd.ExecuteReader();
                while (rd.Read())
                {
                    temporal.Add(new Cargo()
                    {
                        CarCod = rd.GetString(0),
                        CarNom = rd.GetString(1),
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
                temporal = new List<Cargo>();
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
