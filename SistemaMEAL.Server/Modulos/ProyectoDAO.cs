using Microsoft.Data.SqlClient;
using System.Data;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;

namespace SistemaMEAL.Modulos
{
    public class ProyectoDAO
    {
        private conexionDAO cn = new conexionDAO();

       public IEnumerable<Proyecto> Listado()
        {
            List<Proyecto> temporal = new List<Proyecto>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_LISTAR_SUBPROYECTO_PROYECTO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                SqlDataReader rd = cmd.ExecuteReader();
                while (rd.Read())
                {
                    Proyecto proyecto = new Proyecto()
                {
                    ProAno = rd.GetString(0),
                    ProCod = rd.GetString(1),
                    ProNom = rd.GetString(2),
                    SubProyecto = new List<SubProyecto>()
                };

                if (!rd.IsDBNull(3) && !rd.IsDBNull(4) && !rd.IsDBNull(5))
                {
                    proyecto.SubProyecto.Add(new SubProyecto()
                    {
                        SubProAno = rd.GetString(3),
                        SubProCod = rd.GetString(4),
                        SubProNom = rd.GetString(5)
                    });
                }

                temporal.Add(proyecto);
                }
                rd.Close();
            }
            catch (SqlException ex)
            {
                temporal = new List<Proyecto>();
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