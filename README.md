# MedicaBr Frontend

## Objetivo

O MedicaBr foi desenvolvido com o propósito de facilitar o controle e a organização do uso de medicamentos no dia a dia.

A motivação principal surgiu da necessidade de ajudar meus pais, que são idosos e ainda utilizam papel e caneta para anotar horários e doses. Pensando nisso, a aplicação foi criada para oferecer uma alternativa digital simples, acessível e intuitiva, permitindo um acompanhamento mais eficiente e reduzindo o risco de esquecimentos ou erros na medicação.

Além disso, o projeto busca demonstrar na prática como a tecnologia pode ser aplicada para resolver problemas reais do cotidiano, especialmente no cuidado com a saúde e bem-estar.

## Descrição

Interface web responsiva para o gerenciador de medicamentos MediLembr. Desenvolvida com HTML5, CSS3 e JavaScript puro (SPA - Single Page Application).

## Como Usar

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- API MediLembr rodando em `http://localhost:5000`

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/horizonNEvent/MedicaBr-frontend.git
cd MedicaBr-frontend
```

2. **Abra no navegador**
```bash
# Abra o arquivo index.html diretamente no navegador
# Windows: clique duas vezes no arquivo index.html
# macOS/Linux: arraste o arquivo para o navegador ou use: open index.html
```

Ou use um servidor local:
```bash
# Se tiver Python 3
python -m http.server 8000

# Se tiver Node.js
npx http-server

# Depois acesse: http://localhost:8000
```

## Seções da Aplicação

### 1. **Medicamentos** 
- Exibe todos os medicamentos cadastrados em cards
- Mostra: nome, dosagem, frequência, estoque, validade
- Alerta visual para estoque baixo
- Barra de progresso de estoque
- Botões rápidos para registrar uso ou deletar

### 2. **Adicionar** 
- Formulário para cadastrar novo medicamento
- Validações de campo
- Mensagens de sucesso/erro
- Campos: nome, dosagem, frequência, estoque, limite mínimo, validade

### 3. **Alertas** 
- Lista medicamentos com estoque abaixo do limite mínimo
- Destaque visual em cores de alerta
- Atualiza em tempo real

### 4. **Histórico** 
- Mostra últimos registros de uso (quando tomou o medicamento)
- Data, hora e observações
- Listado em ordem decrescente (mais recentes primeiro)

## Tecnologias

- **HTML5** - Estrutura semântica
- **CSS3** - Layout responsivo com Grid e Flexbox
- **JavaScript ES6+** - Lógica da aplicação
- **Fetch API** - Comunicação com backend
- **LocalStorage** - Persistência local (opcional)

## Comunicação com API

### Endpoints chamados:
```
GET    /medicamentos              - Listar medicamentos
POST   /medicamento               - Criar medicamento
GET    /medicamento/<id>          - Buscar medicamento
DELETE /medicamento/<id>          - Deletar medicamento
GET    /medicamentos/alertas      - Listar com alerta
POST   /registro_uso              - Registrar uso
GET    /historico                 - Listar histórico
```

##  Estrutura de Arquivos

```
frontend/
├── index.html      # Documento HTML principal (SPA)
├── styles.css      # Estilos CSS3 personalizados
├── scripts.js      # Lógica JavaScript
└── README.md       # Esta documentação
```

## Funcionalidades Implementadas

- ✅ Navegação entre páginas sem recarregar
- ✅ CRUD completo de medicamentos
- ✅ Registro de uso com data/hora
- ✅ Sistema de alertas de estoque
- ✅ Histórico de uso
- ✅ Modais para confirmações
- ✅ Mensagens de feedback
- ✅ Design responsivo
- ✅ Sem dependências externas (JavaScript puro)

## 🐛 Troubleshooting

### "Página em branco"
- Abra o console (F12) e procure por erros JavaScript
- Verifique se o arquivo está sendo carregado corretamente

## 📧 Suporte

Em caso de dúvidas ou problemas, abra uma issue no repositório.
