# Mateus Dev React

Site pessoal de portfólio desenvolvido em React para apresentar a trajetória profissional de Mateus Camargo Rodrigues como Desenvolvedor Full Stack.

## Stack

- React
- Vite
- CSS puro
- Integração com API de portfólio da Codexa

## Rodando localmente

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Integração de portfólio

A seção de projetos consome a API da Codexa usando a consulta:

```txt
GET https://codexa-portifolio-api.vercel.app/api/v1/portfolio-items?status=published&showInHome=true&limit=5
```
