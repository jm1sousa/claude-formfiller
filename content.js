// VERSÃO MELHORADA COM UI FLUTUANTE
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
      ℹ️ Preenche automaticamente com dados fictícios e avança páginas.
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
    fillAllFields();
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
  
  // Tornar arrastável
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

// ==================== DETECÇÃO E PREENCHIMENTO MELHORADOS ====================
function smartDetectFieldType(field) {
  const name = (field.name || '').toLowerCase();
  const id = (field.id || '').toLowerCase();
  const placeholder = (field.placeholder || '').toLowerCase();
  const type = (field.type || 'text').toLowerCase();
  const ariaLabel = (field.getAttribute('aria-label') || '').toLowerCase();
  const autocomplete = (field.getAttribute('autocomplete') || '').toLowerCase();
  
  // Pegar label associado
  let labelText = '';
  if (field.id) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    if (label) labelText = label.textContent.toLowerCase();
  }
  const parentLabel = field.closest('label');
  if (parentLabel) labelText += ' ' + parentLabel.textContent.toLowerCase();
  
  const combined = `${name} ${id} ${placeholder} ${ariaLabel} ${autocomplete} ${labelText}`;
  
  // Email (prioridade alta)
  if (type === 'email' || autocomplete.includes('email') || /\bemail\b|e-mail|correo/i.test(combined)) {
    return 'email';
  }
  
  // Telefone
  if (type === 'tel' || autocomplete.includes('tel') || /\bphone\b|telephone|telefone|celular|móvel|mobile|cell/i.test(combined)) {
    return 'phone';
  }
  
  // Data de nascimento
  if (type === 'date' || autocomplete.includes('bday') || /birth|nascimento|\bbday\b|date.*birth|data.*nasc/i.test(combined)) {
    return 'birthdate';
  }
  
  // Nome completo
  if (autocomplete === 'name' || /full.*name|nome.*completo|your.*name/i.test(combined)) {
    return 'fullName';
  }
  
  // Primeiro nome
  if (autocomplete.includes('given-name') || /first.*name|nome.*próprio|given.*name|primer.*nombre/i.test(combined)) {
    return 'firstName';
  }
  
  // Sobrenome
  if (autocomplete.includes('family-name') || /last.*name|surname|sobrenome|apelido|family.*name|apellido/i.test(combined)) {
    return 'lastName';
  }
  
  // Endereço
  if (autocomplete.includes('address') || /address.*line|street|rua|calle|endereço|morada/i.test(combined)) {
    return 'address';
  }
  
  // Cidade
  if (autocomplete.includes('city') || /\bcity\b|cidade|ciudad/i.test(combined)) {
    return 'city';
  }
  
  // Estado/Província
  if (autocomplete.includes('state') || /\bstate\b|estado|província|province/i.test(combined)) {
    return 'state';
  }
  
  // CEP/Código Postal
  if (autocomplete.includes('postal') || /zip.*code|postal.*code|cep|código.*postal/i.test(combined)) {
    return 'zip';
  }
  
  // País
  if (autocomplete.includes('country') || /\bcountry\b|país|pais/i.test(combined)) {
    return 'country';
  }
  
  // Empresa
  if (autocomplete.includes('organization') || /company|employer|empresa|organization/i.test(combined)) {
    return 'company';
  }
  
  // SSN/CPF
  if (/ssn|social.*security|cpf|tax.*id/i.test(combined)) {
    return 'ssn';
  }
  
  // Número genérico
  if (type === 'number' || /\bage\b|quantidade|amount/i.test(combined)) {
    return 'number';
  }
  
  // URL
  if (type === 'url' || /website|site|url/i.test(combined)) {
    return 'url';
  }
  
  return 'text';
}

