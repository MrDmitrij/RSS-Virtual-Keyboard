class BuildElements {
  constructor(type, parentElement, classes, text, otherAttrs) {
    if (typeof type === 'string') {
      this.element = document.createElement(type);

      if (parentElement) {
        if (classes && Array.isArray(classes)) {
          this.element.classList.add(...classes);
        }

        if (text && typeof text === 'string') {
          this.element.innerText = text;
        }

        if (otherAttrs && Array.isArray(otherAttrs)) {
          for (let i = 0; i < otherAttrs.length; i += 2) {
            this.element.setAttribute(otherAttrs[i], otherAttrs[i + 1]);
          }
        }

        parentElement.appendChild(this.element);
      }
    }
  }

  getElement() {
    return this.element;
  }
}

const wrapperDiv = new BuildElements('div', document.body, ['wrapper']).getElement();

function addTitle() {
  return new BuildElements('p', wrapperDiv, ['title'], 'RSS Виртуальная клавиатура');
}

addTitle();

const textArea = new BuildElements('textarea', wrapperDiv, ['textarea'], '', ['rows', 5, 'cols', 50, 'placeholder', 'Type smth...', 'autofocus', '']).getElement();
const keyBoardContainer = new BuildElements('div', wrapperDiv, ['keyboard']).getElement();

function addDescription() {
  return new BuildElements('p', wrapperDiv, ['description'], 'Клавиатура создана в операционной системе Windows');
}

addDescription();

function addTextSwitchingLanguage() {
  return new BuildElements('p', wrapperDiv, ['language'], 'Для переключения языка комбинация: левыe CTRL + ALT');
}

addTextSwitchingLanguage();

let en;
let ru;
let currentLocale = 'ru';
const KEYBOARD_LINES = [['Backquote',
    'Digit1',
    'Digit2',
    'Digit3',
    'Digit4',
    'Digit5',
    'Digit6',
    'Digit7',
    'Digit8',
    'Digit9',
    'Digit0',
    'Minus',
    'Equal',
    'Backspace'], ['Tab',
    'KeyQ',
    'KeyW',
    'KeyE',
    'KeyR',
    'KeyT',
    'KeyY',
    'KeyU',
    'KeyI',
    'KeyO',
    'KeyP',
    'BracketLeft',
    'BracketRight',
    'Backslash',
    'Delete'], ['CapsLock',
    'KeyA',
    'KeyS',
    'KeyD',
    'KeyF',
    'KeyG',
    'KeyH',
    'KeyJ',
    'KeyK',
    'KeyL',
    'Semicolon',
    'Quote',
    'Enter'], ['ShiftLeft',
    'KeyZ',
    'KeyX',
    'KeyC',
    'KeyV',
    'KeyB',
    'KeyN',
    'KeyM',
    'Comma',
    'Period',
    'Slash',
    'ArrowUp',
    'ShiftRight'], ['ControlLeft',
    'MetaLeft',
    'AltLeft',
    'Space',
    'AltRight',
    'ArrowLeft',
    'ArrowDown',
    'ArrowRight',
    'ControlRight']];
const rowsContainer = [];
let ctrlLeftPressed = false;
let altLeftPressed = false;
let ctrlRightPressed = false;
let altRightPressed = false;
const auxKeys = [];
const LANGUAGES = ['ru', 'en'];

function getLocale() {
  if (currentLocale === 'ru') {
    return ru;
  }
  if (currentLocale === 'en') {
    return en;
  }
  return en;
}

function generateButtons() {
  for (let i = 0; i < KEYBOARD_LINES.length; i++) {
    rowsContainer.push(new BuildElements('div', keyBoardContainer, ['row']).getElement());
    for (let j = 0; j < KEYBOARD_LINES[i].length; j++) {
      const KEY = new BuildElements('div', rowsContainer[i], [KEYBOARD_LINES[i][j], 'key', 'hover']).getElement();
      const EN_DIV = new BuildElements('div', KEY, ['en']).getElement();
      const RU_DIV = new BuildElements('div', KEY, ['ru']).getElement();
      EN_DIV.innerText = en[KEYBOARD_LINES[i][j]].shiftDown;
      RU_DIV.innerText = ru[KEYBOARD_LINES[i][j]].shiftDown;
      if (ru[KEYBOARD_LINES[i][j]].shiftUp === ru[KEYBOARD_LINES[i][j]].shiftDown) {
        auxKeys.push(KEYBOARD_LINES[i][j]);
      }
    }
  }
}

function disableElementsByClass(...classList) {
  if (classList) {
    classList.forEach((cl) => {
      const elements = document.querySelectorAll(`.${cl}`);
      elements.forEach((el) => el.classList.add('hidden'));
    });
  }
}

function enableElemenstByClass(...classList) {
  if (classList) {
    classList.forEach((cl) => {
      const elements = document.querySelectorAll(`.${cl}`);
      elements.forEach((el) => {
        el.classList.remove('hidden');
      });
    });
  }
}

function updateLocaleFromLocalStorage() {
  const data = localStorage.getItem('language');
  if (data) {
    currentLocale = data;
  }
}

function updateKeyboard() {
  updateLocaleFromLocalStorage();
  if (currentLocale === 'ru') {
    enableElemenstByClass('ru');
    disableElementsByClass('en');
  } else if (currentLocale === 'en') {
    enableElemenstByClass('en');
    disableElementsByClass('ru');
  }
}

function prepareString(text, cursorPosition, inputText) {
  return [...text].slice(0, cursorPosition).join('') + inputText + [...text].slice(cursorPosition, [...text].length).join('');
}

function changeTextOfTextArea(inputText) {
  const cursor = textArea.selectionStart + [...inputText].length;
  textArea.value = prepareString(textArea.value, textArea.selectionStart, inputText);
  textArea.selectionStart = cursor;
  textArea.selectionEnd = cursor;
}

function checkLanguageSwitch() {
  if (ctrlLeftPressed && altLeftPressed) {
    currentLocale = LANGUAGES.indexOf(currentLocale) ? 'ru' : 'en';
    localStorage.setItem('language', currentLocale);
    setTimeout(() => {
      ctrlLeftPressed = false;
      altLeftPressed = false;
    }, 300);
  }
}

function constrolsPressed(key) {
  if (key === 'ControlLeft') {
    ctrlLeftPressed = !ctrlLeftPressed;
    checkLanguageSwitch();
  } else if (key === 'ControlRight') {
    ctrlRightPressed = !ctrlRightPressed;
  } else if (key === 'AltLeft') {
    altLeftPressed = !altLeftPressed;
    checkLanguageSwitch();
  } else if (key === 'AltRight') {
    altRightPressed = !altRightPressed;
  }
  updateKeyboard();
}

function specialActionKeysPressed(key) {
  switch (key) {
    case 'ControlLeft':
    case 'ControlRight':
    case 'AltLeft':
    case 'AltRight':
      constrolsPressed(key);
      break;
    default:
      break;
  }
}

function pressRealKeyboard(e) {
  e.preventDefault();
  const locale = getLocale();
  if (auxKeys.includes(e.code)) {
    specialActionKeysPressed(e.code);
  } else {
    changeTextOfTextArea(locale[e.code].shiftDown);
  }
} 

fetch('json/en.json').then((response) => response.json()).then((json) => {
  en = json;
  fetch('json/ru.json').then((response) => response.json()).then((json2) => {
    ru = json2;
    generateButtons();
    updateKeyboard();
  });
});

document.addEventListener('keydown', pressRealKeyboard);


alert('Здравствуйте, просьба по возможности проверить работу позже, за вторник - среду(до вечера) сделаю, спасибо за понимание!');
