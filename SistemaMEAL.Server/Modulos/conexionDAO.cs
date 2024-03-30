using Microsoft.Data.SqlClient;
using System.Text;
using System.Security.Cryptography;
namespace SistemaMEAL.Server.Modulos
{
    public class conexionDAO
    {
        //atributo de conexion de alcance local
        private SqlConnection cn = new SqlConnection(@"server=aea-ecuador-meal-dbserver.database.windows.net; Database=aea-ecuador-meal-dbserver-prod; User=AEA_Ecuador; Password=vE^50c9[d=9--+MIwq0ai6eos/yp; MultipleActiveResultSets=true; TrustServerCertificate=true; Encrypt=false");
        //propiedad donde retorna la conexion
        public SqlConnection getcn { get { return cn; } }

    }
}
