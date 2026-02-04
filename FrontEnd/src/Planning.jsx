import React from "react";
import { X, BedDouble, Utensils, Bus } from "lucide-react"; // Adicionei ícones novos

const PlanningTravel = ({ onClose, destinationChoosed }) => {
  if (!destinationChoosed || !destinationChoosed.dailyCost) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4 transition-all">
      {/* O Card do Modal */}
      <div className="bg-white w-full max-w-lg relative shadow-2xl animate-in fade-in zoom-in duration-300 md:rounded-3xl rounded-t-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabeçalho com Imagem/Gradiente */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative p-6 flex flex-col justify-end">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors backdrop-blur-md"
          >
            <X size={20} />
          </button>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {destinationChoosed.place}
          </h2>
          <div className="flex gap-2 mt-2">
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

        {/* Conteúdo com Scroll se for muito grande */}
        <div className="p-6 overflow-y-auto">
          <p className="text-slate-600 leading-relaxed text-sm mb-6">
            {destinationChoosed.bio}
          </p>

          <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide">
            Planejamento Diário
          </h3>

          {/* Grid de Custos Moderno */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            {/* Card Hospedagem */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <BedDouble size={20} />
                </div>
                <span className="font-medium text-slate-700">Hospedagem</span>
              </div>
              <span className="font-bold text-slate-900">
                R$ {destinationChoosed.dailyCost.hosting}
              </span>
            </div>

            {/* Card Alimentação */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <Utensils size={20} />
                </div>
                <span className="font-medium text-slate-700">Alimentação</span>
              </div>
              <span className="font-bold text-slate-900">
                R$ {destinationChoosed.dailyCost.food}
              </span>
            </div>

            {/* Card Transporte */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <Bus size={20} />
                </div>
                <span className="font-medium text-slate-700">Transporte</span>
              </div>
              <span className="font-bold text-slate-900">
                R$ {destinationChoosed.dailyCost.transport}
              </span>
            </div>
          </div>

          <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl mt-2 hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-slate-200">
            Confirmar e Salvar Viagem
          </button>
        </div>
      </div>
    </div>
  );
};

export { PlanningTravel };