function generateSmartValue(fieldType) {
  const firstName = random(FICTIONAL_DATA.firstNames);
  const lastName = random(FICTIONAL_DATA.lastNames);
  
  switch (fieldType) {
    case 'email':
      return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@swordhealth.com`;
    case 'phone':
      return `(${randomNum(200,999)}) ${randomNum(200,999)}-${randomNum(1000,9999)}`;
    case 'birthdate':
      return '11/11/2000';
    case 'firstName':
      return firstName;
    case 'lastName':
      return lastName;
    case 'fullName':
      return `${firstName} ${lastName}`;
    case 'address':
      return `${randomNum(100,9999)} Main Street`;
    case 'city':
      return random(FICTIONAL_DATA.cities);
    case 'state':
      return random(FICTIONAL_DATA.states);
    case 'zip':
      return String(randomNum(10000, 99999));
    case 'country':
      return 'United States';
    case 'company':
      return random(FICTIONAL_DATA.companies);
    case 'ssn':
      return `${randomNum(100,999)}-${randomNum(10,99)}-${randomNum(1000,9999)}`;
    case 'number':
      return String(randomNum(18, 65));
    case 'url':
      return 'https://www.example.com';
    default:
      return `${firstName} ${lastName}`;
  }
}

async function smartFillField(field) {
  const type = field.type?.toLowerCase();
  const tag = field.tagName;
  
  // Checkbox
  if (type === 'checkbox') {
    if (!field.checked) {
      field.checked = true;
      field.dispatchEvent(new Event('change', { bubbles: true }));
      field.dispatchEvent(new Event('click', { bubbles: true }));
    }
    return true;
  }
  
  // Radio
  if (type === 'radio') {
    const name = field.name;
    if (!document.querySelector(`input[type="radio"][name="${name}"]:checked`)) {
      field.checked = true;
      field.dispatchEvent(new Event('change', { bubbles: true }));
      field.dispatchEvent(new Event('click', { bubbles: true }));
    }
    return true;
  }
  
  // Select
  if (tag === 'SELECT') {
    if (field.options.length > 1) {
      field.selectedIndex = 1;
      field.dispatchEvent(new Event('change', { bubbles: true }));
      field.dispatchEvent(new Event('input', { bubbles: true }));
    }
    return true;
  }
  
  // Pular se já preenchido
  if (field.value && field.value.trim() !== '') {
    return false;
  }
  
  // Input/Textarea
  const fieldType = smartDetectFieldType(field);
  let value = generateSmartValue(fieldType);
  
  // Para type="date" usar formato ISO
  if (type === 'date' && fieldType === 'birthdate') {
    value = '2000-11-11';
  }
  
  // Preencher com múltiplas técnicas
  field.focus();
  
  // Técnica 1: Setter nativo (para React)
  try {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    if (setter) setter.call(field, value);
  } catch (e) {}
  
  // Técnica 2: Diretamente
  field.value = value;
  
  // Disparar eventos
  ['input', 'change', 'blur', 'keyup'].forEach(event => {
    field.dispatchEvent(new Event(event, { bubbles: true }));
  });
  
  console.log(`✓ ${fieldType}: ${value}`);
  return true;
}

async function fillAllFields() {
  console.log('=== INICIANDO PREENCHIMENTO ===');
  
  const allElements = document.querySelectorAll('input, select, textarea');
  let filled = 0;
  
  for (const element of allElements) {
    if (!isRunning) break;
    
    const type = element.type;
    
    if (type === 'hidden' || type === 'submit' || type === 'button' || element.disabled) {
      continue;
    }
    
    try {
      const wasFilled = await smartFillField(element);
      if (wasFilled) {
        filled++;
        await new Promise(r => setTimeout(r, fillSpeed));
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  }
  
  console.log(`=== CONCLUÍDO: ${filled} campos preenchidos ===`);
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Procurar botão
  const buttons = document.querySelectorAll('button, input[type="submit"], a');
  for (const btn of buttons) {
    const text = (btn.textContent || btn.value || '').toLowerCase();
    if (/next|continue|submit|continuar|seguinte|enviar|avançar|save/.test(text)) {
      console.log(`✓ Clicando: "${btn.textContent || btn.value}"`);
      btn.click();
      await new Promise(r => setTimeout(r, 2000));
      if (isRunning) fillAllFields();
      return;
    }
  }
}

// ==================== LISTENERS ====================
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'start') {
    createFloatingUI();
    const startBtn = floatingUI?.querySelector('#sff-start-btn');
    if (startBtn) startBtn.click();
  } else if (request.action === 'stop') {
    isRunning = false;
  }
});

// Auto-criar UI quando a página carregar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(createFloatingUI, 500);
  });
} else {
  setTimeout(createFloatingUI, 500);
}
