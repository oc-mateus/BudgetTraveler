import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ ERRO: Chave não encontrada no .env");
  process.exit(1);
}

// Remove espaços em branco extras que causam erro 404
const cleanKey = apiKey.trim();

console.log(
  `🔑 Testando chave: ${cleanKey.substring(0, 10)}... (final oculto)`
);

const genAI = new GoogleGenerativeAI(cleanKey);

async function listModels() {
  try {
    // Truque: Vamos fazer uma requisição HTTP direta para listar os modelos
    // já que o SDK às vezes mascara o erro real.
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`
    );

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log(
      "\n✅ SUCESSO! A API respondeu. Aqui estão os modelos disponíveis para você:\n"
    );

    const availableModels = data.models.filter((m) =>
      m.supportedGenerationMethods.includes("generateContent")
    );

    availableModels.forEach((model) => {
      console.log(`   - ${model.name.replace("models/", "")}`);
    });

    console.log("\nRecomendação: Use um dos nomes acima no seu server.js");
  } catch (error) {
    console.error("\n❌ FALHA GRAVE: A chave não está funcionando.");
    console.error("Motivo:", error.message);
    console.log(
      "Dica: Verifique se você copiou a chave inteira ou se há espaços extras."
    );
  }
}

listModels();
