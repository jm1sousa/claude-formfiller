// ==================== DADOS FICTÍCIOS ====================
const FICTIONAL_DATA = {
  firstNames: ['Harry', 'Hermione', 'Frodo', 'Aragorn', 'Leia', 'Luke', 'Katniss', 'Jon', 'Daenerys', 'Sherlock', 
               'Tony', 'Bruce', 'Peter', 'Diana', 'Clark', 'Barry', 'Eleven', 'Rick', 'Morty', 'Walter'],
  lastNames: ['Potter', 'Granger', 'Baggins', 'Stark', 'Skywalker', 'Everdeen', 'Snow', 'Targaryen', 'Holmes', 
              'Stark', 'Wayne', 'Parker', 'Prince', 'Kent', 'Allen', 'Sanchez', 'White', 'Lannister', 'Solo'],
  streets: ['Privet Drive', 'Baker Street', 'Bag End', 'Winterfell Road', 'Tatooine Ave', 'District 12 St'],
  cities: ['Gotham', 'Metropolis', 'Hogsmeade', 'Rivendell', 'Mos Eisley', 'Panem City', 'Westeros'],
  companies: ['Stark Industries', 'Wayne Enterprises', 'Umbrella Corp', 'Cyberdyne Systems', 'Oscorp'],
  states: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut']
};

let isRunning = false;
let fillSpeed = 500;
let currentTimeout = null;

