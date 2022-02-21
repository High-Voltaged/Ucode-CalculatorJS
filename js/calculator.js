export default class Calc {

    static multiplyOrDivide = /(\-*\d*\.?\d*)\s{1}([*/]+)\s{1}(\-*\d*\.?\d*)/;
    static addOrSubtract = /(\-*\d*\.?\d*)\s{1}([+-]+)\s{1}(\-*\d*\.?\d*)/;
    static ERROR_STR = "ERROR";
    static operations = {
        "-": function(first, second)    { return subtract(first, second) },
        "+": function(first, second)    { return add(first, second) },
        "/": function(first, second)    { return divide(first, second) },
        "*": function(first, second)    { return multiply(first, second) },
        "%": function(num)              { return toPercent(num) },
        "sign": function(num)           { return toggleSignFor(num) }
    };

    constructor () {
        
        this.display = document.querySelector(".calc__screen");
        this.displayText = this.display.textContent;
        // this.resultBtn = document.querySelector(".result-btn");
        
        const btns = document.querySelectorAll(".btn");
        btns.forEach(btn => {
            btn.addEventListener("click", (event) => this.parseInput(event.target));
        });

    }

    static getDecimalsNum(value) {

        if (Math.floor(value) === value)
            return 0;

        return value.toString().split(".")[1].length || 0;
        
    }

    static getLastNum(sequence) {

        let seqarr = sequence.split(" ");
        return seqarr[seqarr.length - 1];

    }
    
    static multiply(first, second) {

        let result = first * second;
        let decimalDigitCount = Calc.getDecimalsNum(first) + Calc.getDecimalsNum(second);
        return parseFloat(result.toFixed(decimalDigitCount));

    }

    static divide(first, second)    { return first / second }

    static add(first, second)       { return first + second }

    static subtract(first, second)  { return first - second }

    static toPercent(num)           { return parseFloat(num / 100).toFixed(2); }
    
    static toggleSignFor(num)       { return num * -1; }

    parseInput(target) {

        let classList = target.classList;

        if (classList.contains("clear")) {
            this.output([]);
        }

        if (classList.contains("num")) {
            this.insertValue(target.textContent);
        }

        if (classList.contains("point") && getLastNum(this.displayText)) {
            this.insertValue(target.textContent);
        }
        
        if ((getLastNum(this.displayText).length === 0 ||
            getLastNum(this.displayText) === "." ||
            this.displayText == ERROR_STR) && classList.contains("result")) {
                this.output(ERROR_STR);
        }

        if (getLastNum(this.displayText).length !== 0 && getLastNum(this.displayText) !== "." && 
            classList.contains("operator")) {
                this.insertOperator(target.textContent);
        }
        
        if (classList.contains("result")) {
            return this.evalExpression(this.displayText);
        }

    }

    evalExpression(output) {

        

    }

    insertValue(value) {

        let isAnswer = this.display.classList.contains("answer");
        let arrToOutput = isAnswer || this.displayText === ERROR_STR ?
            [value] : [...this.displayText, value];

        if (isAnswer) {
            this.display.classList.remove("answer");
        }
        this.output(arrToOutput);

    }

    insertOperator(operator) {

        let operatorStr = ` ${operator} `;
        let arrToOutput = [...this.displayText, operatorStr];
        if (this.display.classList.contains("answer")) {
            this.display.classList.remove("answer");
        }
        this.output(arrToOutput);

    }

    output(strarr) {

        this.display.textContent = strarr.join("");

    }

}
