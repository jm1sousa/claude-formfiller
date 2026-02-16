// ==================== AUTOMATION FRAMEWORK STYLE ====================
// Simula Selenium/Playwright/Cypress
let isRunning = false;
let fillSpeed = 500;
let floatingUI = null;

const FICTIONAL_DATA = {
  firstNames: ['Harry', 'Hermione', 'Frodo', 'Aragorn', 'Leia', 'Luke', 'Katniss', 'Jon', 'Daenerys', 'Sherlock'],
  lastNames: ['Potter', 'Granger', 'Baggins', 'Stark', 'Skywalker', 'Everdeen', 'Snow', 'Targaryen', 'Holmes', 'Wayne'],
  cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio'],
  states: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware'],
  companies: ['Stark Industries', 'Wayne Enterprises', 'Umbrella Corp', 'Cyberdyne Systems', 'Oscorp']
};

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ==================== AUTOMATION HELPERS ====================
// Simula interação humana real como Selenium faz

function humanTypeCharacter(element, char) {
  // Simula pressionar uma tecla como humano
  const keydownEvent = new KeyboardEvent('keydown', {
    key: char,
    code: `Key${char.toUpperCase()}`,
    charCode: char.charCodeAt(0),
    keyCode: char.charCodeAt(0),
    which: char.charCodeAt(0),
    bubbles: true,
    cancelable: true
  });
  
  const keypressEvent = new KeyboardEvent('keypress', {
    key: char,
    code: `Key${char.toUpperCase()}`,
    charCode: char.charCodeAt(0),
    keyCode: char.charCodeAt(0),
    which: char.charCodeAt(0),
    bubbles: true,
    cancelable: true
  });
  
  const inputEvent = new InputEvent('input', {
    data: char,
    inputType: 'insertText',
    bubbles: true,
    cancelable: true
  });
  
  const keyupEvent = new KeyboardEvent('keyup', {
    key: char,
    code: `Key${char.toUpperCase()}`,
    charCode: char.charCodeAt(0),
    keyCode: char.charCodeAt(0),
    which: char.charCodeAt(0),
    bubbles: true,
    cancelable: true
  });
  
  element.dispatchEvent(keydownEvent);
  element.dispatchEvent(keypressEvent);
  element.dispatchEvent(inputEvent);
  element.dispatchEvent(keyupEvent);
}

async function humanType(element, text, delayBetweenChars = 50) {
  // Simula digitação humana caractere por caractere
  element.focus();
  
  // Limpar campo primeiro
  element.value = '';
  
  // Disparar evento de focus
  element.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
  
  // Digitar cada caractere
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    // Atualizar valor
    element.value += char;
    
    // Disparar eventos de tecla
    humanTypeCharacter(element, char);
    
    // Aguardar um pouco (simula velocidade de digitação humana)
    await new Promise(r => setTimeout(r, delayBetweenChars));
  }
  
  // Disparar eventos finais
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
}

function humanClick(element) {
  // Simula clique humano completo
  const rect = element.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  
  const mousedownEvent = new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: x,
    clientY: y
  });
  
  const mouseupEvent = new MouseEvent('mouseup', {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: x,
    clientY: y
  });
  
  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: x,
    clientY: y
  });
  
  element.dispatchEvent(mousedownEvent);
  element.dispatchEvent(mouseupEvent);
  element.dispatchEvent(clickEvent);
}

function setReactValue(element, value) {
  // Técnica específica para React (usado por Selenium/Playwright)
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  )?.set;
  
  const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    'value'
  )?.set;
  
  if (element.tagName === 'TEXTAREA' && nativeTextAreaValueSetter) {
    nativeTextAreaValueSetter.call(element, value);
  } else if (nativeInputValueSetter) {
    nativeInputValueSetter.call(element, value);
  }
  
  // Disparar evento de input (React precisa disso)
  element.dispatchEvent(new Event('input', { bubbles: true }));
}

