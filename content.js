// ==================== PLAYWRIGHT/SELENIUM REPLICA ====================
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

function random(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomNum(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// ==================== PLAYWRIGHT CORE METHODS ====================

// Scroll to element (Playwright sempre faz isso antes de interagir)
async function scrollToElement(element) {
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  await new Promise(r => setTimeout(r, 100));
}

// Wait for element to be ready (Playwright espera elemento estar pronto)
async function waitForElement(element) {
  await scrollToElement(element);
  
  // Esperar estar visível
  let attempts = 0;
  while (attempts < 10) {
    const rect = element.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) break;
    await new Promise(r => setTimeout(r, 50));
    attempts++;
  }
}

// Fill input (método fill() do Playwright)
async function playwrightFill(element, value) {
  console.log(`🎯 Playwright.fill("${value}")`);
  
  await waitForElement(element);
  
  // 1. Focus (Playwright sempre foca primeiro)
  element.focus();
  await new Promise(r => setTimeout(r, 50));
  
  // 2. Select all (Playwright seleciona tudo antes de preencher)
  element.select?.();
  await new Promise(r => setTimeout(r, 50));
  
  // 3. Clear com backspace (Playwright limpa assim)
  const currentValue = element.value;
  for (let i = 0; i < currentValue.length; i++) {
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace', keyCode: 8, bubbles: true }));
    element.value = element.value.slice(0, -1);
    element.dispatchEvent(new InputEvent('input', { inputType: 'deleteContentBackward', bubbles: true }));
  }
  
  // 4. Type caractere por caractere (Playwright digita assim)
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    
    // KeyDown
    element.dispatchEvent(new KeyboardEvent('keydown', {
      key: char,
      code: `Key${char.toUpperCase()}`,
      keyCode: char.charCodeAt(0),
      which: char.charCodeAt(0),
      bubbles: true,
      cancelable: true,
      composed: true
    }));
    
    // KeyPress
    element.dispatchEvent(new KeyboardEvent('keypress', {
      key: char,
      code: `Key${char.toUpperCase()}`,
      keyCode: char.charCodeAt(0),
      which: char.charCodeAt(0),
      charCode: char.charCodeAt(0),
      bubbles: true,
      cancelable: true
    }));
    
    // Atualizar valor (técnica para React/Vue)
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set ||
                         Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
    if (nativeSetter) {
      nativeSetter.call(element, element.value + char);
    } else {
      element.value += char;
    }
    
    // Input event
    element.dispatchEvent(new InputEvent('input', {
      inputType: 'insertText',
      data: char,
      bubbles: true,
      cancelable: true,
      composed: true
    }));
    
    // KeyUp
    element.dispatchEvent(new KeyboardEvent('keyup', {
      key: char,
      code: `Key${char.toUpperCase()}`,
      keyCode: char.charCodeAt(0),
      which: char.charCodeAt(0),
      bubbles: true,
      cancelable: true,
      composed: true
    }));
    
    // Delay entre teclas (Playwright faz isso)
    await new Promise(r => setTimeout(r, 30));
  }
  
  // 5. Eventos finais
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
  
  console.log(`  ✓ Preenchido: "${element.value}"`);
}

// Click (método click() do Playwright)
async function playwrightClick(element) {
  console.log(`🖱️ Playwright.click()`);
  
  await waitForElement(element);
  
  const rect = element.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  
  // MouseOver
  element.dispatchEvent(new MouseEvent('mouseover', {
    bubbles: true, cancelable: true, view: window,
    clientX: x, clientY: y
  }));
  
  await new Promise(r => setTimeout(r, 10));
  
  // MouseMove
  element.dispatchEvent(new MouseEvent('mousemove', {
    bubbles: true, cancelable: true, view: window,
    clientX: x, clientY: y
  }));
  
  await new Promise(r => setTimeout(r, 10));
  
  // MouseDown
  element.dispatchEvent(new MouseEvent('mousedown', {
    bubbles: true, cancelable: true, view: window,
    clientX: x, clientY: y, button: 0
  }));
  
  // Focus
  element.focus();
  
  await new Promise(r => setTimeout(r, 10));
  
  // MouseUp
  element.dispatchEvent(new MouseEvent('mouseup', {
    bubbles: true, cancelable: true, view: window,
    clientX: x, clientY: y, button: 0
  }));
  
  // Click
  element.dispatchEvent(new MouseEvent('click', {
    bubbles: true, cancelable: true, view: window,
    clientX: x, clientY: y, button: 0, detail: 1
  }));
  
  console.log(`  ✓ Clicado`);
}

