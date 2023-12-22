using Microsoft.Data.SqlClient;
using System.Text;
using System.Security.Cryptography;
namespace SistemaMEAL.Server.Modulos
{
    public class conexionDAO
    {
        //atributo de conexion de alcance local
        private SqlConnection cn = new SqlConnection(@"server=powermas.com.pe; Database=tentuap1_MEAL_ECUADOR_PRUEBA; User=tentuap1_MEAL_ECUADOR_PRUEBA; Password=PowerMas2024.; MultipleActiveResultSets=true; TrustServerCertificate=true; Encrypt=false");

        //propiedad donde retorna la conexion
        public SqlConnection getcn { get { return cn; } }

    }
}
