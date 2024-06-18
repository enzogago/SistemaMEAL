using Microsoft.Data.SqlClient;
namespace SistemaMEAL.Server.Modulos
{
    public class conexionDAO
    {
        //atributo de conexion de alcance local
        private SqlConnection cn = new SqlConnection(@"server=aea-ecuador-meal-dbserver-produccion.database.windows.net; Database=aea-ecuador-meal-database-simulador; User=AEA_Ecuador; Password=vE^50c9[d=9--+MIwq0ai6eos/yp; MultipleActiveResultSets=true; TrustServerCertificate=true; Encrypt=false");
        //propiedad donde retorna la conexion
        public SqlConnection getcn { get { return cn; } }

    }
}
