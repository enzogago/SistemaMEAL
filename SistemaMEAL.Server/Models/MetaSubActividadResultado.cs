using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace SistemaMEAL.Server.Models
{
    public class MetaSubActividadResultado
    {
        public String? ProAno { get; set; }
        public String? ProCod { get; set; }
        public String? ProNom { get; set; }

        public String? SubProAno { get; set; }
        public String? SubProCod { get; set; }
        public String? SubProNom { get; set; }

        public String? ResAno { get; set; }
        public String? ResCod { get; set; }
        public String? ResNom { get; set; }

        public String? ActResAno { get; set; }
        public String? ActResCod { get; set; }
        public String? ActResNom { get; set; }

        public String? SubActResAno { get; set; }
        public String? SubActResCod { get; set; }
        public String? SubActResNom { get; set; }

        public String? MetSubActResAno { get; set; }
        public String? MetSubActResCod { get; set; }

        public String? MetAno { get; set; }
        public String? MetCod { get; set; }
         public String? EstCod { get; set; }
        public String? EstNom { get; set; }
        public String? MetMetTec { get; set; }
        public String? MetEjeTec { get; set; }
        public String? MetPorAvaTec { get; set; }
        public String? MetMetPre { get; set; }
        public String? MetEjePre { get; set; }
        public String? MetPorAvaPre { get; set; }
        public String? MetMesPlaTec { get; set; }
        public String? MetAnoPlaTec { get; set; }
        public String? MetMesPlaPre { get; set; }
        public String? MetAnoPlaPre { get; set; }
        public String? TipValCod { get; set; }
        public String? FinCod { get; set; }
        public String? ImpCod { get; set; }
    }
}