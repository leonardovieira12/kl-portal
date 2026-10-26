'use strict';
(()=>{
 if(!('serviceWorker' in navigator)||!window.isSecureContext)return;
 window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js',{scope:'/',updateViaCache:'none'}).catch(()=>{})});
 if(matchMedia('(display-mode: standalone)').matches||navigator.standalone)return;
 let promptEvent;
 const button=document.createElement('button');button.type='button';button.className='kl-pwa-install';button.textContent='Instalar aplicativo';button.hidden=true;
 const mounted=()=>{if(!button.isConnected)document.body.appendChild(button)};
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();promptEvent=event;mounted();button.hidden=false});
 button.addEventListener('click',async()=>{if(!promptEvent){alert('No Safari, toque em Compartilhar e depois em Adicionar à Tela de Início. Ative Abrir como App, se a opção aparecer.');return}const pending=promptEvent;promptEvent=null;button.hidden=true;await pending.prompt();const choice=await pending.userChoice;if(choice.outcome==='dismissed')button.hidden=true});
 window.addEventListener('appinstalled',()=>{promptEvent=null;button.remove()});
 if(/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1){mounted();button.textContent='Adicionar à tela inicial';button.hidden=false}
})();