// Select option (método selectOption() do Playwright)
async function playwrightSelectOption(element, index) {
  console.log(`📋 Playwright.selectOption(index: ${index})`);
  
  await waitForElement(element);
  
  element.focus();
  element.selectedIndex = index;
  
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
  
  console.log(`  ✓ Selecionado: ${element.options[index]?.text}`);
}

// Check (método check() do Playwright)
async function playwrightCheck(element) {
  console.log(`☑️ Playwright.check()`);
  
  if (element.checked) {
    console.log(`  ⏭️ Já marcado`);
    return;
  }
  
  await playwrightClick(element);
}

// ==================== UI FLUTUANTE (MANTIDO) ====================
function createFloatingUI() {
  if (floatingUI) return;
  
  floatingUI = document.createElement('div');
  floatingUI.id = 'smart-form-filler-ui';
  floatingUI.innerHTML = `
    <style>
      #smart-form-filler-ui {
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        width: 340px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        color: white;
        z-index: 2147483647 !important;
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
      <div class="sff-title">🎯 Playwright Automation</div>
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
    
    <div class="sff-status" id="sff-status">Pronto para automação</div>
    
    <div class="sff-info">
      🤖 Usando técnicas Playwright/Selenium<br>
      📧 Emails: @swordhealth.com<br>
      📅 Data fixa: 11/11/2000
    </div>
  `;
  
  document.body.appendChild(floatingUI);
  
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
    status.textContent = '✅ Automação ativa';
    runPlaywrightAutomation();
  });
  
  stopBtn.addEventListener('click', () => {
    isRunning = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    status.className = 'sff-status stopped';
    status.textContent = '⏸ Automação pausada';
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
  
  dragHandle.onmousedown = (e) => {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; };
    document.onmousemove = (e) => {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      element.style.top = (element.offsetTop - pos2) + 'px';
      element.style.right = '';
      element.style.left = (element.offsetLeft - pos1) + 'px';
    };
  };
}

// ==================== DETECÇÃO MELHORADA (MANTIDA) ====================
function detectFieldType(field) {
  const name = (field.name || '').toLowerCase();
  const id = (field.id || '').toLowerCase();
  const placeholder = (field.placeholder || '').toLowerCase();
  const type = (field.type || 'text').toLowerCase();
  const autocomplete = (field.getAttribute('autocomplete') || '').toLowerCase();
  const ariaLabel = (field.getAttribute('aria-label') || '').toLowerCase();
  
  let labelText = '';
  if (field.id) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    if (label) labelText = label.textContent.toLowerCase();
  }
  const parentLabel = field.closest('label');
  if (parentLabel) labelText += ' ' + parentLabel.textContent.toLowerCase();
  
  const combined = `${name} ${id} ${placeholder} ${autocomplete} ${labelText} ${ariaLabel}`;
  
  if (type === 'email' || autocomplete.includes('email') || /\bemail\b|e-mail|correo/i.test(combined)) return 'email';
  if (type === 'tel' || autocomplete.includes('tel') || /\bphone\b|tel|celular|mobile/i.test(combined)) return 'phone';
  if (type === 'date' || autocomplete.includes('bday') || /birth|nascimento|bday|date.*birth/i.test(combined)) return 'date';
  if (autocomplete.includes('given') || /first.*name|given.*name|nome.*próprio/i.test(combined)) return 'firstName';
  if (autocomplete.includes('family') || /last.*name|surname|sobrenome|family/i.test(combined)) return 'lastName';
  if (autocomplete === 'name' || /full.*name|nome.*completo/i.test(combined)) return 'fullName';
  if (autocomplete.includes('address') || /address|street|rua/i.test(combined)) return 'address';
  if (autocomplete.includes('city') || /\bcity\b|cidade/i.test(combined)) return 'city';
  if (autocomplete.includes('state') || /\bstate\b|estado/i.test(combined)) return 'state';
  if (autocomplete.includes('postal') || /zip|postal|cep/i.test(combined)) return 'zip';
  if (autocomplete.includes('country') || /country|país/i.test(combined)) return 'country';
  if (autocomplete.includes('organization') || /company|employer|empresa/i.test(combined)) return 'company';
  
  return 'text';
}

