# KL Portal instalável

Acesse https://kl-portal.onrender.com no navegador do dispositivo.

- Android/Chrome: toque em **Instalar aplicativo**, quando exibido. Também pode usar o menu do Chrome → Instalar aplicativo ou Adicionar à tela inicial.
- iPhone/iPad/Safari: Compartilhar → Adicionar à Tela de Início; confirme Abrir como App, se disponível.
- Computador/Chrome ou Edge: botão de instalação do navegador ou o botão do portal, quando exibido.

O aplicativo abre o portal e oferece salão e mercado. Entre com as credenciais existentes. A instalação e o acesso continuam sujeitos às permissões, sessões e bloqueios da empresa. Os atalhos do manifesto apontam para cada sistema.

## Conexão e atualizações

O aplicativo requer internet para login, consultas e gravações. Ele não salva vendas offline. O service worker armazena somente a tela pública de desconexão e um ícone: não armazena páginas de clientes, APIs, senhas, vendas ou respostas autenticadas. O aviso offline não substitui dados reais nem simula um salvamento.

As páginas e scripts são solicitados da rede. A atualização normal do site chega ao aplicativo ao reabri-lo; não há APK para baixar. O worker é verificado sem cache, e caches públicos antigos deste aplicativo são removidos ao ativar uma versão nova.

## Validação

Testes automatizados cobrem manifesto, PNGs, rotas públicas, cabeçalhos do worker, método HEAD/POST, escopo, links nas páginas de entrada e política de cache. O worker foi exercitado com navegação online/offline simulada e recusa de interceptação de APIs/mutações. A instalação física em Android/iOS não foi executada neste ambiente.
