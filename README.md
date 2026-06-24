#SENAI - Serviço Nacional de Aprendizagem Industrial
#Curso: Técnico em Desenvolvimento de Sistemas
#Disciplina: Manutenção de Sistemas
#Docente: Renal Leal
#Discente: Jean Douglas Toledo Rodrigues Junior
#Turma: 2024/2


# Sistema de Gerenciamento de Adoção de Animais

Este é um projeto completo de gerenciamento de uma ONG ou centro de adoção de animais, composto por uma API robusta (Backend) e uma interface moderna e responsiva (Frontend).

## Visão Geral

O sistema permite o cadastro e controle de:
- **Usuários:** Administradores e funcionários que gerenciam o sistema.
- **Animais:** Registro detalhado de animais disponíveis para adoção, incluindo fotos e status.
- **Histórico de Adoção:** Registro de qual usuário adotou qual animal, mantendo um rastreio completo.

---

## Tecnologias Utilizadas

### **Backend (`manutencao_back`)**
- **Node.js** com **Express**
- **ORM:** Sequelize
- **Banco de Dados:** PostgreSQL (Hospedado no Supabase)
- **Autenticação:** JSON Web Token (JWT)
- **Segurança:** Bcryptjs para criptografia de senhas
- **Ferramentas:** Dotenv, CORS, Nodemon

### **Frontend (`manutencao_front`)**
- **React 19**
- **Build Tool:** Vite
- **Roteamento:** React Router Dom
- **Estilização:** Bootstrap & React-Bootstrap
- **Consumo de API:** Axios

---

## Estrutura do Projeto

```text
manutencao/
├── manutencao_back/    # Servidor API e Banco de Dados (Express + Sequelize)
│   ├── app.js          # Ponto de entrada
│   ├── models/         # Definições das tabelas do banco
│   ├── routes/         # Endpoints da API
│   └── Dockerfile      # Configuração para containerização
└── manutencao_front/   # Interface do Usuário (React + Vite)
    ├── src/pages/      # Páginas da aplicação
    └── src/components/ # Componentes reutilizáveis
```

---

## Como Configurar e Rodar o Projeto

### **Pré-requisitos**
- Node.js (versão 20+ recomendada)
- NPM ou Yarn
- Banco de Dados PostgreSQL (Hospedagem sugerida: Supabase)

### **1. Configurando o Backend (`manutencao_back`)**
1. Entre na pasta: `cd manutencao_back`
2. Instale as dependências: `npm install`
3. Configure o `.env` (baseado no `.env.example` se disponível):
   ```env
   BANCO_DE_DADOS='sua_url_postgre_sql'
   PORT=3000
   JWT_SECRET='sua_chave_secreta'
   ```
4. Inicie: `npm run dev`

#### **Rodando com Docker**
Caso prefira usar Docker:
```bash
docker build -t manutencao-back .
docker run -p 3000:3000 manutencao-back
```

### **2. Configurando o Frontend (`manutencao_front`)**
1. Entre na pasta: `cd manutencao_front`
2. Instale as dependências: `npm install`
3. Inicie: `npm run dev`

---

## Deployment

### **Backend (Vercel)**
O projeto está configurado para ser hospedado na **Vercel** através do arquivo `vercel.json`. Certifique-se de configurar as variáveis de ambiente no painel da Vercel.

### **Frontend**
Pode ser hospedado na Vercel, Netlify ou qualquer serviço de hospedagem estática. Basta rodar `npm run build` e fazer o upload da pasta `dist`.

---

## Autenticação e Segurança
O sistema utiliza **JWT (JSON Web Token)** para proteger as rotas. Ao fazer login, um token é gerado e deve ser enviado no cabeçalho das requisições privadas. As senhas dos usuários são protegidas por hash usando **Bcrypt**, garantindo que nem mesmo os administradores do banco de dados tenham acesso às senhas reais.

---

## Licença
Este projeto foi desenvolvido para fins educacionais (SENAI).
Para mais informações, contactar Jean Douglas Junior pelo email suporte@jeandouglas.com.br