// Dados fictícios - Personagens famosos
const FICTIONAL_DATA = {
  firstNames: ['Harry', 'Hermione', 'Frodo', 'Aragorn', 'Leia', 'Luke', 'Katniss', 'Jon', 'Daenerys', 'Sherlock', 
               'Tony', 'Bruce', 'Peter', 'Diana', 'Clark', 'Barry', 'Eleven', 'Rick', 'Morty', 'Walter'],
  lastNames: ['Potter', 'Granger', 'Baggins', 'Stark', 'Skywalker', 'Everdeen', 'Snow', 'Targaryen', 'Holmes', 
              'Stark', 'Wayne', 'Parker', 'Prince', 'Kent', 'Allen', 'Sanchez', 'White', 'Lannister', 'Solo'],
  streets: ['Privet Drive', 'Baker Street', 'Bag End', 'Winterfell Road', 'Tatooine Ave', 'District 12 St', 
            'Kings Landing Blvd', '221B Lane', 'Stark Tower', 'Wayne Manor Drive'],
  cities: ['Gotham', 'Metropolis', 'Hogsmeade', 'Rivendell', 'Mos Eisley', 'Panem City', 'Westeros', 
           'London', 'New York', 'Central City'],
  companies: ['Stark Industries', 'Wayne Enterprises', 'Umbrella Corp', 'Cyberdyne Systems', 'Oscorp', 
              'Daily Planet', 'Wonka Industries', 'Monsters Inc', 'Aperture Science']
};

let isRunning = false;
let fillSpeed = 500;
let currentTimeout = null;

