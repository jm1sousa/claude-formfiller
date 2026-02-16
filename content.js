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
  const year = randomNumber(1970, 2005);
  const month = String(randomNumber(1, 12)).padStart(2, '0');
  const day = String(randomNumber(1, 28)).padStart(2, '0');
  
  // Verificar formato esperado pelo campo
  const placeholder = (field.placeholder || '').toLowerCase();
  
  if (placeholder.includes('mm/dd/yyyy') || placeholder.includes('month/day/year')) {
    return `${month}/${day}/${year}`;
  } else if (placeholder.includes('dd/mm/yyyy') || placeholder.includes('day/month/year')) {
    return `${day}/${month}/${year}`;
  } else if (placeholder.includes('yyyy-mm-dd')) {
    return `${year}-${month}-${day}`;
  }
  
  // Formato padrão ISO para inputs type="date"
  if (field.type === 'date') {
    return `${year}-${month}-${day}`;
  }
  
  // Formato americano por padrão
  return `${month}/${day}/${year}`;
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
  
  // Para campos autocomplete/searchable selects
  const role = field.getAttribute('role');
  const ariaAutocomplete = field.getAttribute('aria-autocomplete');
  
  if (role === 'combobox' || ariaAutocomplete === 'list') {
    // Simular digitação para ativar autocomplete
    await typeIntoField(field, value);
    
    // Aguardar dropdown aparecer
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Procurar e clicar na primeira opção do dropdown
    await selectFromAutocomplete(field, value);
    
    return;
  }
  
  // Disparar eventos para frameworks como React
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

// Simular digitação caractere por caractere
async function typeIntoField(field, text) {
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    field.value += char;
    
    // Disparar eventos de teclado
    field.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: char }));
    field.dispatchEvent(new KeyboardEvent('keypress', { bubbles: true, key: char }));
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: char }));
    
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}

// Selecionar do autocomplete dropdown
async function selectFromAutocomplete(field, searchText) {
  // Procurar por listas de opções que apareceram
  const selectors = [
    '[role="listbox"]',
    '[role="menu"]',
    '.dropdown-menu',
    '.autocomplete-results',
    'ul[class*="option"]',
    'div[class*="menu"]',
    '[class*="dropdown"]'
  ];
  
  for (const selector of selectors) {
    const dropdown = document.querySelector(selector);
    if (!dropdown) continue;
    
    // Procurar opções dentro do dropdown
    const options = dropdown.querySelectorAll(
      '[role="option"], li, div[class*="option"], div[tabindex]'
    );
    
    if (options.length > 0) {
      // Procurar opção que corresponda ao texto ou pegar a primeira
      let targetOption = options[0];
      
      for (const option of options) {
        const text = option.textContent.toLowerCase();
        if (text.includes(searchText.toLowerCase())) {
          targetOption = option;
          break;
        }
      }
      
      // Simular clique na opção
      targetOption.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      targetOption.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      targetOption.click();
      
      return true;
    }
  }
  
  // Se não encontrou dropdown, tentar pressionar Enter
  field.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter', keyCode: 13 }));
  
  return false;
}

// Encontrar todos os campos preenchíveis
function getFormFields() {
  const fields = document.querySelectorAll(
    'input[type="text"], input[type="email"], input[type="tel"], ' +
    'input[type="number"], input[type="date"], input[type="url"], ' +
    'input:not([type]), select, textarea, ' +
    'input[role="combobox"], div[role="combobox"] input'
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
    
    // Pular campos já preenchidos
    if (field.value && field.value.trim() !== '') {
      continue;
    }
    
    // Detectar tipo e preencher
    if (field.tagName === 'SELECT') {
      // Para selects, escolher opção aleatória (exceto a primeira que geralmente é placeholder)
      const options = Array.from(field.options).filter((opt, idx) => idx > 0 && !opt.disabled);
      if (options.length > 0) {
        const randomOption = random(options);
        field.value = randomOption.value;
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
