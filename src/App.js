import React from 'react';
import './App.css';

class App extends React.Component {
   constructor() {
      super();
      this.state = {
         display: '0'
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
            result = 'Ошибка в выражении!';
         }

         if (isNaN(result)) result = 'Ошибка в выражении!';

         this.setState({ display: this.calcStr + '=' + result });
      }
   }

   addToInput(value) {
      this.calcStr += value;
      this.calcStr = this.control(this.calcStr);
      this.setState({ display: this.calcStr });
   }

   clean() {
      this.calcStr = '0';
      this.setState({ display: this.calcStr });
      this.calcStr = '';
   }

   back() {
      this.calcStr = this.calcStr.substr(0, this.calcStr.length - 1);
      this.setState({ display: this.calcStr });
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
         <div className="container">
            <div className="container__cells">
               <div className="cell__display">{this.state.display}</div>

               <div className="cell__clear cell__active" onClick={() => { this.clean() }}>C</div>
               <div className="cell__back cell__active" onClick={() => { this.back() }}>&larr;</div>

               <div className="cell__math cell__active" onClick={() => { this.addToInput('(') }}>(</div>
               <div className="cell__math cell__active" onClick={() => { this.addToInput(')') }}>)</div>
               <div className="cell__math cell__passive"></div>
               <div className="cell__math cell__active" onClick={() => { this.addToInput('/') }}>&divide;</div>

               <div className="cell__num cell__active" onClick={() => { this.addToInput('7') }}>7</div>
               <div className="cell__num cell__active" onClick={() => { this.addToInput('8') }}>8</div>
               <div className="cell__num cell__active" onClick={() => { this.addToInput('9') }}>9</div>
               <div className="cell__math cell__active" onClick={() => { this.addToInput('*') }}>&times;</div>

               <div className="cell__num cell__active" onClick={() => { this.addToInput('4') }}>4</div>
               <div className="cell__num cell__active" onClick={() => { this.addToInput('5') }}>5</div>
               <div className="cell__num cell__active" onClick={() => { this.addToInput('6') }}>6</div>
               <div className="cell__math cell__active" onClick={() => { this.addToInput('-') }}>-</div>

               <div className="cell__num cell__active" onClick={() => { this.addToInput('1') }}>1</div>
               <div className="cell__num cell__active" onClick={() => { this.addToInput('2') }}>2</div>
               <div className="cell__num cell__active" onClick={() => { this.addToInput('3') }}>3</div>
               <div className="cell__math cell__active" onClick={() => { this.addToInput('+') }}>+</div>

               <div className="cell__num cell__passive"></div>
               <div className="cell__num cell__active" onClick={() => { this.addToInput('0') }}>0</div>
               <div className="cell__num cell__active" onClick={() => { this.addToInput('.') }}>.</div>
               <div className="cell__equal cell__active" onClick={() => { this.equal() }}>=</div>
            </div>
         </div>
      );
   }
}

export default App;