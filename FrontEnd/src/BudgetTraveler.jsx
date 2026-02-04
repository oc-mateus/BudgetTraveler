import React, { useState, useEffect } from "react";
import {
  Wallet,
  Plane,
  MapPin,
  Languages,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader2,
} from "lucide-react";
import { PlanningTravel } from "./Planning";

const generateGeminiRecommendations = async (
  budget,
  days,
  finalDestination
) => {
  try {
    const response = await fetch("http://127.0.0.1:3001/api/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ budget, days, scope: finalDestination }),
    });

    if (!response.ok) {
      throw new Error("Erro ao conectar com o servidor");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro: ", error);
    alert(
      "Não foi possivel buscar destinos reais agora. Verifique o servidor."
    );
    return [];
  }
};

const BudgetTraveler = () => {
  const [totalBudget, setTotalBudget] = useState(0);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);

  const [scope, setScope] = useState("Mundo");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");

  const [expenses, setExpenses] = useState([
    { id: 1, category: "Hospedagem", amount: 0 },
    { id: 2, category: "Alimentação", amount: 0 },
    { id: 3, category: "Transporte", amount: 0 },
  ]);

  const currentDest = recommendations[currentIndex];

  const totalDailyCost = currentDest
    ? Number(currentDest.dailyCost.hosting) +
      Number(currentDest.dailyCost.food) +
      Number(currentDest.dailyCost.transport)
    : 0;

  useEffect(() => {
    if (currentDest && currentDest.dailyCost) {
      setExpenses([
        {
          id: 1,
          category: "Hospedagem",
          amount: currentDest.dailyCost.hosting,
        },
        { id: 2, category: "Alimentação", amount: currentDest.dailyCost.food },
        {
          id: 3,
          category: "Transporte",
          amount: currentDest.dailyCost.transport,
        },
      ]);
    }
  }, [currentDest]);

  const totalSpent = expenses.reduce(
    (acc, curr) => acc + Number(curr.amount),
    0
  );
  const remaining = totalBudget - totalSpent;
  const budgetPerDay = remaining > 0 ? (remaining / days).toFixed(2) : 0;

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % recommendations.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? recommendations.length - 1 : prev - 1
    );
  };

  const handleGenerateIdeas = async () => {
    if (
      (scope === "Nacional" && !country) ||
      (scope === "Estadual" && !state)
    ) {
      return alert("Por favor, preencha o local de destino corretamente!");
    }

    if (totalBudget <= 0) return alert("Por favor, defina um orçamento!");

    let finalDestination = scope;
    if (scope === "Nacional") {
      finalDestination = country;
    } else if (scope === "Estadual") {
      finalDestination = state;
    }

    setLoading(true);
    try {
      const data = await generateGeminiRecommendations(
        totalBudget,
        days,
        finalDestination
      );
      setRecommendations(data);
      setCurrentIndex(0);
    } catch (error) {
      console.log("Erro na IA", error);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full p-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-700 placeholder:text-slate-400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans text-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ESQUERDA: CONFIGURAÇÃO */}
        <div className="space-y-6 animate-in slide-in-from-left-10 duration-500">
          <header className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg shadow-blue-200 text-white transform rotate-3">
              <Plane size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                BudgetTraveler AI
              </h1>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">
                Planejamento Inteligente
              </p>
            </div>
          </header>

          {/* Seção de Seleção de Destino */}
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 space-y-2">
            <select
              className={inputStyle}
              onChange={(e) => setScope(e.target.value)}
              value={scope}
            >
              <option value="Mundo">Explorar o Mundo 🌍</option>
              <option value="Nacional">Explorar um País 🇧🇷</option>
              <option value="Estadual">Explorar um Estado 🗺️</option>
            </select>

            {/* Inputs Condicionais */}
            {scope === "Nacional" && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <input
                  placeholder="Digite o País (ex: Japão)..."
                  type="text"
                  className={inputStyle}
                  onChange={(e) => setCountry(e.target.value)}
                  value={country}
                />
              </div>
            )}

            {scope === "Estadual" && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <input
                  placeholder="Digite o Estado (ex: Bahia)..."
                  type="text"
                  className={inputStyle}
                  onChange={(e) => setState(e.target.value)}
                  value={state}
                />
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-800">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Wallet size={20} />
              </div>
              Seu Orçamento
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">
                  Total (R$)
                </label>
                <input
                  type="number"
                  className="w-full text-3xl font-bold border-b-2 border-slate-100 focus:border-blue-500 outline-none py-2 text-slate-800 placeholder-slate-200 bg-transparent transition-colors"
                  placeholder="0"
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">
                  Dias
                </label>
                <input
                  type="number"
                  value={days}
                  className="w-full text-3xl font-bold border-b-2 border-slate-100 focus:border-blue-500 outline-none py-2 text-slate-800 bg-transparent transition-colors"
                  onChange={(e) => setDays(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Resultado Rápido com Gradiente */}
            <div
              className={`p-6 rounded-3xl text-white transition-all duration-500 ${
                remaining < 0
                  ? "bg-gradient-to-br from-red-500 to-rose-600 shadow-xl shadow-red-200"
                  : "bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl shadow-blue-200"
              } relative overflow-hidden group`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/20 transition-all"></div>

              <div className="flex justify-between items-end relative z-10">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">
                    Disponível / Dia
                  </p>
                  <h3 className="text-5xl font-extrabold tracking-tight">
                    R$ {budgetPerDay}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-70 mb-1">Saldo Restante</p>
                  <p className="font-semibold text-lg bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                    R$ {remaining.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 opacity-80 hover:opacity-100 transition-opacity">
            <h2 className="text-sm font-bold mb-4 uppercase text-slate-400 tracking-wider">
              Despesas Fixas Estimadas
            </h2>
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex justify-between items-center group p-2 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <span className="text-slate-600 font-medium group-hover:text-blue-600 transition-colors">
                    {expense.category}
                  </span>
                  <span className="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                    R$ {expense.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerateIdeas}
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-black text-white p-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Sparkles
                size={24}
                className="text-yellow-400 group-hover:animate-pulse"
              />
            )}
            {loading ? "Consultando Gemini..." : "Gerar Destinos com IA"}
          </button>
        </div>

        {/* DIREITA: CARROSSEL DE DESTINOS (IA) */}
        <div className="relative h-full min-h-[600px] bg-slate-200/50 rounded-[40px] overflow-hidden flex flex-col justify-center items-center p-6 border-8 border-white shadow-2xl animate-in slide-in-from-right-10 duration-500">
          {/* Estado Vazio */}
          {!recommendations.length && !loading && (
            <div className="text-center text-slate-400 max-w-xs">
              <div className="bg-white p-6 rounded-full inline-block mb-6 shadow-sm">
                <MapPin size={48} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-600 mb-2">
                Pronto para viajar?
              </h3>
              <p className="leading-relaxed">
                Preencha seu orçamento e peça para a IA sugerir destinos
                incríveis baseados no seu bolso.
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center flex flex-col items-center gap-4">
              <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium animate-pulse">
                Encontrando as melhores viagens...
              </p>
            </div>
          )}

          {/* Card do Destino */}
          {recommendations.length > 0 && !loading && (
            <div
              className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 cursor-pointer group hover:scale-[1.02] transition-transform"
              onClick={openModal}
            >
              {/* Header do Card */}
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 p-6 flex flex-col justify-end text-white relative overflow-hidden">
                {/* Bolhas decorativas */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute top-10 left-0 w-20 h-20 bg-black/10 rounded-full blur-xl"></div>

                <h2 className="text-4xl font-bold relative z-10">
                  {currentDest.place}
                </h2>
                <div className="flex gap-2 text-sm opacity-90 mt-2 items-center relative z-10 font-medium">
                  <Languages size={16} /> {currentDest.language}
                </div>
              </div>

              {/* Corpo do Card */}
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-6">
                  {currentDest.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-slate-600 text-sm leading-relaxed mb-8 line-clamp-3">
                  {currentDest.bio}
                </p>

                {/* Barra de Progresso do Budget */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-6">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-slate-500 font-medium">
                      Custo Estimado/Dia
                    </span>
                    <span
                      className={`font-bold text-lg ${
                        totalDailyCost > Number(budgetPerDay)
                          ? "text-red-500"
                          : "text-green-600"
                      }`}
                    >
                      R$ {totalDailyCost}
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-3 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ease-out ${
                        totalDailyCost > Number(budgetPerDay)
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          (totalDailyCost / Number(budgetPerDay)) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>

                  <p className="text-xs text-right mt-2 font-medium text-slate-400">
                    {totalDailyCost > Number(budgetPerDay)
                      ? "⚠️ Acima do orçamento"
                      : "✅ Dentro do orçamento"}
                  </p>
                </div>

                {/* Controles do Carrossel */}
                <div className="flex justify-between items-center pt-2 border-t border-slate-100 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevSlide();
                    }}
                    className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-600 hover:text-blue-600"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Opção {currentIndex + 1} de {recommendations.length}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextSlide();
                    }}
                    className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-600 hover:text-blue-600"
                  >
                    <ArrowRight size={24} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div>
        {isModalOpen && (
          <PlanningTravel
            onClose={closeModal}
            destinationChoosed={currentDest}
          />
        )}
      </div>
    </div>
  );
};

export default BudgetTraveler;
