using Microsoft.Data.SqlClient;
using System.Data;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;

namespace SistemaMEAL.Modulos
{
     public class MenuDAO
    {
        private conexionDAO cn = new conexionDAO();

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

    }
}