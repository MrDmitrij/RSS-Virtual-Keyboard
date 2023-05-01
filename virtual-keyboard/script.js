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
