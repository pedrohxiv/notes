# Projeto Notes

## Descrição do Projeto

O Notes é uma plataforma web moderna que permite a criação, leitura, atualização e remoção de notas. Ele inclui funcionalidades avançadas, como pinagem e despinagem de notas, busca de notas através de uma barra de pesquisa e integração de um sistema de autenticação completo. O projeto oferece uma interface segura para cadastro, login, verificação de e-mail, recuperação de senha e proteção de rotas através da verificação de usuários autenticados.

## Principais Funcionalidades

- **Autenticação Segura:** Sistema de autenticação robusto, incluindo as operações de cadastro (sign up), login, logout, e proteção de rotas com verificação de usuário.
- **Verificação de E-mail:** Após o cadastro, um código de verificação é enviado para o e-mail do usuário, que precisa ser validado para confirmar a conta.

- **Recuperação de Senha:** Sistema de recuperação de senha que envia um link para o e-mail do usuário, permitindo a redefinição segura da senha.

- **Notas Pessoais:**

  - **Criação de Notas:** Usuários podem criar novas notas com título, conteúdo e tags.
  - **Edição e Atualização:** É possível editar e atualizar as notas existentes.
  - **Pinagem e Despinagem:** Notas podem ser pinadas no topo para fácil acesso ou despinadas conforme necessário.
  - **Busca de Notas:** Inclui uma barra de busca que permite ao usuário encontrar notas específicas por título ou conteúdo.
  - **Remoção de Notas:** Usuários podem remover notas permanentemente.

- **Proteção de Rotas (Protected Routes):** Apenas usuários autenticados podem acessar determinadas rotas, como a dashboard, utilizando um método de verificação de usuário.

- **Informação de Dados do Usuário:** O sistema oferece a visualização de seus dados pessoais, como nome, ao canto superior da página.

## Dependências

O projeto utiliza as seguintes dependências para garantir seu funcionamento eficiente:

- `@prisma/client`: ^5.19.1,
- `bcryptjs`: ^2.4.3,
- `cookie-parser`: ^1.4.6,
- `cors`: ^2.8.5,
- `crypto`: ^1.0.1,
- `express`: ^4.19.2,
- `jsonwebtoken`: ^9.0.2,
- `resend`: ^4.0.0,
- `@types/bcryptjs`: ^2.4.6,
- `@types/cookie-parser`: ^1.4.7,
- `@types/cors`: ^2.8.17,
- `@types/express`: ^4.17.21,
- `@types/jsonwebtoken`: ^9.0.6,
- `dotenv`: ^16.4.5,
- `nodemon`: ^3.1.4,
- `prisma`: ^5.19.1,
- `ts-node`: ^10.9.2,
- `typescript`: ^5.5.4,
- `axios`: ^1.7.7,
- `clsx`: ^2.1.1,
- `date-fns`: ^3.6.0,
- `lucide-react`: ^0.439.0,
- `react`: ^18.3.1,
- `react-dom`: ^18.3.1,
- `react-hot-toast`: ^2.4.1,
- `react-modal`: ^3.16.1,
- `react-router-dom`: ^6.26.1,
- `tailwind-merge`: ^2.5.2,
- `@types/react`: ^18.3.3,
- `@types/react-dom`: ^18.3.0,
- `@types/react-modal`: ^3.16.3,
- `@vitejs/plugin-react`: ^4.3.1,
- `autoprefixer`: ^10.4.20,
- `postcss`: ^8.4.45,
- `tailwindcss`: ^3.4.10,
- `typescript`: ^5.5.4,
- `vite`: ^5.4.1,

## Como Executar o Projeto

1. Clone este repositório em sua máquina local.
2. Certifique-se de ter o Node.js e o npm (ou yarn) instalados.
3. Instale as dependências do projeto nos arquivos **backend** e **frontend** utilizando o seguinte comando:

```bash
npm install
# ou
yarn install
```

4. Crie um arquivo `.env` na pasta **backend** com as seguintes chaves e seus respectivos valores:

```env
DATABASE_URL=seu_valor_aqui
PORT=seu_valor_aqui
JWT_SECRET=seu_valor_aqui
RESEND_API_KEY=seu_valor_aqui
CLIENT_URL=seu_valor_aqui
```

Certifique-se de substituir `seu_valor_aqui` pelos valores corretos de cada chave.

5. Inicie o servidor de desenvolvimento em ambos arquivos **backend** e **frontend** com o seguinte comando:

```bash
npm run dev
# ou
yarn dev
```

6. Acesse a aplicação em `http://localhost:3000` e explore as funcionalidades completas do Notes. O projeto está organizado de maneira a garantir a segurança e a responsividade da aplicação, permitindo que os usuários possam gerenciar suas notas e informações pessoais de forma rápida e eficaz.
