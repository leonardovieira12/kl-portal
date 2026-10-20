# KL Portal 2.0

KL Beauty, KLSistemas e Superadmin em um Web Service Docker.

- `/`: seleção de sistema
- `/beauty/`: gestão do salão
- `/mercado/`: gestão comercial
- `/admin/`: empresas, usuários, contratos e mensalidades

Para atualizar a instalação existente, siga **ATUALIZAR_PARA_V2.md**. Não crie outro PostgreSQL e não substitua sua DATABASE_URL durante essa atualização.

Novas variáveis: `SUPERADMIN_EMAIL` e `SUPERADMIN_PASSWORD` (12–200 caracteres). A conta é criada somente no primeiro início da v2.

O banco mantém os registros; a migração adiciona controles sem apagar os dados existentes. Pagamentos são registrados manualmente. Instalações antigas conectadas ao mesmo banco precisam ser desativadas ou atualizadas para não contornar os bloqueios.

Consulte **VALIDACAO.md** para testes, comandos de reprodução e limites.
