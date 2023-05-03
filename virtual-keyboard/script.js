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

function generateButtons() {
  for (let i = 0; i < KEYBOARD_LINES.length; i++) {
    rowsContainer.push(new BuildElements('div', keyBoardContainer, ['row']).getElement());
    for (let j = 0; j < KEYBOARD_LINES[i].length; j++) {
      const EN_DIV = new BuildElements('div', rowsContainer[i], [KEYBOARD_LINES[i][j], 'button']).getElement();
      EN_DIV.innerText = en[KEYBOARD_LINES[i][j]].shiftDown;
    }
  }
}

fetch('json/en.json').then((response) => response.json()).then((json) => {
  en = json;
  generateButtons();
});

alert('Здравствуйте, просьба по возможности проверить работу позже, за вторник - среду(до вечера) сделаю, спасибо за понимание!');
