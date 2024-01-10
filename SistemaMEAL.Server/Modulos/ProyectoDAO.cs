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
                        SubProNom = rd.GetString(5),
                        ProAno = rd.GetString(6),
                        ProCod = rd.GetString(7),
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

        public IEnumerable<Proyecto> ListarProyectosUsuario(string usuAno, string usuCod)
        {
            List<Proyecto> proyectos = new List<Proyecto>();
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_OBTENER_PROYECTOS_USUARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@USUANO", usuAno);
                cmd.Parameters.AddWithValue("@USUCOD", usuCod);

                SqlDataReader rd = cmd.ExecuteReader();
                while (rd.Read())
                {
                    Proyecto proyecto = new Proyecto()
                    {
                        ProAno = rd.GetString(0),
                        ProCod = rd.GetString(1),
                        ProNom = rd.GetString(2),
                        ProRes = rd.GetString(3),
                        ProPer = rd.GetString(4)
                    };

                    proyectos.Add(proyecto);
                }
                rd.Close();
            }
            catch (SqlException ex)
            {
                proyectos = new List<Proyecto>();
                Console.WriteLine(ex.Message);
            }
            finally
            {
                cn.getcn.Close();
            }
            return proyectos;
        }

        public Proyecto ObtenerDetallesProyectoUsuario(string usuano, string usucod, string proano, string procod)
        {
            Proyecto proyecto = null;
            try
            {
                cn.getcn.Open();

                SqlCommand cmd = new SqlCommand("SP_OBTENER_DETALLES_PROYECTO_USUARIO", cn.getcn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@USUANO", usuano);
                cmd.Parameters.AddWithValue("@USUCOD", usucod);
                cmd.Parameters.AddWithValue("@PROANO", proano);
                cmd.Parameters.AddWithValue("@PROCOD", procod);

                SqlDataReader rd = cmd.ExecuteReader();
                while (rd.Read())
                {
                    if (proyecto == null)
                    {
                        proyecto = new Proyecto()
                        {
                            ProAno = rd.GetString(0),
                            ProCod = rd.GetString(1),
                            ProNom = rd.GetString(2),
                            ProRes = rd.GetString(3),
                            ProPer = rd.GetString(4),
                            SubProyecto = new List<SubProyecto>()
                        };
                    }

                    if (!rd.IsDBNull(5) && !rd.IsDBNull(6) && !rd.IsDBNull(7))
                    {
                        SubProyecto subproyecto = new SubProyecto()
                        {
                            SubProAno = rd.GetString(5),
                            SubProCod = rd.GetString(6),
                            SubProNom = rd.GetString(7),
                            ProAno = rd.GetString(8),
                            ProCod = rd.GetString(9),
                            Objetivo = new List<Objetivo>(),
                            Resultado = new List<Resultado>()
                        };

                        if (!rd.IsDBNull(10) && !rd.IsDBNull(11) && !rd.IsDBNull(12))
                        {
                            subproyecto.Objetivo.Add(new Objetivo()
                            {
                                ObjAno = rd.GetString(10),
                                ObjCod = rd.GetString(11),
                                ObjNom = rd.GetString(12),
                                SubProAno = rd.GetString(13),
                                SubProCod = rd.GetString(14)
                            });
                        }

                        if (!rd.IsDBNull(15) && !rd.IsDBNull(16) && !rd.IsDBNull(17))
                        {
                            subproyecto.Resultado.Add(new Resultado()
                            {
                                ResAno = rd.GetString(15),
                                ResCod = rd.GetString(16),
                                ResNom = rd.GetString(17),
                                ResPre = rd.GetString(18),
                                SubProAno = rd.GetString(19),
                                SubProCod = rd.GetString(20)
                            });
                        }

                        proyecto.SubProyecto.Add(subproyecto);
                    }
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
            return proyecto;
        }




    }
}