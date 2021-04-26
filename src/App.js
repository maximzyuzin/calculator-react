import React from 'react';
import './App.css';

class App extends React.Component {
   constructor() {
      super();
      this.state = {
         valueImput: ''
      }
      this.calcStr = '';
   }

   calculation(bufferStr) {
      // Добавляем пробелы вокруг математических операций и скобок
      bufferStr = bufferStr = bufferStr.replace(/([^[0-9.]{1})/g, ' $1 ').trim();
      // Удаляем сдвоенные пробелы
      bufferStr = bufferStr.replace(/ {1,}/g, ' ');
      // Добавляем все элементы строки в массив
      const bufferArr = bufferStr.split(/\s/);
   
      // Формируем обратную польскую запись:
      // 1+(2+5)*10 => 1,2,5,+,10,*,+
      let polishString = [];
      let polishStack = [];
      let stringId = -1;
      let stackId = -1;
   
      for (let i = 0; i < bufferArr.length; i++) {
         switch (bufferArr[i]) {
            case '+':
               while (stackId >= 0 && (polishStack[stackId] === '+'
                  || polishStack[stackId] === '-'
                  || polishStack[stackId] === '*'
                  || polishStack[stackId] === '/')) {
                  stringId++;
                  polishString[stringId] = polishStack[stackId];
                  stackId--;
               }
               stackId++;
               polishStack[stackId] = bufferArr[i];
               break;
            case '-':
               while (stackId >= 0 && (polishStack[stackId] === '+'
                  || polishStack[stackId] === '-'
                  || polishStack[stackId] === '*'
                  || polishStack[stackId] === '/')) {
                  stringId++;
                  polishString[stringId] = polishStack[stackId];
                  stackId--;
               }
               stackId++;
               polishStack[stackId] = bufferArr[i];
               break;
            case '*':
               while (stackId >= 0 && (polishStack[stackId] === '*' || polishStack[stackId] === '/')) {
                  stringId++;
                  polishString[stringId] = polishStack[stackId];
                  stackId--;
               }
               stackId++;
               polishStack[stackId] = bufferArr[i];
               break;
            case '/':
               while (stackId >= 0 && (polishStack[stackId] === '*' || polishStack[stackId] === '/')) {
                  stringId++;
                  polishString[stringId] = polishStack[stackId];
                  stackId--;
               }
               stackId++;
               polishStack[stackId] = bufferArr[i];
               break;
            case '(':
               stackId++;
               polishStack[stackId] = bufferArr[i];
               break;
            case ')':
               while (stackId >= 0 && polishStack[stackId] !== '(') {
                  stringId++;
                  polishString[stringId] = polishStack[stackId];
                  stackId--;
               }
               stackId--;
               break;
            default:
               stringId++;
               polishString[stringId] = bufferArr[i];
         }
      }
   
      while (stackId >= 0) {
         stringId++;
         polishString[stringId] = polishStack[stackId];
         stackId--;
      }
   
      // Производим вычисления по обратной польской записи
      stackId = -1;
      let stringIdMax = stringId;
   
      for (stringId = 0; stringId <= stringIdMax; stringId++) {
         switch (polishString[stringId]) {
            case '+':
               stackId--;
               polishStack[stackId] = polishStack[stackId] + polishStack[stackId + 1];
               break;
            case '-':
               stackId--;
               polishStack[stackId] = polishStack[stackId] - polishStack[stackId + 1];
               break;
            case '*':
               stackId--;
               polishStack[stackId] = polishStack[stackId] * polishStack[stackId + 1];
               break;
            case '/':
               stackId--;
               polishStack[stackId] = polishStack[stackId] / polishStack[stackId + 1];
               break;
            default:
               stackId++;
               polishStack[stackId] = parseFloat(polishString[stringId]);
         }
      }
      return polishStack[stackId];
   }

   equal() {
      if (this.calcStr) {
         let result = '';
         try {
            result = this.calculation(this.calcStr);
         } catch (error) {
            result = 'Ошибка в выражении';
         }
         this.setState({ valueImput: this.calcStr + '=' + result });
      }
   }

   addToInput(value) {
      this.calcStr += value;
      this.calcStr = this.control(this.calcStr);
      this.setState({ valueImput: this.calcStr });
   }

   clean() {
      this.calcStr = '';
      this.setState({ valueImput: this.calcStr });
   }

   back() {
      this.calcStr = this.calcStr.substr(0, this.calcStr.length - 1);
      this.setState({ valueImput: this.calcStr });
   }

   control(checkStr) {
      checkStr = checkStr.replace(/\++/g, '+');
      checkStr = checkStr.replace(/\\--/g, '+');
      checkStr = checkStr.replace(/\.\./g, '.');
      checkStr = checkStr.replace(/[+-][-+]/g, '-');
      return checkStr;
   }

   render() {
      return (
         <div className="calculator">
            <div className="active_item input">
               <input type="text" name="textview" placeholder=" 0 " value={this.state.valueImput} readOnly />
            </div>

            <div className="active_item clear" onClick={() => { this.clean() }}>C</div>
            <div className="active_item back" onClick={() => { this.back() }}>&larr;</div>

            <div className="active_item math" onClick={() => { this.addToInput('(') }}>(</div>
            <div className="active_item math" onClick={() => { this.addToInput(')') }}>)</div>
            <div className="passive_item math"></div>
            <div className="active_item math" onClick={() => { this.addToInput('/') }}>&divide;</div>

            <div className="active_item num" onClick={() => { this.addToInput('7') }}>7</div>
            <div className="active_item num" onClick={() => { this.addToInput('8') }}>8</div>
            <div className="active_item num" onClick={() => { this.addToInput('9') }}>9</div>
            <div className="active_item math" onClick={() => { this.addToInput('*') }}>&times;</div>

            <div className="active_item num" onClick={() => { this.addToInput('4') }}>4</div>
            <div className="active_item num" onClick={() => { this.addToInput('5') }}>5</div>
            <div className="active_item num" onClick={() => { this.addToInput('6') }}>6</div>
            <div className="active_item math" onClick={() => { this.addToInput('-') }}>-</div>

            <div className="active_item num" onClick={() => { this.addToInput('1') }}>1</div>
            <div className="active_item num" onClick={() => { this.addToInput('2') }}>2</div>
            <div className="active_item num" onClick={() => { this.addToInput('3') }}>3</div>
            <div className="active_item math" onClick={() => { this.addToInput('+') }}>+</div>

            <div className="passive_item num"></div>
            <div className="active_item num" onClick={() => { this.addToInput('0') }}>0</div>
            <div className="active_item num" onClick={() => { this.addToInput('.') }}>.</div>
            <div className="active_item equal" onClick={() => { this.equal() }}>=</div>
         </div>
      );
   }
}

export default App;