// Gerar dados aleatórios
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateEmail(firstName, lastName) {
  const formats = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}@swordhealth.com`,
    `${firstName.toLowerCase()}${lastName.toLowerCase()}@swordhealth.com`,
    `${firstName[0].toLowerCase()}${lastName.toLowerCase()}@swordhealth.com`,
    `${firstName.toLowerCase()}_${lastName.toLowerCase()}@swordhealth.com`
  ];
  return random(formats);
}

function generatePhone() {
  return `+1 ${randomNumber(200, 999)}-${randomNumber(100, 999)}-${randomNumber(1000, 9999)}`;
}

function generateZipCode() {
  return `${randomNumber(10000, 99999)}`;
}

function generateDate(field) {
  // SEMPRE usar 11/11/2000 para todos os campos de data
  const placeholder = (field.placeholder || '').toLowerCase();
  
  if (placeholder.includes('dd/mm/yyyy') || placeholder.includes('day/month/year')) {
    return '11/11/2000';
  }
  
  // Formato padrão ISO para inputs type="date"
  if (field.type === 'date') {
    return '2000-11-11';
  }
  
  // Formato americano por padrão (MM/DD/YYYY)
  return '11/11/2000';
}

function generateSSN() {
  return `${randomNumber(100, 999)}-${randomNumber(10, 99)}-${randomNumber(1000, 9999)}`;
}

// Detectar tipo de campo
function detectFieldType(field) {
  const name = (field.name || '').toLowerCase();
  const id = (field.id || '').toLowerCase();
  const placeholder = (field.placeholder || '').toLowerCase();
  const label = getFieldLabel(field);
  const type = (field.type || '').toLowerCase();
  
  const combined = `${name} ${id} ${placeholder} ${label}`.toLowerCase();
  
  // Email
  if (type === 'email' || /email|e-mail|mail/.test(combined)) {
    return 'email';
  }
  
  // Nome
  if (/first.*name|fname|nome/.test(combined)) {
    return 'firstName';
  }
  if (/last.*name|lname|surname|sobrenome|apelido/.test(combined)) {
    return 'lastName';
  }
  if (/^name$|full.*name|nome.*completo/.test(combined) && !/(company|empresa)/.test(combined)) {
    return 'fullName';
  }
  
  // Telefone
  if (type === 'tel' || /phone|telephone|mobile|celular|telefone/.test(combined)) {
    return 'phone';
  }
  
  // Endereço
  if (/address|street|rua|endereco|morada/.test(combined) && !/email/.test(combined)) {
    return 'street';
  }
  if (/city|cidade/.test(combined)) {
    return 'city';
  }
  if (/state|estado|provincia/.test(combined)) {
    return 'state';
  }
  if (/zip|postal|cep|codigo.*postal/.test(combined)) {
    return 'zip';
  }
  if (/country|pais/.test(combined)) {
    return 'country';
  }
  
  // Data
  if (type === 'date' || /birth|nascimento|data/.test(combined)) {
    return 'date';
  }
  
  // Empresa
  if (/company|empresa|organization/.test(combined)) {
    return 'company';
  }
  
  // SSN / ID
  if (/ssn|social.*security|tax.*id|nif|contribuinte/.test(combined)) {
    return 'ssn';
  }
  
  // Número genérico
  if (type === 'number' || /age|idade|quantity|numero/.test(combined)) {
    return 'number';
  }
  
  // URL
  if (type === 'url' || /website|site|url/.test(combined)) {
    return 'url';
  }
  
  // Texto genérico
  if (type === 'text' || type === '') {
    return 'text';
  }
  
  return 'unknown';
}

function getFieldLabel(field) {
  // Procurar label associado
  if (field.id) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    if (label) return label.textContent;
  }
  
  // Procurar label pai
  const parentLabel = field.closest('label');
  if (parentLabel) return parentLabel.textContent;
  
  return '';
}

// Gerar valor baseado no tipo
function generateValue(type, field) {
  const firstName = random(FICTIONAL_DATA.firstNames);
  const lastName = random(FICTIONAL_DATA.lastNames);
  
  switch (type) {
    case 'email':
      return generateEmail(firstName, lastName);
    case 'firstName':
      return firstName;
    case 'lastName':
      return lastName;
    case 'fullName':
      return `${firstName} ${lastName}`;
    case 'phone':
      return generatePhone();
    case 'street':
      return `${randomNumber(1, 9999)} ${random(FICTIONAL_DATA.streets)}`;
    case 'city':
      return random(FICTIONAL_DATA.cities);
    case 'state':
      return random(['NY', 'CA', 'TX', 'FL', 'IL', 'WA', 'MA']);
    case 'zip':
      return generateZipCode();
    case 'country':
      return random(['United States', 'USA', 'US']);
    case 'date':
      return generateDate(field);
    case 'company':
      return random(FICTIONAL_DATA.companies);
    case 'ssn':
      return generateSSN();
    case 'number':
      return String(randomNumber(1, 100));
    case 'url':
      return 'https://www.example.com';
    case 'text':
      return `${firstName} ${lastName}`;
    default:
      return `${firstName} ${lastName}`;
  }
}

// Preencher campo com animação
async function fillField(field, value) {
  field.focus();
  
  // Limpar campo
  field.value = '';
  
  // Para campos de data com date picker
  if (field.type === 'text' && (field.placeholder || '').toLowerCase().includes('mm/dd/yyyy')) {
    // Tentar preencher diretamente primeiro
    field.value = value;
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Se tem ícone de calendário, clicar nele e selecionar data
    const calendarIcon = field.parentElement.querySelector('[class*="calendar"], [class*="icon"], button');
    if (calendarIcon) {
      calendarIcon.click();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Procurar e clicar no dia 11 no calendário
      await selectDateFromPicker();
    }
    
    return;
  }
  
  // Para campos autocomplete/searchable selects - SIMPLIFICADO
  const role = field.getAttribute('role');
  const ariaAutocomplete = field.getAttribute('aria-autocomplete');
  const classList = field.className || '';
  
  if (role === 'combobox' || ariaAutocomplete === 'list' || classList.includes('autocomplete')) {
    // Digitar no campo
    field.value = value;
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Aguardar um pouco
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Tentar clicar na primeira opção visível
    const dropdownSelectors = [
      '[role="listbox"] [role="option"]:first-child',
      '[role="menu"] [role="option"]:first-child',
      '.dropdown-menu li:first-child',
      '.autocomplete-results li:first-child',
      'ul[class*="option"] li:first-child',
      'div[class*="menu"] div:first-child',
      '[class*="dropdown"] [class*="option"]:first-child'
    ];
    
    for (const selector of dropdownSelectors) {
      const option = document.querySelector(selector);
      if (option && option.offsetParent !== null) {
        option.click();
        await new Promise(resolve => setTimeout(resolve, 200));
        return;
      }
    }
    
    // Se não encontrou, tentar pressionar seta para baixo e Enter
    field.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown', keyCode: 40 }));
    await new Promise(resolve => setTimeout(resolve, 100));
    field.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter', keyCode: 13 }));
    
    return;
  }
  
  // Campos normais
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  ).set;
  nativeInputValueSetter.call(field, value);
  
  field.value = value;
  
  // Disparar eventos
  field.dispatchEvent(new Event('input', { bubbles: true }));
  field.dispatchEvent(new Event('change', { bubbles: true }));
  field.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
  field.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
  field.blur();
}

// Selecionar data do calendário popup
async function selectDateFromPicker() {
  // Aguardar calendário abrir
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Procurar botões/células com o número 11
  const daySelectors = [
    'button:not([disabled])',
    'div[role="button"]',
    'td[role="button"]',
    '[class*="day"]',
    '[class*="cell"]'
  ];
  
  for (const selector of daySelectors) {
    const days = document.querySelectorAll(selector);
    
    for (const day of days) {
      const text = day.textContent.trim();
      // Procurar exatamente o número 11
      if (text === '11' && day.offsetParent !== null && !day.disabled) {
        console.log('Clicando no dia 11 do calendário');
        day.click();
        await new Promise(resolve => setTimeout(resolve, 200));
        return true;
      }
    }
  }
  
  return false;
}

// Simular digitação caractere por caractere - REMOVIDO (não usado mais)

// Selecionar do autocomplete dropdown - REMOVIDO (simplificado acima)

// Encontrar todos os campos preenchíveis
function getFormFields() {
  const fields = document.querySelectorAll(
    'input[type="text"], input[type="email"], input[type="tel"], ' +
    'input[type="number"], input[type="date"], input[type="url"], ' +
    'input:not([type]), select, textarea, ' +
    'input[role="combobox"], input[type="checkbox"]'
  );
  
  return Array.from(fields).filter(field => {
    return field.offsetParent !== null && // Visível
           !field.disabled && 
           !field.readOnly &&
           field.type !== 'hidden' &&
           field.type !== 'submit' &&
           field.type !== 'button';
  });
}

// Verificar se todos os campos obrigatórios estão preenchidos
function areAllRequiredFieldsFilled() {
  const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
  
  for (const field of requiredFields) {
    if (!field.value || field.value.trim() === '') {
      return false;
    }
  }
  
  return requiredFields.length > 0;
}

// Procurar e clicar no botão de próxima página
function clickNextButton() {
  const buttons = document.querySelectorAll('button, input[type="submit"], a');
  
  for (const btn of buttons) {
    const text = (btn.textContent || btn.value || '').toLowerCase();
    if (/next|continue|submit|próximo|continuar|enviar|seguinte/.test(text)) {
      console.log('Clicando no botão:', btn.textContent || btn.value);
      btn.click();
      return true;
    }
  }
  
  return false;
}

// Processo principal de preenchimento
async function fillForm() {
  if (!isRunning) return;
  
  const fields = getFormFields();
  
  if (fields.length === 0) {
    console.log('Nenhum campo encontrado');
    return;
  }
  
  console.log(`Encontrados ${fields.length} campos para preencher`);
  
  for (let i = 0; i < fields.length; i++) {
    if (!isRunning) break;
    
    const field = fields[i];
    
    // Checkboxes - SEMPRE marcar
    if (field.type === 'checkbox') {
      if (!field.checked) {
        field.checked = true;
        field.dispatchEvent(new Event('change', { bubbles: true }));
        field.dispatchEvent(new Event('click', { bubbles: true }));
      }
      continue;
    }
    
    // Pular campos já preenchidos
    if (field.value && field.value.trim() !== '') {
      continue;
    }
    
    // Detectar tipo e preencher
    if (field.tagName === 'SELECT') {
      // Para selects normais - escolher PRIMEIRA opção válida
      const options = Array.from(field.options).filter((opt, idx) => idx > 0 && !opt.disabled);
      if (options.length > 0) {
        field.value = options[0].value;
        field.dispatchEvent(new Event('change', { bubbles: true }));
      }
    } else {
      const fieldType = detectFieldType(field);
      const value = generateValue(fieldType, field);
      
      console.log(`Preenchendo ${fieldType}:`, value);
      await fillField(field, value);
    }
    
    // Aguardar antes do próximo campo
    await new Promise(resolve => {
      currentTimeout = setTimeout(resolve, fillSpeed);
    });
  }
  
  // Verificar se todos os campos obrigatórios estão preenchidos
  if (areAllRequiredFieldsFilled()) {
    console.log('Todos os campos obrigatórios preenchidos. Procurando botão de próxima página...');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const clicked = clickNextButton();
    
    if (clicked) {
      // Aguardar nova página carregar e tentar preencher novamente
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (isRunning) {
        fillForm();
      }
    }
  }
}

// Listener para mensagens do popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'start') {
    isRunning = true;
    fillSpeed = request.speed || 500;
    chrome.storage.local.set({ isRunning: true });
    fillForm();
  } else if (request.action === 'stop') {
    isRunning = false;
    chrome.storage.local.set({ isRunning: false });
    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }
  }
});
