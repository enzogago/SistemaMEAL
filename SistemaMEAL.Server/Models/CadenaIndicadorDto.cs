namespace SistemaMEAL.Server.Models
{
    public class CadenaIndicadorDto
    {
        public List<CadenaPeriodo>? CadenaPeriodos { get; set; }
        public List<CadenaImplementador>? CadenaImplementadores { get; set; }
        public List<CadenaFinanciador>? CadenaFinanciadores { get; set; }
        public List<CadenaUbicacion>? CadenaUbicaciones { get; set; }
        public List<Indicador>? Indicadores { get; set; }

    }
}
