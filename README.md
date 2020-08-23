# API Caixa Virtual
Está precisando registrar a movimentação financeira sua ou do seu negócio e pensa em construir uma aplicação para isso? A API Caixa Virtua oferece várias funcionalidades para criação de caixas e registro de atividades financeiras. Basta sua aplicação consumila através de rotas HTTP e pronto, você tera tudo o que precisa!

## Como instalar
A API Caixa Virtual é toda escrita em NodeJs e tem um banco em postgres, então, se você tiver o PostgreSQL, o Node e o Yarn devidamente instalado e configurado na sua máquina, basta baixar esse repositório e executar `yarn install` para instalar todas as dependências, `npx sequelize-cli db:migrate` para configurar o banco e logo após executar `yarn dev` para abrir um servidor de desenvolvimento.
