# Revisão do KL-PORTAL — 26/10/2026

Escopo: somente leonardovieira12/kl-portal, partindo do commit 37f5201. Nenhuma alteração em outros repositórios ou banco de produção.

## Correções

- Mercado: removido mutex global mantido durante operações PostgreSQL. A proteção contra gravações concorrentes continua no UPDATE atômico por empresa e revisão; uma consulta lenta de uma empresa não deve serializar todas as outras.
- JSON privado do salão/superadmin: compressão gzip assíncrona acima de 1 KiB, com negociação, Vary e no-store. Cookies e conteúdo são preservados. Mercado: gzip para GET de estado, respeitando gzip;q=0.
- Superadmin: lista calcula o bloqueio na mesma consulta das empresas, eliminando uma consulta adicional por empresa.
- Empresas excluídas: acesso explicitamente negado no Node e no Go, independentemente do status do contrato. Geração de mensalidades ignora empresas excluídas. Reativação exige restaurar primeiro.
- Gateway: valida Host antes do health check e trata URL inválida.
- CI: build, testes de domínio, autenticação, gateway, concorrência Go com race detector e integração com banco descartável em cada PR/push de main.
- Contexto Docker e git excluem dependências locais, credenciais .env e artefatos de build.

## Limites

O mercado ainda grava o estado integral da empresa. Esta revisão reduz contenção e tráfego, mas não normaliza o banco nem promete um tempo de gravação em produção. A validação usa banco descartável PostgreSQL/PGlite e API local; não executa cobrança real, migração destrutiva ou deploy no Render. Não existe garantia de ausência absoluta de bugs.

## Resultado local

Build Beauty aprovado; 69 testes Beauty, 40 testes Node de administração/gateway/compressão e 180 verificações integradas aprovados. Testes Go com detector de corrida e compilação Linux aprovados, incluindo concorrência entre empresas e negociação gzip. Sem medição de p95 em produção.
