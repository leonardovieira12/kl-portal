# Validação — KL Portal 2.0

Executada em 20/10/2026. Esta é uma atualização de código; não foi publicada automaticamente no serviço do usuário.

| Camada | Resultado |
|---|---|
| KL Beauty — domínio, segurança, autenticação, API e persistência | 69 testes aprovados |
| Superadmin — migração, isolamento, contratos, usuários, mensalidades e auditoria | 26 testes aprovados |
| Gateway — caminhos, redirecionamentos, arquivos, health check e superadmin | 10 testes aprovados |
| KLSistemas — autenticação, empresas, limites e impressão | 7 testes Go aprovados |
| Conjunto Node + Go com banco PGlite por protocolo PostgreSQL | 34 verificações HTTP aprovadas |
| Interface superadmin em JSDOM com API do conjunto e banco de teste | 15 verificações aprovadas |
| TypeScript / Vite e binário Linux do KLSistemas | Compilação aprovada |

As contagens Node incluem os testes agrupadores apresentados pelo runner. As verificações HTTP/DOM são asserções de fluxos, não auditorias independentes.

## O que foi exercitado

- Migração sobre empresas existentes sem perda de estado e sem bloqueio financeiro inicial.
- Isolamento entre empresas, credencial de cliente sem acesso ao superadmin e proteção de origem.
- Criação atômica de empresa/usuário; rollback em login duplicado.
- Geração idempotente por competência e preservação do dia de vencimento em meses curtos.
- Recebimento parcial, repetição de requisição sem duplicação, recusa de valores excedentes e negativos.
- Quitação, liberação automática, estorno, reabertura de saldo e cancelamento de mensalidade.
- Cancelamento manual que permanece bloqueado mesmo após pagamento.
- Bloqueio de sessão já aberta nos dois sistemas.
- Perfil consulta do mercado impedido de gravar no servidor.
- Criação, vínculo, desativação e troca de senha de usuários; revogação de sessões.
- Auditoria sem senhas e controle de versão do contrato para recusar tela desatualizada.
- Formulários do painel: autenticação, empresa, usuário, recebimento, estorno, cancelamento, filtro e histórico.

## Limites da validação

PGlite executa o motor PostgreSQL em WebAssembly; a suíte integrada utiliza seu adaptador de socket com os clientes Node pg e Go pgx. Isso valida as consultas e os fluxos locais, mas não reproduz todas as condições de concorrência, falhas de rede, recursos e configuração de um PostgreSQL remoto.

Não houve teste de carga, auditoria externa de segurança, execução da imagem Docker v2, inspeção visual em navegador real ou publicação desta atualização no Render. JSDOM verifica comportamento de formulários, não aparência rasterizada. Não foram acessados dados de produção.

Não há garantia de ausência de bugs nem alegação de 100 revisões por linha. Faça backup e valide a instalação após publicar conforme ATUALIZAR_PARA_V2.md.

## Reproduzir testes básicos

Pré-requisitos: Node 24 e Go compatível com mercado/go.mod. Na raiz do pacote:

```bash
cd beauty
npm ci --include=dev
npm run build
npm test
cd ..
npm run test:admin
npm run test:gateway
cd mercado
go test ./...
go build -buildvcs=false -o ../bin/klsistemas .
cd ..
```

## Reproduzir integração e interface

Em Linux, após os comandos acima:

```bash
cd qa
npm ci
npm test
```

A suíte sobe um banco descartável em memória no socket local 15439 e uma instância de teste do portal na porta 18090; o Go usa a porta 10001. As portas precisam estar livres. Os dados e senhas presentes nos testes são exclusivamente fictícios. A conexão é sobrescrita para o banco local, e nenhum DATABASE_URL de produção é usado pela suíte integrada.

O diretório qa não entra na imagem de produção. Para publicação no Render, não é necessário instalar essas dependências manualmente.
