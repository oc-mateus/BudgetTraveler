import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY.trim();

const genAi = new GoogleGenerativeAI(API_KEY);

app.post("/api/recommendations", async (req, res) => {
  const { budget, days, scope: finalDestination } = req.body;
  console.log(
    `Processando: R$${budget} por ${days} dias no ${finalDestination}`
  );

  try {
    const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
        Aja como uma API de viagens. O usuário tem R$ ${budget} para ${days} dias e quer viajar para ${finalDestination}.
        Gere 3 sugestões de destinos reais.
        
        IMPORTANTE: Retorne APENAS um Array JSON puro. Sem Markdown. Sem texto antes ou depois.
        Formato obrigatório:
        [
          {
            "id": 1,
            "place": "Cidade, País",
            "language": "Língua",
            dailyCost:
            {
              "hosting": 000,
              "food": 000,
              "transport": 000,
            },
            "bio": "Descrição curta e inspiradora.",
            "tags": ["Tag1", "Tag2"]
          }
        ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log("IA Respondeu!");

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const firstBracket = text.indexOf("[");
    const lastBracket = text.lastIndexOf("]");
    if (firstBracket !== -1 && lastBracket !== -1) {
      text = text.substring(firstBracket, lastBracket + 1);
    }

    res.json(JSON.parse(text));
  } catch (error) {
    console.error("ERRO:", error);
    res.status(500).json({ error: "Erro na IA", details: error.message });
  }
});

app.listen(3001, () => console.log("Servidor rodando na porta 3001"));
