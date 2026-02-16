// VERSÃO ULTRA SIMPLIFICADA - PREENCHE TUDO
let isRunning = false;
let fillSpeed = 500;

const NAMES = ['Harry Potter', 'Hermione Granger', 'Tony Stark', 'Bruce Wayne', 'Peter Parker'];
const EMAILS = ['harry.potter@swordhealth.com', 'hermione.granger@swordhealth.com', 'tony.stark@swordhealth.com'];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getValueForField(field) {
  const name = (field.name || '').toLowerCase();
  const id = (field.id || '').toLowerCase();
  const placeholder = (field.placeholder || '').toLowerCase();
  const type = (field.type || 'text').toLowerCase();
  const combined = name + id + placeholder;
  
  // Email
  if (type === 'email' || combined.includes('email') || combined.includes('mail')) {
    return randomItem(EMAILS);
  }
  
  // Phone
  if (type === 'tel' || combined.includes('phone') || combined.includes('tel')) {
    return '555-123-4567';
  }
  
  // Date
  if (type === 'date' || combined.includes('date') || combined.includes('birth') || combined.includes('dob')) {
    return type === 'date' ? '2000-11-11' : '11/11/2000';
  }
  
  // Number
  if (type === 'number' || combined.includes('age') || combined.includes('zip')) {
    return combined.includes('zip') ? '12345' : '25';
  }
  
  // First name
  if (combined.includes('first') || combined.includes('fname')) {
    return 'Harry';
  }
  
  // Last name
  if (combined.includes('last') || combined.includes('lname')) {
    return 'Potter';
  }
  
  // Name
  if (combined.includes('name')) {
    return randomItem(NAMES);
  }
  
  // Address
  if (combined.includes('address') || combined.includes('street')) {
    return '123 Main Street';
  }
  
  // City
  if (combined.includes('city')) {
    return 'New York';
  }
  
  // State
  if (combined.includes('state')) {
    return 'New York';
  }
  
  // Default
  return randomItem(NAMES);
}

async function fillAllFields() {
  console.log('=== INICIANDO PREENCHIMENTO ===');
  
  // Pegar TODOS os inputs, selects e textareas
  const allElements = document.querySelectorAll('input, select, textarea');
  console.log(`Total de elementos: ${allElements.length}`);
  
  let filled = 0;
  
  for (const element of allElements) {
    if (!isRunning) break;
    
    const type = element.type;
    const tag = element.tagName;
    
    // Pular só os inúteis
    if (type === 'hidden' || type === 'submit' || type === 'button' || element.disabled) {
      continue;
    }
    
    try {
      // CHECKBOX - marcar
      if (type === 'checkbox') {
        if (!element.checked) {
          element.checked = true;
          element.dispatchEvent(new Event('change', { bubbles: true }));
          element.dispatchEvent(new Event('click', { bubbles: true }));
          filled++;
          console.log(`✓ Checkbox marcado`);
        }
        continue;
      }
      
      // RADIO - marcar primeiro
      if (type === 'radio') {
        const name = element.name;
        const firstRadio = document.querySelector(`input[type="radio"][name="${name}"]`);
        if (firstRadio && !document.querySelector(`input[type="radio"][name="${name}"]:checked`)) {
          firstRadio.checked = true;
          firstRadio.dispatchEvent(new Event('change', { bubbles: true }));
          filled++;
          console.log(`✓ Radio marcado`);
        }
        continue;
      }
      
      // SELECT - primeira opção
      if (tag === 'SELECT') {
        if (element.options.length > 1) {
          element.selectedIndex = 1;
          element.dispatchEvent(new Event('change', { bubbles: true }));
          filled++;
          console.log(`✓ Select preenchido: ${element.options[1].text}`);
        }
        continue;
      }
      
      // Pular se já preenchido
      if (element.value && element.value.trim() !== '') {
        continue;
      }
      
      // INPUT/TEXTAREA - preencher
      const value = getValueForField(element);
      
      // Múltiplas tentativas de preencher
      element.focus();
      element.value = value;
      
      // Disparar eventos
      element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
      element.dispatchEvent(new Event('blur', { bubbles: true }));
      
      filled++;
      console.log(`✓ Preenchido: ${element.name || element.id || 'campo'} = ${value}`);
      
      // Aguardar
      await new Promise(r => setTimeout(r, fillSpeed));
      
    } catch (error) {
      console.error('Erro:', error);
    }
  }
  
  console.log(`=== PREENCHIMENTO CONCLUÍDO: ${filled} campos ===`);
  
  // Aguardar um pouco
  await new Promise(r => setTimeout(r, 1000));
  
  // Procurar botão para clicar
  console.log('Procurando botão Continuar...');
  
  const allButtons = document.querySelectorAll('button, input[type="submit"], a');
  
  for (const btn of allButtons) {
    const text = (btn.textContent || btn.value || '').toLowerCase();
    
    if (text.includes('next') || text.includes('continue') || text.includes('submit') || 
        text.includes('continuar') || text.includes('seguinte') || text.includes('enviar') ||
        text.includes('avançar') || text.includes('prosseguir')) {
      
      console.log(`✓ Clicando em: "${btn.textContent || btn.value}"`);
      btn.click();
      
      // Aguardar nova página
      await new Promise(r => setTimeout(r, 2000));
      
      // Continuar preenchendo
      if (isRunning) {
        fillAllFields();
      }
      
      return;
    }
  }
  
  console.log('Nenhum botão "Continuar" encontrado');
}

// Listener
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'start') {
    isRunning = true;
    fillSpeed = request.speed || 500;
    console.log('▶️ EXTENSÃO INICIADA');
    fillAllFields();
  } else if (request.action === 'stop') {
    isRunning = false;
    console.log('⏸️ EXTENSÃO PARADA');
  }
});
