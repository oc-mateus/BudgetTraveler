# BudgetTraveler AI

> Onde seu orçamento encontra o destino perfeito.

![Project Status](https://img.shields.io/badge/status-online-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Tech](https://img.shields.io/badge/stack-MERN-orange)

## Sobre o Projeto

O **BudgetTraveler AI** é uma aplicação Fullstack que utiliza a Inteligência Artificial do Google (Gemini 2.5 Flash) para resolver um problema comum: *"Para onde posso viajar com o dinheiro que tenho?"*.

Diferente de buscadores comuns, o sistema analisa o orçamento total e a duração da viagem para sugerir destinos compatíveis, gerando automaticamente uma estimativa detalhada de gastos diários (Hospedagem, Alimentação e Transporte) baseada no custo de vida local atual.

## Funcionalidades Principais

* **Consultoria de Viagem com IA:** Integração com a API do Google Gemini para sugerir destinos reais e contextualizados.
* **Orçamento Inteligente:** Cálculo automático de "Disponível por dia" baseado no input do usuário.
* **Breakdown de Custos:** A IA retorna não apenas o lugar, mas quanto você gastará em média com hotel, comida e locomoção.
* **Feedback Visual:** Barra de progresso dinâmica que indica se o destino sugerido cabe no seu bolso (Verde/Vermelho).
* **Interface Reativa:** Inputs de despesas que se preenchem automaticamente ao navegar pelo carrossel de destinos, mas permitem visualização clara dos custos estimados.

## Tecnologias Utilizadas

### Frontend
* **React.js** (Vite)
* **Tailwind CSS** (Estilização moderna e responsiva)
* **Lucide React** (Ícones)

### Backend
* **Node.js** & **Express**
* **Google Generative AI SDK** (@google/generative-ai)
* **Cors** & **Dotenv**

### Infraestrutura & Deploy
* **Frontend:** (Ex: Vercel / Netlify)
* **Backend:** (Ex: Render / Railway / AWS)

## Arquitetura da Solução

O sistema funciona com uma arquitetura cliente-servidor segura:

1.  **Input:** O usuário insere o orçamento e dias no Frontend.
2.  **Processamento:** O Backend recebe os dados e cria um **Prompt Engineering** estruturado para o modelo `gemini-2.5-flash`, exigindo uma resposta estrita em JSON.
3.  **IA Generativa:** O Google Gemini analisa o pedido e retorna destinos com custos reais estimados de mercado.
4.  **Renderização:** O Frontend processa o JSON e atualiza os componentes visuais (Carrossel e Painel de Despesas) em tempo real.

## Screenshots

<img width="1600" height="754" alt="Captura de tela de 2026-01-30 06-15-49" src="https://github.com/user-attachments/assets/77769793-f32e-4b6b-9bcf-64f1f7c37fef" />


<img width="1600" height="754" alt="Captura de tela de 2026-01-30 06-14-49" src="https://github.com/user-attachments/assets/0e9ba86a-2e86-46cc-8839-7d675f39f985" />



## Contribuição

Sugestões e feedbacks são bem-vindos! Sinta-se à vontade para entrar em contato.

## Autor

Desenvolvido por **Mateus C. Oliveira**
* [LinkedIn](https://www.linkedin.com/in/oc-mateus)
* [GitHub](https://github.com/oc-mateus)

---
*Este projeto é para fins de estudo e portfólio.*
