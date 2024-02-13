using System.ComponentModel.DataAnnotations;

namespace SistemaMEAL.Server.Models
{
    public class BeneficiarioMonitoreo
    {
        public Beneficiario? Beneficiario { get; set; }
        public MetaBeneficiario? MetaBeneficiario { get; set; }
        public List<DocumentoBeneficiario>? DocumentoBeneficiario { get; set; }

    }
}