// ==================== UI FLUTUANTE ====================
function createFloatingUI() {
  if (floatingUI) return;
  
  floatingUI = document.createElement('div');
  floatingUI.id = 'smart-form-filler-ui';
  floatingUI.innerHTML = `
    <style>
      #smart-form-filler-ui {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 320px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        color: white;
        z-index: 999999;
        user-select: none;
      }
      
      #smart-form-filler-ui * {
        box-sizing: border-box;
      }
      
      .sff-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
      
      .sff-title {
        font-size: 18px;
        font-weight: 600;
      }
      
      .sff-close {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
      }
      
      .sff-close:hover {
        background: rgba(255,255,255,0.3);
      }
      
      .sff-controls {
        background: rgba(255,255,255,0.15);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 12px;
      }
      
      .sff-speed {
        margin-bottom: 12px;
      }
      
      .sff-label {
        display: block;
        font-size: 13px;
        margin-bottom: 8px;
        font-weight: 500;
      }
      
      .sff-slider {
        width: 100%;
        height: 6px;
        border-radius: 3px;
        background: rgba(255,255,255,0.3);
        outline: none;
        -webkit-appearance: none;
      }
      
      .sff-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: white;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      
      .sff-speed-value {
        text-align: center;
        font-size: 12px;
        margin-top: 6px;
        opacity: 0.9;
      }
      
      .sff-buttons {
        display: flex;
        gap: 8px;
      }
      
      .sff-btn {
        flex: 1;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .sff-btn-start {
        background: #10b981;
        color: white;
      }
      
      .sff-btn-start:hover:not(:disabled) {
        background: #059669;
        transform: translateY(-1px);
      }
      
      .sff-btn-stop {
        background: #ef4444;
        color: white;
      }
      
      .sff-btn-stop:hover:not(:disabled) {
        background: #dc2626;
        transform: translateY(-1px);
      }
      
      .sff-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .sff-status {
        background: rgba(255,255,255,0.15);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        padding: 12px;
        text-align: center;
        font-size: 13px;
        margin-bottom: 12px;
      }
      
      .sff-status.active {
        background: rgba(16,185,129,0.3);
      }
      
      .sff-status.stopped {
        background: rgba(239,68,68,0.3);
      }
      
      .sff-info {
        background: rgba(255,255,255,0.1);
        border-radius: 8px;
        padding: 10px;
        font-size: 11px;
        line-height: 1.5;
      }
      
      .sff-drag-handle {
        cursor: move;
        padding: 4px;
        margin: -4px -4px 8px -4px;
        text-align: center;
        opacity: 0.5;
      }
    </style>
    
    <div class="sff-drag-handle">⋮⋮⋮</div>
    
    <div class="sff-header">
      <div class="sff-title">🎯 Smart Form Filler</div>
      <button class="sff-close" id="sff-close-btn">×</button>
    </div>
    
    <div class="sff-controls">
      <div class="sff-speed">
        <label class="sff-label">Velocidade</label>
        <input type="range" class="sff-slider" id="sff-speed" min="100" max="2000" value="500" step="100">
        <div class="sff-speed-value" id="sff-speed-value">500ms por campo</div>
      </div>
      
      <div class="sff-buttons">
        <button class="sff-btn sff-btn-start" id="sff-start-btn">▶ Iniciar</button>
        <button class="sff-btn sff-btn-stop" id="sff-stop-btn" disabled>⏸ Parar</button>
      </div>
    </div>
    
    <div class="sff-status" id="sff-status">Pronto para preencher</div>
    
    <div class="sff-info">
      ℹ️ Simula automação tipo Selenium/Playwright
    </div>
  `;
  
  document.body.appendChild(floatingUI);
  
  // Event listeners
  const speedSlider = floatingUI.querySelector('#sff-speed');
  const speedValue = floatingUI.querySelector('#sff-speed-value');
  const startBtn = floatingUI.querySelector('#sff-start-btn');
  const stopBtn = floatingUI.querySelector('#sff-stop-btn');
  const closeBtn = floatingUI.querySelector('#sff-close-btn');
  const status = floatingUI.querySelector('#sff-status');
  
  speedSlider.addEventListener('input', (e) => {
    fillSpeed = parseInt(e.target.value);
    speedValue.textContent = `${fillSpeed}ms por campo`;
  });
  
  startBtn.addEventListener('click', () => {
    isRunning = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    status.className = 'sff-status active';
    status.textContent = '✅ Preenchimento ativo';
    automateForm();
  });
  
  stopBtn.addEventListener('click', () => {
    isRunning = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    status.className = 'sff-status stopped';
    status.textContent = '⏸ Preenchimento pausado';
  });
  
  closeBtn.addEventListener('click', () => {
    floatingUI.remove();
    floatingUI = null;
    isRunning = false;
  });
  
  makeDraggable(floatingUI);
}

function makeDraggable(element) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  const dragHandle = element.querySelector('.sff-drag-handle');
  
  dragHandle.onmousedown = dragMouseDown;
  
  function dragMouseDown(e) {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }
  
  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    element.style.top = (element.offsetTop - pos2) + 'px';
    element.style.right = '';
    element.style.left = (element.offsetLeft - pos1) + 'px';
  }
  
  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// ==================== DETECÇÃO INTELIGENTE ====================
