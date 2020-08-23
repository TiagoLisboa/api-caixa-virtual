# API Caixa Virtual
Está precisando registrar a movimentação financeira sua ou do seu negócio e pensa em construir uma aplicação para isso? A API Caixa Virtua oferece várias funcionalidades para criação de caixas e registro de atividades financeiras. Basta sua aplicação consumila através de rotas HTTP e pronto, você tera tudo o que precisa!

## Como instalar
A API Caixa Virtual é toda escrita em NodeJs e tem um banco em postgres, então, se você tiver o PostgreSQL, o Node e o Yarn devidamente instalado e configurado na sua máquina, basta baixar esse repositório criar um arquivo `.env` seguindo o exemplo em `.env.example`, executar `yarn install` para instalar todas as dependências, `npx sequelize-cli db:migrate` para configurar o banco e logo após executar `yarn dev` para abrir um servidor de desenvolvimento.

Assim, você terá uma instancia da API Caixa Virtual rodando na sua máquina no endereço `localhost:3333`.

Se você preferir utilizar um ambiente docker, basta executar `docker-compose up` para subir uma infraestrutura de banco e aplicação em máqinas virtuais.

## Testes
A API Caixa Virtual vem com uma suite de testes bem completa, abordando todas as rotas implementadas. Para rodar os testes execute o comando `yarn test`. Os testes utilizam um banco sqlite, então, por favor, instale o `sqlite3` na sua máquina.

## Rotas da API
### POST /users
Cria um novo usuário.

**request body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
}
```
**response example:**
```json
{
  "user": {
    "id": 1,
    "name": "Fulano",
    "email": "fulano@email.com",
  }
}
```

### POST /login
Cria uma nova sessão de usuário e retorna um token jwt.

**request body:**
```json
{
  "email": "string",
  "password": "string",
}
```
**response example:**
```json
{
  "user": {
    "id": 1,
    "name": "Fulano",
    "email": "fulano@email.com",
  },
  "token": "ASDfasDFASD@!asDFasdF213asdF3as.dfa!Rasdf!@asDF!ra"
}
```

### GET /cashiers
Retorna uma lista dos caixas do usuário.

**headers**
```json
{
  "authentication": "Bearer tkasidjfASosdFASldoia812ASDfjo8asdf"
}
```
**request body:**
```json
```
**response example:**
```json
{
  "cashiers": [
    {
      "id": 1,
      "name": "Gastos pessoais"
    }
  ]
}
```

### POST /cashiers
Cria um novo caixa.

**headers**
```json
{
  "authentication": "Bearer tkasidjfASosdFASldoia812ASDfjo8asdf"
}
```
**request body:**
```json
{
  "name": "string"
}
```
**response example:**
```json
{
  "cashier": {
    "id": 1,
    "name": "Gastos pessoais"
  }
}
```

### GET /cashiers/{id}
Exibe o relatório de um caixa.

**headers**
```json
{
  "authentication": "Bearer tkasidjfASosdFASldoia812ASDfjo8asdf"
}
```
**request body:**
```json
```
**response example:**
```json
{
  "saldoTotal": -20,
  "movimentacoes": [
    {
      "data": "2020-08-23T19:15:07.381Z",
      "id": 1,
      "tipo": "gasto",
      "valor": 50,
      "descricao": null,
      "categorias": [
        {
          "id": 1,
          "nome": "Alimentação"
        }
      ]
    },
    {
      "data": "2020-08-23T19:15:17.350Z",
      "id": 2,
      "tipo": "ganho",
      "valor": 30,
      "descricao": null,
      "categorias": []
    }
  ]
}
```

### PUT /cashiers/{id}
Altera os valores de um caixa.

**headers**
```json
{
  "authentication": "Bearer tkasidjfASosdFASldoia812ASDfjo8asdf"
}
```
**request body:**
```json
{
	"name": "string"
}
```
**response example:**
```json
{
  "cashier": {
    "id": 1,
    "name": "Gastos pessoais"
  }
}
```

### DELETE /cashiers/{id}
Remove um caixa da base de dados.

**headers**
```json
{
  "authentication": "Bearer tkasidjfASosdFASldoia812ASDfjo8asdf"
}
```
**request body:**
```json
```
**response example:**
```json
{
  "message": "cashier sucessfully deleted."
}
```

### GET /categories
Retorna uma lista das categorias do usuário.

**headers**
```json
{
  "authentication": "Bearer tkasidjfASosdFASldoia812ASDfjo8asdf"
}
```
**request body:**
```json
```
**response example:**
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Alimentação"
    }
  ]
}
```

### POST /categories
Cria uma nova categoria.

**headers**
```json
{
  "authentication": "Bearer tkasidjfASosdFASldoia812ASDfjo8asdf"
}
```
**request body:**
```json
{
  "name": "string"
}
```
**response example:**
```json
{
  "category": {
    "id": 1,
    "name": "Alimentação"
  }
}
```

### PUT /categories/{id}
Altera os valores de uma categoria.

**headers**
```json
{
  "authentication": "Bearer tkasidjfASosdFASldoia812ASDfjo8asdf"
}
```
**request body:**
```json
{
  "name": "string"
}
```
**response example:**
```json
{
  "category": {
    "id": 1,
    "name": "Alimentação"
  }
}
```

### DELETE /categories/{id}
Remove uma categoria da base de dados.

**headers**
```json
{
  "authentication": "Bearer tkasidjfASosdFASldoia812ASDfjo8asdf"
}
```
**request body:**
```json
```
**response example:**
```json
{
  "message": "category sucessfully deleted."
}
```

### GET /cashier/{id}/transactions
Retorna uma lista das movimentações do usuário para a caixa especificada.

**headers**
```json
{
  "authentication": "Bearer tkasidjfASosdFASldoia812ASDfjo8asdf"
}
```
**request body:**
```json
```
**response example:**
```json
{
  "transactions": [
    {
      "id": 1,
      "type": 1,
      "value": 30,
      "categories": [],
      "description": null
    }
  ]
}
```

### POST /cashier/{id}/transactions
Cria uma nova movimentação na caixa.

**headers**
```json
{
  "authentication": "Bearer tkasidjfASosdFASldoia812ASDfjo8asdf"
}
```
**request body:**
```json
{
  "type": "number",
  "value": "number",
  "categories": "array",
  "description": "string"
}
```
**response example:**
```json
{
  "transaction": {
    "id": 1,
    "type": 1,
    "value": 30,
    "categories": [],
    "description": null
  }
}
```

### PUT /cashier/{id}/transactions/{categoryId}
Altera os valores de uma movimentação.

**headers**
```json
{
  "authentication": "Bearer tkasidjfASosdFASldoia812ASDfjo8asdf"
}
```
**request body:**
```json
{
  "type": "number",
  "value": "number",
  "description": "string"
}
```
**response example:**
```json
{
  "transaction": {
    "id": 1,
    "type": 1,
    "value": 30,
    "categories": [],
    "description": null
  }
}
```

### DELETE /cashier/{id}/transactions/{categoryId}
Remove uma movimentação da base de dados.

**headers**
```json
{
  "authentication": "Bearer tkasidjfASosdFASldoia812ASDfjo8asdf"
}
```
**request body:**
```json
```
**response example:**
```json
{
  "message": "transaction sucessfully deleted."
}
```
