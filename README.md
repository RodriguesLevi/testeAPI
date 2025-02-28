# Multi-Gateway Payment API

API RESTful que gerencia pagamentos através de múltiplos gateways, seguindo uma ordem de prioridade definida. Este projeto foi implementado com base no nível 2 do desafio, incluindo:

- Cálculo do valor da compra a partir de produtos e suas quantidades
- Gateways com autenticação
- Gestão de usuários e permissões

## Tecnologias Utilizadas

- Adonis.js 5 (Node.js)
- MySQL como banco de dados
- Docker e Docker Compose para ambiente de desenvolvimento
- ORM Lucid para gerenciamento do banco de dados
- Validação de dados com o framework de validação do Adonis

## Requisitos

- Node.js v14+
- npm ou yarn
- Docker e Docker Compose

## Instalação e Configuração

### Com Docker (Recomendado)

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/multi-gateway-payment-api.git
cd multi-gateway-payment-api
```

2. Configure o arquivo .env a partir do exemplo:

```bash
cp .env.example .env
```

3. Inicie os containers:

```bash
docker-compose up -d
```

4. Rode as migrações e os seeders:

```bash
docker-compose exec app node ace migration:run
docker-compose exec app node ace db:seed
```

### Instalação Local (Sem Docker)

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/multi-gateway-payment-api.git
cd multi-gateway-payment-api
```

2. Instale as dependências:

```bash
npm install
# ou
yarn install
```

3. Configure o arquivo .env a partir do exemplo:

```bash
cp .env.example .env
```

4. Configure o banco de dados MySQL e atualize as credenciais no arquivo .env.

5. Execute as migrações e os seeders:

```bash
node ace migration:run
node ace db:seed
```

6. Inicie a aplicação:

```bash
node ace serve --watch
```

## Estrutura do Banco de Dados

O banco de dados possui as seguintes tabelas:

- **users**: Armazena os usuários do sistema com seus roles
- **gateways**: Lista os gateways de pagamento disponíveis
- **clients**: Armazena os dados dos clientes
- **products**: Catálogo de produtos disponíveis para venda
- **transactions**: Registro de transações de pagamento
- **transaction_products**: Relação entre transações e produtos adquiridos

## Gateways de Pagamento

O sistema suporta dois gateways de pagamento:

- **Gateway 1**: Disponível em http://localhost:3001
- **Gateway 2**: Disponível em http://localhost:3002

Os gateways podem ser ativados/desativados e sua prioridade pode ser alterada. O sistema tentará processar o pagamento no gateway de maior prioridade e, em caso de falha, tentará no próximo gateway.

## Usuários e Roles

O sistema possui quatro tipos de usuários (roles):

- **ADMIN**: Tem acesso total ao sistema
- **MANAGER**: Pode gerenciar produtos e usuários
- **FINANCE**: Pode gerenciar produtos e realizar reembolsos
- **USER**: Tem acesso limitado ao sistema

## Rotas da API

### Rotas Públicas

- **POST /api/login**: Realiza o login e retorna um token JWT

  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **POST /api/transactions**: Realiza uma compra
  ```json
  {
    "name": "Cliente Exemplo",
    "email": "cliente@exemplo.com",
    "cardNumber": "5569000000006063",
    "cvv": "010",
    "products": [
      {
        "id": 1,
        "quantity": 2
      },
      {
        "id": 3,
        "quantity": 1
      }
    ]
  }
  ```

### Rotas Privadas (Requerem Autenticação)

#### Autenticação

- **POST /api/logout**: Realiza o logout
- **GET /api/me**: Retorna os dados do usuário logado

#### Usuários (ADMIN, MANAGER)

- **GET /api/users**: Lista todos os usuários
- **POST /api/users**: Cria um novo usuário
- **GET /api/users/:id**: Obtém detalhes de um usuário
- **PUT /api/users/:id**: Atualiza um usuário
- **DELETE /api/users/:id**: Remove um usuário

#### Produtos (Todos podem ver, ADMIN, MANAGER, FINANCE podem gerenciar)

- **GET /api/products**: Lista todos os produtos
- **POST /api/products**: Cria um novo produto
- **GET /api/products/:id**: Obtém detalhes de um produto
- **PUT /api/products/:id**: Atualiza um produto
- **DELETE /api/products/:id**: Remove um produto

#### Gateways (ADMIN)

- **GET /api/gateways**: Lista todos os gateways
- **GET /api/gateways/:id**: Obtém detalhes de um gateway
- **PUT /api/gateways/:id**: Atualiza configurações de um gateway
- **PUT /api/gateways/:id/toggle-active**: Ativa/desativa um gateway
- **PUT /api/gateways/:id/priority**: Atualiza a prioridade de um gateway

#### Clientes (Autenticados)

- **GET /api/clients**: Lista todos os clientes
- **GET /api/clients/:id**: Obtém detalhes de um cliente
- **GET /api/clients/:id/transactions**: Lista todas as transações de um cliente

#### Transações (Autenticados, Reembolso apenas ADMIN, FINANCE)

- **GET /api/transactions**: Lista todas as transações
- **GET /api/transactions/:id**: Obtém detalhes de uma transação
- **POST /api/transactions/:id/refund**: Realiza o reembolso de uma transação

## Usuários Pré-configurados

Os seguintes usuários são criados pelo seeder:

- **Admin**: admin@example.com / password123
- **Manager**: manager@example.com / password123
- **Finance**: finance@example.com / password123
- **User**: user@example.com / password123

## Testes

Para executar os testes:

```bash
node ace test
```

## Implementação e Arquitetura

- Arquitetura MVC (Model-View-Controller)
- Services para gerenciamento dos gateways de pagamento
- Middlewares para autenticação e verificação de roles
- Validators para validação de dados

## Recursos Adicionais

- Suporte a multi-gateway com facilidade para adicionar novos gateways
- Cálculo automático do valor total com base nos produtos e quantidades
- Sistema de roles para controle de acesso
- Docker para ambiente de desenvolvimento completo

## Limitações e Melhorias Futuras

- Implementar testes unitários e de integração
- Adicionar cache para melhorar performance
- Implementar notificações por email para transações
- Adicionar documentação com Swagger
- Implementar mecanismos de retry para falhas de gateway
