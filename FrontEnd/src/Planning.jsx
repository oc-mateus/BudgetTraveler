import React from "react";
import { X, BedDouble, Utensils, Bus } from "lucide-react";
import { usePDF } from "react-to-pdf";
import { useTranslation } from "react-i18next"; // 1. Importar o hook

const PlanningTravel = ({ onClose, destinationChoosed }) => {
  const { t, i18n } = useTranslation(); // 2. Inicializar tradução

  const { toPDF, targetRef } = usePDF({
    filename: `plan-${destinationChoosed?.place || "travel"}.pdf`,
  });

  if (!destinationChoosed || !destinationChoosed.dailyCost) {
    return null;
  }

  // Lógica simples para definir o símbolo da moeda baseado no idioma
  const getCurrencySymbol = () => {
    switch (i18n.language) {
      case "en":
        return "$";
      case "es":
      case "fr":
        return "€";
      case "zh":
        return "¥";
      case "hi":
        return "₹";
      default:
        return "R$";
    }
  };

  const currency = getCurrencySymbol();

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4 transition-all">
      {/* O Card do Modal */}
      <div
        ref={targetRef}
        className="bg-white dark:bg-slate-900 w-full max-w-lg relative shadow-2xl animate-in fade-in zoom-in duration-300 md:rounded-3xl rounded-t-3xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Cabeçalho com Imagem/Gradiente */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative p-6 flex flex-col justify-end">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors backdrop-blur-md z-20"
          >
            <X size={20} />
          </button>
          <h2 className="text-3xl font-bold text-white tracking-tight relative z-10">
            {destinationChoosed.place}
          </h2>
          <div className="flex gap-2 mt-2 relative z-10">
            {destinationChoosed.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white px-2 py-1 rounded-full backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 overflow-y-auto">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm mb-6">
            {destinationChoosed.bio}
          </p>

          <h3 className="font-bold text-slate-800 dark:text-white mb-4 text-sm uppercase tracking-wide">
            {t("planejamento_diario") || "Planejamento Diário"}
          </h3>

          {/* Grid de Custos */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            {/* Hospedagem */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg">
                  <BedDouble size={20} />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {t("hospedagem")}
                </span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">
                {currency} {destinationChoosed.dailyCost.hosting}
              </span>
            </div>

            {/* Alimentação */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-lg">
                  <Utensils size={20} />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {t("alimentacao")}
                </span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">
                {currency} {destinationChoosed.dailyCost.food}
              </span>
            </div>

            {/* Transporte */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg">
                  <Bus size={20} />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {t("transporte")}
                </span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white">
                {currency} {destinationChoosed.dailyCost.transport}
              </span>
            </div>
          </div>

          <button
            onClick={() => toPDF()}
            className="w-full bg-slate-900 dark:bg-blue-600 text-white font-bold py-4 rounded-2xl mt-2 hover:bg-slate-800 dark:hover:bg-blue-700 hover:scale-[1.01] active:scale-95 transition-all shadow-lg"
          >
            {t("confirmar_salvar") || "Confirmar e Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export { PlanningTravel };