// ==================== UTILITÁRIOS ====================
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateEmail(firstName, lastName) {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@swordhealth.com`;
}

function generatePhone() {
  return `${randomNumber(200, 999)}-${randomNumber(100, 999)}-${randomNumber(1000, 9999)}`;
}

// ==================== DETECTAR TIPO DE CAMPO ====================
function detectFieldType(field) {
  const name = (field.name || '').toLowerCase();
  const id = (field.id || '').toLowerCase();
  const placeholder = (field.placeholder || '').toLowerCase();
  const type = (field.type || '').toLowerCase();
  const ariaLabel = (field.getAttribute('aria-label') || '').toLowerCase();
  const label = getFieldLabel(field);
  
  const combined = `${name} ${id} ${placeholder} ${label} ${ariaLabel}`.toLowerCase();
  
  // Email
  if (type === 'email' || /email|e-mail|mail/.test(combined)) return 'email';
  
  // Telefone
  if (type === 'tel' || /phone|telephone|mobile|celular|telefone|cell/.test(combined)) return 'phone';
  
  // Data
  if (type === 'date' || /birth|nascimento|data|dob|date/.test(combined)) return 'date';
  
  // Nome
  if (/first.*name|fname|given.*name|nome.*proprio/.test(combined)) return 'firstName';
  if (/last.*name|lname|surname|family.*name|sobrenome|apelido/.test(combined)) return 'lastName';
  if (/middle.*name|initial/.test(combined)) return 'middleName';
  if (/^name$|full.*name|nome.*completo/.test(combined) && !/(company|empresa)/.test(combined)) return 'fullName';
  
  // Endereço
  if (/address.*1|street|rua|endereco|morada|address.*line/.test(combined) && !/email/.test(combined)) return 'street';
  if (/address.*2|apt|apartment|suite|unit/.test(combined)) return 'address2';
  if (/city|cidade/.test(combined)) return 'city';
  if (/state|estado|provincia/.test(combined)) return 'state';
  if (/zip|postal|cep|codigo.*postal/.test(combined)) return 'zip';
  if (/country|pais/.test(combined)) return 'country';
  
  // Empresa
  if (/company|empresa|employer|organization/.test(combined)) return 'company';
  
  // SSN / ID
  if (/ssn|social.*security|tax.*id|nif|contribuinte/.test(combined)) return 'ssn';
  
  // URL
  if (type === 'url' || /website|site|url|homepage/.test(combined)) return 'url';
  
  // Número
  if (type === 'number' || /age|idade|quantity|numero|amount/.test(combined)) return 'number';
  
  // Texto genérico
  return 'text';
}

function getFieldLabel(field) {
  // Label com "for"
  if (field.id) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    if (label) return label.textContent;
  }
  
  // Label pai
  const parentLabel = field.closest('label');
  if (parentLabel) return parentLabel.textContent;
  
  // Procurar label próximo
  const prevElement = field.previousElementSibling;
  if (prevElement && prevElement.tagName === 'LABEL') return prevElement.textContent;
  
  return '';
}

// ==================== GERAR VALORES ====================
function generateValue(fieldType, field) {
  const firstName = random(FICTIONAL_DATA.firstNames);
  const lastName = random(FICTIONAL_DATA.lastNames);
  
  switch (fieldType) {
    case 'email':
      return generateEmail(firstName, lastName);
    case 'firstName':
      return firstName;
    case 'lastName':
      return lastName;
    case 'middleName':
      return random(['James', 'John', 'Marie', 'Anne', 'Lee', 'Ray']);
    case 'fullName':
      return `${firstName} ${lastName}`;
    case 'phone':
      return generatePhone();
    case 'street':
      return `${randomNumber(1, 9999)} ${random(FICTIONAL_DATA.streets)}`;
    case 'address2':
      return randomNumber(1, 10) > 7 ? `Apt ${randomNumber(1, 500)}` : '';
    case 'city':
      return random(FICTIONAL_DATA.cities);
    case 'state':
      return random(FICTIONAL_DATA.states);
    case 'zip':
      return String(randomNumber(10000, 99999));
    case 'country':
      return 'United States';
    case 'date':
      return '11/11/2000'; // Data fixa conforme solicitado
    case 'company':
      return random(FICTIONAL_DATA.companies);
    case 'ssn':
      return `${randomNumber(100, 999)}-${randomNumber(10, 99)}-${randomNumber(1000, 9999)}`;
    case 'number':
      return String(randomNumber(1, 100));
    case 'url':
      return 'https://www.example.com';
    case 'text':
    default:
      return `${firstName} ${lastName}`;
  }
}

// ==================== ENCONTRAR CAMPOS ====================
function getAllFields() {
  console.log('🔍 Procurando campos...');
  
  // Tentar de forma MUITO mais agressiva
  const allInputs = document.querySelectorAll('input, select, textarea');
  console.log(`📊 Total de inputs na página: ${allInputs.length}`);
  
  const visibleFields = [];
  
  allInputs.forEach((field, index) => {
    const type = field.type?.toLowerCase();
    const tag = field.tagName;
    
    // Pular apenas os realmente inúteis
    if (type === 'hidden' || type === 'submit' || type === 'button' || type === 'image' || type === 'reset') {
      console.log(`⏭️ Pulando campo ${index}: type=${type}`);
      return;
    }
    
    // Verificar visibilidade de forma mais permissiva
    const rect = field.getBoundingClientRect();
    const isInViewport = rect.width > 0 && rect.height > 0;
    const computedStyle = window.getComputedStyle(field);
    const isDisplayed = computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden';
    
    console.log(`🔎 Campo ${index}: tag=${tag}, type=${type}, visible=${isInViewport}, displayed=${isDisplayed}, disabled=${field.disabled}`);
    
    if ((isInViewport || isDisplayed) && !field.disabled) {
      visibleFields.push(field);
      console.log(`✅ Campo ${index} ADICIONADO: ${field.name || field.id || 'sem nome'}`);
    }
  });
  
  console.log(`✨ Total de campos detectados: ${visibleFields.length}`);
  return visibleFields;
}

// ==================== PREENCHER CAMPOS ====================
async function fillCheckbox(field) {
  if (!field.checked) {
    field.checked = true;
    field.dispatchEvent(new Event('change', { bubbles: true }));
    field.dispatchEvent(new Event('click', { bubbles: true }));
    field.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

async function fillRadio(field) {
  // Marcar o primeiro radio de cada grupo
  const name = field.name;
  const firstRadio = document.querySelector(`input[type="radio"][name="${name}"]`);
  
  if (firstRadio && !document.querySelector(`input[type="radio"][name="${name}"]:checked`)) {
    firstRadio.checked = true;
    firstRadio.dispatchEvent(new Event('change', { bubbles: true }));
    firstRadio.dispatchEvent(new Event('click', { bubbles: true }));
  }
}

async function fillSelect(field) {
  const options = Array.from(field.options).filter((opt, idx) => idx > 0 && !opt.disabled);
  
  if (options.length > 0) {
    field.value = options[0].value;
    field.dispatchEvent(new Event('change', { bubbles: true }));
    field.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

async function fillDatePicker(field, value) {
  // Tentar preencher diretamente
  field.value = value;
  field.dispatchEvent(new Event('input', { bubbles: true }));
  field.dispatchEvent(new Event('change', { bubbles: true }));
  
  // Procurar ícone de calendário próximo
  const parent = field.parentElement;
  const calendarIcon = parent?.querySelector('button, [class*="calendar"], [class*="icon"], svg');
  
  if (calendarIcon) {
    calendarIcon.click();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Procurar dia 11 no calendário
    const dayButtons = document.querySelectorAll('button, div[role="button"], td[role="gridcell"]');
    
    for (const btn of dayButtons) {
      if (btn.textContent.trim() === '11' && !btn.disabled && btn.offsetParent !== null) {
        btn.click();
        await new Promise(resolve => setTimeout(resolve, 200));
        break;
      }
    }
  }
}

async function fillAutocomplete(field, value) {
  field.focus();
  field.value = '';
  
  // Digitar valor
  field.value = value;
  field.dispatchEvent(new Event('input', { bubbles: true }));
  field.dispatchEvent(new Event('change', { bubbles: true }));
  field.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: value[0] }));
  field.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: value[0] }));
  
  // Aguardar dropdown
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Procurar primeira opção em dropdowns
  const dropdownSelectors = [
    '[role="listbox"] [role="option"]',
    '[role="menu"] [role="menuitem"]',
    'ul[class*="option"] li',
    'ul[class*="menu"] li',
    'div[class*="option"]',
    '.dropdown-menu li',
    '.autocomplete-results li'
  ];
  
  for (const selector of dropdownSelectors) {
    const options = document.querySelectorAll(selector);
    
    if (options.length > 0) {
      const firstOption = Array.from(options).find(opt => opt.offsetParent !== null);
      
      if (firstOption) {
        firstOption.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        firstOption.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        firstOption.click();
        await new Promise(resolve => setTimeout(resolve, 200));
        return;
      }
    }
  }
  
  // Tentar Arrow Down + Enter
  field.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown', keyCode: 40 }));
  await new Promise(resolve => setTimeout(resolve, 150));
  field.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter', keyCode: 13 }));
}

async function fillNormalInput(field, value) {
  console.log(`📝 Tentando preencher campo normal com: "${value}"`);
  
  field.focus();
  console.log('  → Focus aplicado');
  
  // Tentar múltiplas formas de setar o valor
  try {
    // Método 1: Setter nativo
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    )?.set;
    
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(field, value);
      console.log('  → Setter nativo aplicado');
    }
  } catch (e) {
    console.log('  ⚠️ Setter nativo falhou:', e);
  }
  
  // Método 2: Direto
  field.value = value;
  console.log('  → Valor direto aplicado');
  
  // Disparar TODOS os eventos possíveis
  const events = ['input', 'change', 'blur', 'keyup', 'keydown'];
  events.forEach(eventType => {
    field.dispatchEvent(new Event(eventType, { bubbles: true }));
  });
  console.log('  → Eventos disparados');
  
  // Verificar se o valor ficou
  setTimeout(() => {
    console.log(`  ✓ Valor final do campo: "${field.value}"`);
  }, 100);
}

async function fillField(field, value) {
  const fieldType = field.type?.toLowerCase();
  const role = field.getAttribute('role');
  const ariaAutocomplete = field.getAttribute('aria-autocomplete');
  
  console.log(`🎯 Preenchendo campo: type=${fieldType}, role=${role}, autocomplete=${ariaAutocomplete}`);
  
  // Checkbox
  if (fieldType === 'checkbox') {
    console.log('☑️ Detectado CHECKBOX');
    await fillCheckbox(field);
    return;
  }
  
  // Radio
  if (fieldType === 'radio') {
    console.log('🔘 Detectado RADIO');
    await fillRadio(field);
    return;
  }
  
  // Select
  if (field.tagName === 'SELECT') {
    console.log('📋 Detectado SELECT');
    await fillSelect(field);
    return;
  }
  
  // Date picker
  const detectedType = detectFieldType(field);
  if (detectedType === 'date' && fieldType !== 'date') {
    console.log('📅 Detectado DATE PICKER');
    await fillDatePicker(field, value);
    return;
  }
  
  // Autocomplete
  if (role === 'combobox' || ariaAutocomplete === 'list' || ariaAutocomplete === 'both') {
    console.log('🔽 Detectado AUTOCOMPLETE');
    await fillAutocomplete(field, value);
    return;
  }
  
  // Input normal
  console.log('📝 Preenchendo como INPUT NORMAL');
  await fillNormalInput(field, value);
}

// ==================== NAVEGAÇÃO ====================
function clickNextButton() {
  console.log('🔍 Procurando botão "Continuar"...');
  
  const buttons = Array.from(document.querySelectorAll('button, input[type="submit"], a[role="button"], a'));
  console.log(`📊 Total de botões encontrados: ${buttons.length}`);
  
  for (const btn of buttons) {
    const text = (btn.textContent || btn.value || btn.getAttribute('aria-label') || '').toLowerCase();
    const rect = btn.getBoundingClientRect();
    const isVisible = rect.width > 0 && rect.height > 0;
    const isEnabled = !btn.disabled;
    
    console.log(`🔘 Botão: "${text.substring(0, 30)}", visível=${isVisible}, habilitado=${isEnabled}`);
    
    if (isVisible && isEnabled && /next|continue|submit|próximo|continuar|enviar|seguinte|avançar|prosseguir|save/.test(text)) {
      console.log(`✅ ENCONTRADO botão para clicar: "${text}"`);
      btn.click();
      console.log('🔘 Clique executado!');
      return true;
    }
  }
  
  console.log('❌ Nenhum botão "Continuar" encontrado');
  return false;
}

function areAllRequiredFieldsFilled() {
  const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
  
  for (const field of requiredFields) {
    if (field.type === 'checkbox' && !field.checked) return false;
    if (field.type === 'radio') {
      const name = field.name;
      const isChecked = document.querySelector(`input[type="radio"][name="${name}"]:checked`);
      if (!isChecked) return false;
    }
    if (!field.value || field.value.trim() === '') return false;
  }
  
  return requiredFields.length > 0;
}

// ==================== PROCESSO PRINCIPAL ====================
async function fillForm() {
  if (!isRunning) return;
  
  console.log('🚀 Iniciando preenchimento...');
  const fields = getAllFields();
  
  if (fields.length === 0) {
    console.log('⚠️ Nenhum campo encontrado');
    return;
  }
  
  console.log(`📝 Encontrados ${fields.length} campos`);
  
  for (let i = 0; i < fields.length; i++) {
    if (!isRunning) break;
    
    const field = fields[i];
    
    // Pular campos já preenchidos (exceto checkbox/radio)
    if (field.type !== 'checkbox' && field.type !== 'radio') {
      if (field.value && field.value.trim() !== '') {
        console.log(`⏭️ Pulando campo já preenchido:`, field.name || field.id);
        continue;
      }
    }
    
    try {
      const fieldType = detectFieldType(field);
      const value = generateValue(fieldType, field);
      
      console.log(`✏️ Preenchendo ${fieldType}:`, value);
      await fillField(field, value);
      
      // Aguardar entre campos
      await new Promise(resolve => {
        currentTimeout = setTimeout(resolve, fillSpeed);
      });
    } catch (error) {
      console.error('❌ Erro ao preencher campo:', error);
    }
  }
  
  console.log('✅ Preenchimento concluído');
  
  // Verificar se pode avançar
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (areAllRequiredFieldsFilled()) {
    console.log('✔️ Todos os campos obrigatórios preenchidos');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (clickNextButton()) {
      console.log('➡️ Avançando para próxima página...');
      
      // Aguardar nova página e continuar
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (isRunning) {
        fillForm();
      }
    } else {
      console.log('⚠️ Botão "Continuar" não encontrado');
    }
  } else {
    console.log('ℹ️ Ainda há campos obrigatórios vazios ou não há campos obrigatórios');
  }
}

// ==================== LISTENERS ====================
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'start') {
    isRunning = true;
    fillSpeed = request.speed || 500;
    chrome.storage.local.set({ isRunning: true });
    console.log('▶️ Iniciando extensão...');
    fillForm();
  } else if (request.action === 'stop') {
    isRunning = false;
    chrome.storage.local.set({ isRunning: false });
    console.log('⏸️ Extensão pausada');
    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }
  }
});
