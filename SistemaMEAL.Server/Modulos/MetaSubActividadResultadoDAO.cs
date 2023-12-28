using Microsoft.Data.SqlClient;
using System.Data;
using SistemaMEAL.Server.Models;
using SistemaMEAL.Server.Modulos;

public class MetaSubActividadResultadoDAO
{
    private conexionDAO cn = new conexionDAO();

    public IEnumerable<MetaSubActividadResultado> Listado()
    {
        List<MetaSubActividadResultado> temporal = new List<MetaSubActividadResultado>();
        try
        {
            cn.getcn.Open();

            SqlCommand cmd = new SqlCommand("SP_LISTAR_MONITOREO", cn.getcn);
            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataReader rd = cmd.ExecuteReader();
            while (rd.Read())
            {
                temporal.Add(new MetaSubActividadResultado()
                {
                    ProAno = rd.GetString(0),
                    ProCod = rd.GetString(1),
                    ProNom = rd.GetString(2),
                    SubProAno = rd.GetString(3),
                    SubProCod = rd.GetString(4),
                    SubProNom = rd.GetString(5),
                    ResAno = rd.GetString(6),
                    ResCod = rd.GetString(7),
                    ResNom = rd.GetString(8),
                    ActResAno = rd.GetString(9),
                    ActResCod = rd.GetString(10),
                    ActResNom = rd.GetString(11),
                    SubActResAno = rd.GetString(12),
                    SubActResCod = rd.GetString(13),
                    SubActResNom = rd.GetString(14),
                    MetSubActResAno = rd.GetString(15),
                    MetSubActResCod = rd.GetString(16),
                    MetAno = rd.GetString(17),
                    MetCod = rd.GetString(18),
                    EstCod = rd.GetString(19),
                    EstNom = rd.GetString(20),
                    MetMetTec = rd.GetString(21),
                    MetEjeTec = rd.GetString(22),
                    MetPorAvaTec = rd.GetString(23),
                    MetMetPre = rd.GetString(24),
                    MetEjePre = rd.GetString(25),
                    MetPorAvaPre = rd.GetString(26),
                    MetMesPlaTec = rd.GetString(27),
                    MetAnoPlaTec = rd.GetString(28),
                    MetMesPlaPre = rd.GetString(29),
                    MetAnoPlaPre = rd.GetString(30),
                    TipValCod = rd.GetString(31),
                    FinCod = rd.GetString(32),
                    ImpCod = rd.GetString(33)
                });
            }
            rd.Close();
        }
        catch (SqlException ex)
        {
            temporal = new List<MetaSubActividadResultado>();
            Console.WriteLine(ex.Message);
        }
        finally
        {
            cn.getcn.Close();
        }
        return temporal;
    }
}
