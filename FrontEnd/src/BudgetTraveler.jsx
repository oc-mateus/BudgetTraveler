import React, { useState, useEffect } from "react";
import {
  Wallet,
  Calendar,
  Plane,
  Trash2,
  MapPin,
  Languages,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader2,
} from "lucide-react";

const generateGeminiRecommendations = async (budget, days) => {
  try {
    const response = await fetch("http://127.0.0.1:3001/api/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ budget, days }),
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

  const updateExpense = (id, value) => {
    setExpenses((prev) =>
      prev.map((exp) =>
        exp.id === id ? { ...exp, amount: Number(value) } : exp
      )
    );
  };

  const handleGenerateIdeas = async () => {
    if (totalBudget <= 0) return alert("Por Favor, defina um orçamento!");

    setLoading(true);
    try {
      const data = await generateGeminiRecommendations(totalBudget, days);
      setRecommendations(data);
      setCurrentIndex(0);
    } catch (error) {
      console.log("Erro na IA", error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % recommendations.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? recommendations.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ESQUERDA: CONFIGURAÇÃO */}
        <div className="space-y-6">
          <header className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
              <Plane className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                BudgetTraveler AI
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                PLANEJAMENTO INTELIGENTE
              </p>
            </div>
          </header>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Wallet size={20} className="text-blue-500" /> Seu Orçamento
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Total (R$)
                </label>
                <input
                  type="number"
                  className="w-full text-2xl font-bold border-b-2 border-slate-200 focus:border-blue-500 outline-none py-2 text-slate-700 placeholder-slate-300"
                  placeholder="0.00"
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Dias
                </label>
                <input
                  type="number"
                  value={days}
                  className="w-full text-2xl font-bold border-b-2 border-slate-200 focus:border-blue-500 outline-none py-2 text-slate-700"
                  onChange={(e) => setDays(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Resultado Rápido */}
            <div
              className={`p-5 rounded-2xl text-white transition-colors duration-300 ${
                remaining < 0
                  ? "bg-red-500 shadow-red-200"
                  : "bg-blue-600 shadow-blue-200"
              } shadow-xl`}
            >
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Disponível / Dia
                  </p>
                  <h3 className="text-4xl font-bold tracking-tight">
                    R$ {budgetPerDay}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-70">Saldo Total</p>
                  <p className="font-semibold">R$ {totalBudget.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold mb-4">Despesas Fixas</h2>
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex justify-between items-center group"
                >
                  <span className="text-slate-600 font-medium group-hover:text-blue-600 transition-colors">
                    {expense.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-300 text-sm">R$</span>
                    <input
                      type="text"
                      className="w-20 text-right font-semibold border-b border-transparent hover:border-slate-200 focus:border-blue-500 outline-none transition-all"
                      value={expense.amount}
                      readOnly
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerateIdeas}
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Sparkles size={20} className="text-yellow-400" />
            )}
            {loading ? "Consultando Gemini..." : "Gerar Destinos com IA"}
          </button>
        </div>

        {/* DIREITA: CARROSSEL DE DESTINOS (IA) */}
        <div className="relative h-full min-h-[500px] bg-slate-200 rounded-3xl overflow-hidden flex flex-col justify-center items-center p-6 border-4 border-white shadow-2xl">
          {!recommendations.length && !loading && (
            <div className="text-center text-slate-400 max-w-xs">
              <MapPin size={48} className="mx-auto mb-4 opacity-20" />
              <p>
                Preencha seu orçamento e peça para a IA sugerir destinos
                incríveis.
              </p>
            </div>
          )}

          {loading && (
            <div className="text-center animate-pulse">
              <div className="w-16 h-16 bg-slate-300 rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-slate-300 rounded w-32 mx-auto"></div>
            </div>
          )}

          {recommendations.length > 0 && !loading && (
            <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
              {/* Header do Card - Imagem Placeholder (Pode usar API de Imagem aqui) */}
              <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 p-6 flex flex-col justify-end text-white">
                <h2 className="text-3xl font-bold">{currentDest.place}</h2>
                <div className="flex gap-2 text-sm opacity-90 mt-1">
                  <Languages size={14} /> {currentDest.language}
                </div>
              </div>

              {/* Corpo do Card */}
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentDest.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {currentDest.bio}
                </p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-slate-500">Custo Estimado/Dia</span>
                    <span className="font-bold text-slate-800">
                      R$ {totalDailyCost}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full ${
                        totalDailyCost > Number(budgetPerDay)
                          ? "bg-red-400"
                          : "bg-green-400"
                      }`}
                      style={{
                        width: `${Math.min(
                          (totalDailyCost / Number(budgetPerDay)) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-right mt-1 text-slate-400">
                    {totalDailyCost > Number(budgetPerDay)
                      ? "Acima do seu budget"
                      : "Dentro do budget"}
                  </p>
                </div>

                {/* Controles do Carrossel */}
                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={prevSlide}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <span className="text-xs font-bold text-slate-300">
                    {currentIndex + 1} / {recommendations.length}
                  </span>
                  <button
                    onClick={nextSlide}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetTraveler;
