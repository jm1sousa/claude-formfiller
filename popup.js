const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const speedSlider = document.getElementById('speed');
const speedValue = document.getElementById('speedValue');
const status = document.getElementById('status');

// Atualizar display da velocidade
speedSlider.addEventListener('input', (e) => {
  const val = e.target.value;
  speedValue.textContent = `${val}ms por campo`;
  
  chrome.storage.local.set({ speed: parseInt(val) });
});

// Carregar velocidade salva
chrome.storage.local.get(['speed'], (result) => {
  if (result.speed) {
    speedSlider.value = result.speed;
    speedValue.textContent = `${result.speed}ms por campo`;
  }
});

// Botão Iniciar
startBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, { 
    action: 'start',
    speed: parseInt(speedSlider.value)
  });
  
  startBtn.disabled = true;
  stopBtn.disabled = false;
  status.className = 'status active';
  status.textContent = '✅ Preenchimento ativo';
});

// Botão Parar
stopBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, { action: 'stop' });
  
  startBtn.disabled = false;
  stopBtn.disabled = true;
  status.className = 'status stopped';
  status.textContent = '⏸ Preenchimento pausado';
});

// Verificar estado ao abrir popup
chrome.storage.local.get(['isRunning'], (result) => {
  if (result.isRunning) {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    status.className = 'status active';
    status.textContent = '✅ Preenchimento ativo';
  }
});p
