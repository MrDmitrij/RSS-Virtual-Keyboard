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
  for (let i = 0; i < KEYBOARD_LINES.length; i += 1) {
    rowsContainer.push(new BuildElements('div', keyBoardContainer, ['row']).getElement());
    for (let j = 0; j < KEYBOARD_LINES[i].length; j += 1) {
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

function deleteSymbolOfTextArea(symbolPosition, cursorShift = 0) {
  if (symbolPosition > 0) {
    const cursor = textArea.selectionStart - 1 + cursorShift;
    textArea.value = [...textArea.value].slice(0, symbolPosition - 1).join('')
        + [...textArea.value].slice(symbolPosition, [...textArea.value].length).join('');
    textArea.selectionStart = cursor;
    textArea.selectionEnd = cursor;
  }
}

function changeCursorPosition(offsetX, offsetY) {
  if (textArea.selectionStart + offsetX < 1) {
    textArea.selectionStart = 0;
  } else {
    textArea.selectionStart += offsetX;
    textArea.selectionEnd = textArea.selectionStart;
  }
  if (offsetY !== 0) {
    const arrWithLinesStr = textArea.value.split('\n');
    const arrWithLines = [];
    for (let i = 0; i < arrWithLinesStr.length; i += 1) {
      const currentLine = arrWithLinesStr[i].split('');
      if (currentLine.length < 94) {
        arrWithLines.push(currentLine);
      } else {
        let counter = 0;
        while (counter * 94 < currentLine.length) {
          arrWithLines.push(currentLine.slice(94 * counter, 94 * (counter + 1)));
          counter += 1;
        }
      }
    }
    let currentLine = 0;
    let sum = 0;
    let positionInLine = 0;
    while (currentLine < arrWithLines.length) {
      sum += arrWithLines[currentLine].length;
      if (sum + currentLine < textArea.selectionStart) {
        currentLine += 1;
      } else {
        positionInLine = arrWithLines[currentLine].length - (sum + currentLine
                     - textArea.selectionStart);
        break;
      }
    }
    // if current line is zero
    if (currentLine + offsetY < 0) {
      textArea.selectionStart = 0;
      // if current line is last
    } else if (arrWithLines.length === currentLine + offsetY) {
      textArea.selectionStart = textArea.value.length + 1;
      // if lines length is equal
    } else if (arrWithLines[currentLine].length
             === arrWithLines[currentLine + offsetY].length) {
      textArea.selectionStart += (offsetY / Math.abs(offsetY))
            * (arrWithLines[currentLine].length + 1);
      // if current line is smaller then next
    } else if (arrWithLines[currentLine].length < arrWithLines[currentLine + offsetY].length) {
      if (offsetY < 0) {
        textArea.selectionStart += (offsetY / Math.abs(offsetY))
            * (arrWithLines[currentLine + offsetY].length + 1);
      } else {
        textArea.selectionStart += (offsetY / Math.abs(offsetY))
                * (arrWithLines[currentLine].length + 1);
      }
      // if current line is bigger then next
    } else if (arrWithLines[currentLine].length > arrWithLines[currentLine + offsetY].length) {
      if (positionInLine > arrWithLines[currentLine + offsetY].length && offsetY > 0) {
        textArea.selectionStart += (offsetY / Math.abs(offsetY))
            * (arrWithLines[currentLine].length + 1) - positionInLine
            + arrWithLines[currentLine + offsetY].length;
      } else if (offsetY > 0) {
        textArea.selectionStart += (offsetY / Math.abs(offsetY))
            * (arrWithLines[currentLine].length + 1);
      } else if (positionInLine <= arrWithLines[currentLine + offsetY].length) {
        textArea.selectionStart -= arrWithLines[currentLine + offsetY].length + 1;
      } else {
        textArea.selectionStart -= positionInLine + 1;
      }
    }
  }
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
  let inputText = '';
  switch (key) {
    case 'Space':
      inputText = ' ';
      break;
    case 'Tab':
      inputText = '    ';
      break;
    case 'Enter':
      inputText = '\n';
      break;
    case 'Backspace':
      deleteSymbolOfTextArea(textArea.selectionStart);
      break;
    case 'Delete':
      deleteSymbolOfTextArea(textArea.selectionStart + 1, 1);
      break;
    case 'ArrowLeft':
      changeCursorPosition(-1, 0);
      break;
    case 'ArrowRight':
      changeCursorPosition(1, 0);
      break;
    case 'ArrowUp':
      changeCursorPosition(0, -1);
      break;
    case 'ArrowDown':
      changeCursorPosition(0, 1);
      break;
    case 'ControlLeft':
    case 'ControlRight':
    case 'AltLeft':
    case 'AltRight':
      constrolsPressed(key);
      break;
    default:
      break;
  }
  changeTextOfTextArea(inputText);
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
