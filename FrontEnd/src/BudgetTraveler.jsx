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
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";
import { PlanningTravel } from "./Planning";
import { usePDF } from "react-to-pdf";
import { useTranslation } from "react-i18next";

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
    alert("Erro ao conectar com o servidor.");
    return [];
  }
};

const BudgetTraveler = () => {
  const { t, i18n } = useTranslation();
  const [totalBudget, setTotalBudget] = useState(0);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const [scope, setScope] = useState("Mundo");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");

  const [expenses, setExpenses] = useState([
    { id: 1, category: "hospedagem", amount: 0 },
    { id: 2, category: "alimentacao", amount: 0 },
    { id: 3, category: "transporte", amount: 0 },
  ]);

  const currentDest = recommendations[currentIndex];

  const totalDailyCost = currentDest
    ? Number(currentDest.dailyCost.hosting) +
      Number(currentDest.dailyCost.food) +
      Number(currentDest.dailyCost.transport)
    : 0;

  // Lógica de moeda baseada no idioma
  const getCurrency = () => {
    const symbols = { pt: "R$", en: "$", es: "€", fr: "€", zh: "¥", hi: "₹" };
    return symbols[i18n.language] || "R$";
  };

  useEffect(() => {
    if (currentDest && currentDest.dailyCost) {
      setExpenses([
        {
          id: 1,
          category: "hospedagem",
          amount: currentDest.dailyCost.hosting,
        },
        { id: 2, category: "alimentacao", amount: currentDest.dailyCost.food },
        {
          id: 3,
          category: "transporte",
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

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  useEffect(() => {
    const rootElement = document.documentElement;
    if (theme === "dark") {
      rootElement.classList.add("dark");
    } else {
      rootElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

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
      return alert(t("placeholder_pais"));
    }
    if (totalBudget <= 0) return alert(t("seu_orcamento"));

    let finalDestination =
      scope === "Nacional" ? country : scope === "Estadual" ? state : scope;

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
    "w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 " +
    "bg-slate-50 dark:bg-slate-800 outline-none " +
    "focus:bg-white dark:focus:bg-slate-900 " +
    "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 " +
    "transition-all font-medium text-slate-700 dark:text-slate-100 " +
    "placeholder:text-slate-400 dark:placeholder:text-slate-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans text-slate-800 p-4 md:p-8 dark:from-slate-900 dark:to-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ESQUERDA: CONFIGURAÇÃO */}
        <div className="space-y-6 animate-in slide-in-from-left-10 duration-500">
          <header className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg shadow-blue-200 text-white transform rotate-3">
              <Plane size={32} />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t("boas_vindas")}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                {t("planejamento_inteligente")}
              </p>
            </div>

            {/* SELETOR DE IDIOMAS */}
            <div className="relative group">
              <button className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <Languages size={20} className="text-blue-600" />
                <span className="text-xs font-bold uppercase">
                  {i18n.language}
                </span>
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {["pt", "en", "es", "fr", "zh", "hi"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => i18n.changeLanguage(lang)}
                    className="w-full text-left px-4 py-2 text-xs font-bold hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors uppercase first:rounded-t-xl last:rounded-b-xl"
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 shadow-sm text-slate-600 dark:text-slate-300 transition-all active:scale-95"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </header>

          <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-2">
            <select
              className={inputStyle}
              onChange={(e) => setScope(e.target.value)}
              value={scope}
            >
              <option value="Mundo">{t("explorar_mundo")}</option>
              <option value="Nacional">{t("explorar_pais")}</option>
              <option value="Estadual">{t("explorar_estado")}</option>
            </select>

            {scope === "Nacional" && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <input
                  placeholder={t("placeholder_pais")}
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
                  placeholder={t("placeholder_estado")}
                  type="text"
                  className={inputStyle}
                  onChange={(e) => setState(e.target.value)}
                  value={state}
                />
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-800 dark:text-white">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Wallet size={20} />
              </div>
              {t("seu_orcamento")}
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">
                  {t("total")}
                </label>
                <input
                  type="number"
                  className="w-full text-3xl font-bold border-b-2 border-slate-100 dark:border-slate-700 focus:border-blue-500 outline-none py-2 text-slate-800 dark:text-white bg-transparent transition-colors"
                  placeholder="0"
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">
                  {t("dias")}
                </label>
                <input
                  type="number"
                  value={days}
                  className="w-full text-3xl font-bold border-b-2 border-slate-100 dark:border-slate-700 focus:border-blue-500 outline-none py-2 text-slate-800 dark:text-white bg-transparent transition-colors"
                  onChange={(e) => setDays(Number(e.target.value))}
                />
              </div>
            </div>

            <div
              className={`p-6 rounded-3xl text-white transition-all duration-500 ${
                remaining < 0
                  ? "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-200"
                  : "bg-gradient-to-br from-blue-600 to-indigo-600 shadow-blue-200"
              } relative overflow-hidden group shadow-xl`}
            >
              <div className="flex justify-between items-end relative z-10">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">
                    {t("disponivel_dia")}
                  </p>
                  <h3 className="text-5xl font-extrabold tracking-tight">
                    {getCurrency()} {budgetPerDay}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-70 mb-1">
                    {t("saldo_restante")}
                  </p>
                  <p className="font-semibold text-lg bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                    {getCurrency()} {remaining.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold mb-4 uppercase text-slate-400 tracking-wider">
              {t("despesas_fixas")}
            </h2>
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex justify-between items-center group p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <span className="text-slate-600 dark:text-slate-300 font-medium group-hover:text-blue-600 transition-colors">
                    {t(expense.category)}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                    {getCurrency()} {expense.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerateIdeas}
            disabled={loading}
            className="w-full bg-slate-900 dark:bg-slate-100 hover:bg-black dark:hover:bg-white text-white dark:text-slate-900 p-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-70 group"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Sparkles
                size={24}
                className="text-yellow-400 dark:text-blue-600 group-hover:animate-pulse"
              />
            )}
            {loading ? t("consultando_ai") : t("gerar_destinos")}
          </button>
        </div>

        {/* DIREITA: CARROSSEL */}
        <div className="relative h-full min-h-[600px] bg-slate-200/50 dark:bg-slate-900/60 rounded-[40px] overflow-hidden flex flex-col justify-center items-center p-6 border-8 border-white dark:border-slate-800 shadow-2xl">
          {!recommendations.length && !loading && (
            <div className="text-center text-slate-400 max-w-xs">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-full inline-block mb-6 shadow-sm">
                <MapPin size={48} />
              </div>
              <h3 className="text-xl font-bold text-slate-600 dark:text-slate-300 mb-2">
                {t("pronto_viajar")}
              </h3>
              <p className="leading-relaxed">{t("desc_vazio")}</p>
            </div>
          )}

          {loading && (
            <div className="text-center flex flex-col items-center gap-4">
              <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                {t("buscando_viagens")}
              </p>
            </div>
          )}

          {recommendations.length > 0 && !loading && (
            <div
              className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 cursor-pointer group"
              onClick={openModal}
            >
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 p-6 flex flex-col justify-end text-white relative">
                <h2 className="text-4xl font-bold relative z-10">
                  {currentDest.place}
                </h2>
                <div className="flex gap-2 text-sm opacity-90 mt-2 items-center z-10">
                  <Languages size={16} /> {currentDest.language}
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-6">
                  {currentDest.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-bold bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-8 line-clamp-3">
                  {currentDest.bio}
                </p>

                <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 mb-6">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {t("custo_estimado")}
                    </span>
                    <span
                      className={`font-bold text-lg ${
                        totalDailyCost > Number(budgetPerDay)
                          ? "text-red-500"
                          : "text-green-600"
                      }`}
                    >
                      {getCurrency()} {totalDailyCost}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
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
                  <p className="text-xs text-right mt-2 font-medium">
                    {totalDailyCost > Number(budgetPerDay)
                      ? t("acima_orcamento")
                      : t("dentro_orcamento")}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevSlide();
                    }}
                    className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {t("opcao_contagem", {
                      current: currentIndex + 1,
                      total: recommendations.length,
                    })}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextSlide();
                    }}
                    className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
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