function detectFieldType(field) {
  const name = (field.name || '').toLowerCase();
  const id = (field.id || '').toLowerCase();
  const placeholder = (field.placeholder || '').toLowerCase();
  const type = (field.type || 'text').toLowerCase();
  const autocomplete = (field.getAttribute('autocomplete') || '').toLowerCase();
  
  let labelText = '';
  if (field.id) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    if (label) labelText = label.textContent.toLowerCase();
  }
  const parentLabel = field.closest('label');
  if (parentLabel) labelText += ' ' + parentLabel.textContent.toLowerCase();
  
  const combined = `${name} ${id} ${placeholder} ${autocomplete} ${labelText}`;
  
  if (type === 'email' || /email|e-mail/.test(combined)) return 'email';
  if (type === 'tel' || /phone|tel|celular|mobile/.test(combined)) return 'phone';
  if (type === 'date' || /birth|nascimento|bday|date/.test(combined)) return 'date';
  if (/first.*name|given.*name|nome.*próprio/.test(combined)) return 'firstName';
  if (/last.*name|surname|sobrenome|family.*name/.test(combined)) return 'lastName';
  if (/full.*name|nome.*completo/.test(combined)) return 'fullName';
  if (/address|street|rua/.test(combined)) return 'address';
  if (/city|cidade/.test(combined)) return 'city';
  if (/state|estado/.test(combined)) return 'state';
  if (/zip|postal|cep/.test(combined)) return 'zip';
  if (/country|país/.test(combined)) return 'country';
  if (/company|employer|empresa/.test(combined)) return 'company';
  
  return 'text';
}

function generateValue(fieldType) {
  const firstName = random(FICTIONAL_DATA.firstNames);
  const lastName = random(FICTIONAL_DATA.lastNames);
  
  switch (fieldType) {
    case 'email': return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@swordhealth.com`;
    case 'phone': return `(${randomNum(200,999)}) ${randomNum(200,999)}-${randomNum(1000,9999)}`;
    case 'date': return '11/11/2000';
    case 'firstName': return firstName;
    case 'lastName': return lastName;
    case 'fullName': return `${firstName} ${lastName}`;
    case 'address': return `${randomNum(100,9999)} Main Street`;
    case 'city': return random(FICTIONAL_DATA.cities);
    case 'state': return random(FICTIONAL_DATA.states);
    case 'zip': return String(randomNum(10000, 99999));
    case 'country': return 'United States';
    case 'company': return random(FICTIONAL_DATA.companies);
    default: return `${firstName} ${lastName}`;
  }
}

// ==================== AUTOMAÇÃO PRINCIPAL ====================
async function automateForm() {
  console.log('🤖 Iniciando automação estilo Selenium...');
  
  const elements = document.querySelectorAll('input, select, textarea');
  let filled = 0;
  
  for (const element of elements) {
    if (!isRunning) break;
    
    const type = element.type?.toLowerCase();
    const tag = element.tagName;
    
    if (type === 'hidden' || type === 'submit' || type === 'button' || element.disabled) continue;
    
    try {
      // CHECKBOX
      if (type === 'checkbox' && !element.checked) {
        humanClick(element);
        filled++;
        console.log('✓ Checkbox marcado');
        await new Promise(r => setTimeout(r, fillSpeed));
        continue;
      }
      
      // RADIO
      if (type === 'radio') {
        const name = element.name;
        if (!document.querySelector(`input[type="radio"][name="${name}"]:checked`)) {
          humanClick(element);
          filled++;
          console.log('✓ Radio selecionado');
          await new Promise(r => setTimeout(r, fillSpeed));
        }
        continue;
      }
      
      // SELECT
      if (tag === 'SELECT' && element.options.length > 1) {
        element.selectedIndex = 1;
        element.dispatchEvent(new Event('change', { bubbles: true }));
        filled++;
        console.log(`✓ Select: ${element.options[1].text}`);
        await new Promise(r => setTimeout(r, fillSpeed));
        continue;
      }
      
      // INPUT/TEXTAREA
      if (element.value && element.value.trim() !== '') continue;
      
      const fieldType = detectFieldType(element);
      let value = generateValue(fieldType);
      
      if (type === 'date' && fieldType === 'date') {
        value = '2000-11-11';
      }
      
      // Usar técnica de digitação humana
      await humanType(element, value, 30);
      
      // Também usar técnica React por segurança
      setReactValue(element, value);
      
      filled++;
      console.log(`✓ ${fieldType}: ${value}`);
      await new Promise(r => setTimeout(r, fillSpeed));
      
    } catch (error) {
      console.error('Erro:', error);
    }
  }
  
  console.log(`✅ Automação concluída: ${filled} campos`);
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Procurar e clicar botão
  const buttons = document.querySelectorAll('button, input[type="submit"], a');
  for (const btn of buttons) {
    const text = (btn.textContent || btn.value || '').toLowerCase();
    if (/next|continue|submit|continuar|seguinte|enviar|save|avançar/.test(text)) {
      console.log(`🔘 Clicando: "${btn.textContent || btn.value}"`);
      humanClick(btn);
      await new Promise(r => setTimeout(r, 2500));
      if (isRunning) automateForm();
      return;
    }
  }
}

// ==================== INICIALIZAÇÃO ====================
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'start') {
    createFloatingUI();
    const startBtn = floatingUI?.querySelector('#sff-start-btn');
    if (startBtn) startBtn.click();
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(createFloatingUI, 500));
} else {
  setTimeout(createFloatingUI, 500);
}
