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
  const { budget, days, scope: finalDestination, language } = req.body;

  console.log(
    `Processando: ${language} - R$${budget} por ${days} dias no ${finalDestination}`
  );

  try {
    const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
        Aja como uma API de viagens internacional. 
        O usuário tem um orçamento total de R$ ${budget} para passar ${days} dias em ${finalDestination}.
        Gere 10 sugestões de destinos reais.
        
        REGRAS DE IDIOMA:
        - Todo o conteúdo textual ("place", "language", "bio", "tags") deve ser escrito OBRIGATORIAMENTE no idioma: ${language}.
        - Se o idioma for 'en', escreva em Inglês. Se for 'pt', em Português, e assim por diante.

        IMPORTANTE: Retorne APENAS um Array JSON puro. Sem Markdown. Sem texto antes ou depois.
        Formato obrigatório:
        [
          {
            "id": 1,
            "place": "Nome da Cidade e País no idioma ${language}",
            "language": "Idioma falado no local escrito no idioma ${language}",
            "dailyCost": {
              "hosting": 000,
              "food": 000,
              "transport": 000
            },
            "bio": "Descrição curta e inspiradora no idioma ${language}.",
            "tags": ["Tag1", "Tag2"]
          }
        ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log(`IA Respondeu em ${language}!`);

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