function generateValue(fieldType) {
  const firstName = random(FICTIONAL_DATA.firstNames);
  const lastName = random(FICTIONAL_DATA.lastNames);
  
  const values = {
    'email': `${firstName.toLowerCase()}.${lastName.toLowerCase()}@swordhealth.com`,
    'phone': `(${randomNum(200,999)}) ${randomNum(200,999)}-${randomNum(1000,9999)}`,
    'date': '11/11/2000',
    'firstName': firstName,
    'lastName': lastName,
    'fullName': `${firstName} ${lastName}`,
    'address': `${randomNum(100,9999)} Main Street`,
    'city': random(FICTIONAL_DATA.cities),
    'state': random(FICTIONAL_DATA.states),
    'zip': String(randomNum(10000, 99999)),
    'country': 'United States',
    'company': random(FICTIONAL_DATA.companies),
    'text': `${firstName} ${lastName}`
  };
  
  return values[fieldType] || values['text'];
}

// ==================== AUTOMAÇÃO PRINCIPAL ====================
async function runPlaywrightAutomation() {
  console.log('🤖 === PLAYWRIGHT AUTOMATION START ===');
  
  const allElements = document.querySelectorAll('input, select, textarea');
  console.log(`📊 Total elements: ${allElements.length}`);
  
  let filled = 0;
  
  for (const element of allElements) {
    if (!isRunning) break;
    
    const type = element.type?.toLowerCase();
    const tag = element.tagName;
    
    // Pular inúteis
    if (type === 'hidden' || type === 'submit' || type === 'button' || element.disabled) continue;
    
    try {
      // CHECKBOX (SEMPRE MARCAR)
      if (type === 'checkbox') {
        await playwrightCheck(element);
        filled++;
        await new Promise(r => setTimeout(r, fillSpeed));
        continue;
      }
      
      // RADIO (MARCAR PRIMEIRO DO GRUPO)
      if (type === 'radio') {
        const name = element.name;
        const firstRadio = document.querySelector(`input[type="radio"][name="${name}"]`);
        if (firstRadio && !document.querySelector(`input[type="radio"][name="${name}"]:checked`)) {
          await playwrightClick(firstRadio);
          filled++;
          await new Promise(r => setTimeout(r, fillSpeed));
        }
        continue;
      }
      
      // SELECT (PRIMEIRA OPÇÃO)
      if (tag === 'SELECT') {
        if (element.options.length > 1) {
          await playwrightSelectOption(element, 1);
          filled++;
          await new Promise(r => setTimeout(r, fillSpeed));
        }
        continue;
      }
      
      // Pular se já preenchido
      if (element.value && element.value.trim() !== '') continue;
      
      // INPUT/TEXTAREA
      const fieldType = detectFieldType(element);
      let value = generateValue(fieldType);
      
      // Para type="date" usar ISO
      if (type === 'date' && fieldType === 'date') {
        value = '2000-11-11';
      }
      
      await playwrightFill(element, value);
      filled++;
      await new Promise(r => setTimeout(r, fillSpeed));
      
    } catch (error) {
      console.error('❌ Error:', error);
    }
  }
  
  console.log(`✅ === AUTOMATION COMPLETE: ${filled} fields filled ===`);
  
  // Aguardar
  await new Promise(r => setTimeout(r, 1000));
  
  // Procurar botão CONTINUAR
  console.log('🔍 Looking for Continue button...');
  const buttons = document.querySelectorAll('button, input[type="submit"], a, [role="button"]');
  
  for (const btn of buttons) {
    const text = (btn.textContent || btn.value || btn.getAttribute('aria-label') || '').toLowerCase();
    
    if (/next|continue|submit|continuar|seguinte|enviar|save|avançar|prosseguir/i.test(text)) {
      console.log(`🔘 Found button: "${btn.textContent || btn.value}"`);
      await playwrightClick(btn);
      
      // Aguardar página carregar
      await new Promise(r => setTimeout(r, 2500));
      
      // Continuar preenchendo
      if (isRunning) {
        runPlaywrightAutomation();
      }
      return;
    }
  }
  
  console.log('⚠️ No Continue button found');
}

// ==================== INICIALIZAÇÃO ====================
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'start') {
    createFloatingUI();
    setTimeout(() => {
      const startBtn = floatingUI?.querySelector('#sff-start-btn');
      if (startBtn) startBtn.click();
    }, 100);
  } else if (request.action === 'stop') {
    isRunning = false;
  }
});

// Auto-criar UI
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(createFloatingUI, 500));
} else {
  setTimeout(createFloatingUI, 500);
}
