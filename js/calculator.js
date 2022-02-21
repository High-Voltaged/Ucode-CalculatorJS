export default class Calc {

    static multiplyOrDivide = /(\-*\d*\.?\d*)\s{1}([*/]+)\s{1}(\-*\d*\.?\d*)/;
    static addOrSubtract = /(\-*\d*\.?\d*)\s{1}([+-]+)\s{1}(\-*\d*\.?\d*)/;
    static toggleNum = /(\-*\d*\.?\d*)\s{1}(\+\/\-)\s{1}/;
    static percent = /(\-*\d*\.?\d*)\s{1}([%]+)\s{1}/;

    static ERROR_STR = "ERROR";
    static operations = {
        "-": function(first, second)    { return Calc.subtract(first, second) },
        "+": function(first, second)    { return Calc.add(first, second) },
        "/": function(first, second)    { return Calc.divide(first, second) },
        "*": function(first, second)    { return Calc.multiply(first, second) },
        "%": function(num)              { return Calc.toPercent(num) },
        "sign": function(num)           { return Calc.toggleSignFor(num) }
    };

    constructor () {
        
        this.display = document.querySelector(".calc__screen");
        this.displayText = this.display.getAttribute("value");
        this.history = [];
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

    static divide(first, second)    { return parseFloat((first / second).toFixed(10)); }

    static add(first, second)       { return parseFloat((first + second).toFixed(10)); }

    static subtract(first, second)  { return parseFloat((first - second).toFixed(10)); }

    static toPercent(num)           { return parseFloat(num / 100).toFixed(2); }
    
    static toggleSignFor(num)       { return num * -1; }

    parseInput(target) {

        let classList = target.classList;

        if (classList.contains("clear")) {
            this.output([]);
            console.log("here");
        }
        
        if (classList.contains("num")) {
            console.log("here");
            this.insertValue(target.textContent);
        }
        
        if (classList.contains("point") && Calc.getLastNum(this.displayText).indexOf(".") === -1) {
            console.log("here");
            this.insertValue(target.textContent);
        }
        
        if ((Calc.getLastNum(this.displayText).length === 0 ||
            Calc.getLastNum(this.displayText) === "." ||
            this.displayText == Calc.ERROR_STR) && classList.contains("result")) {
            
                this.output(Calc.ERROR_STR);
                console.log("here");
        }
        
        if (Calc.getLastNum(this.displayText).length !== 0 && Calc.getLastNum(this.displayText) !== "." && 
            classList.contains("operator")) {
            
                // if (Calc.getLastNum(this.displayText)[0] !== "-" && target.classList.contains("sign"))
                //     this.insertOperator("sign")

                this.insertOperator(target.textContent);
                console.log("here");
        }
        
        if (classList.contains("result")) {
            console.log("here");
            this.evalExpression(this.displayText);
        }

    }

    evalExpression(output) {

        let solveExpression = (expr, output) => {

            const matches = expr.exec(output);
            console.log("matches " + matches);
            const first = parseFloat(matches[1]);
            const operator = matches[2];
            const second = matches[3] ? parseFloat(matches[3]) : null;
        
            let reduced = null;
            // if (/\+\/\-/.test(operator)) {
        
            //     reduced = output.replace(expr, operations["sign"](first));
        
            // }
            reduced = output.replace(expr, Calc.operations[operator](first, second));
            this.evalExpression(reduced);

        }

        console.log(output);
        if (!/[%+\/*-]|[\+\/\-]{1}\s/.test(output)) {
            this.outputAnswer([...this.displayText, " = ", output]);
            return;
        }


        let regex = (/[*/]\s/.test(output)) ? Calc.multiplyOrDivide :
                    (/[+-]\s/.test(output)) ? Calc.addOrSubtract :
                     Calc.percent;

        solveExpression(regex, output);

    }

    insertValue(value) {

        let isAnswer = this.display.classList.contains("answer");
        let arrToOutput = isAnswer || this.displayText === Calc.ERROR_STR ?
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

    addToHistory(arr) {

        if (this.history.length === 3) {
            
            this.history.shift();
            this.history.push(arr);

        } else {

            this.history.push(arr);

        }
    }

    clearHistory() {

        let historyContainer = document.querySelector(".calc__history");

        while(historyContainer.firstChild){
            historyContainer.lastChild.remove();
        }

    }

    outputHistory() {
        
        let historyContainer = document.querySelector(".calc__history");

        this.clearHistory();

        for (let i = 0; i < this.history.length; i++) {

            let historyItem = document.createElement("div");
            historyItem.classList.add("history__item");

            let historyItemText = this.history[i].join("");

            if (i === this.history.length - 1) {

                historyItem.textContent = historyItemText.slice(0, historyItemText.indexOf("=") + 1);
                
            } else {

                historyItem.textContent = historyItemText;

            }

            historyContainer.appendChild(historyItem);

        }
    }

    outputAnswer(answerArr) {

        this.addToHistory(answerArr);
        this.outputHistory();

        this.output([answerArr[answerArr.length - 1]]);
        this.display.classList.add("answer");

    }

    output(strarr) {
        
        let resultStr = strarr.join("");
        this.display.setAttribute("value", resultStr);
        this.displayText = resultStr;
        this.display.scrollLeft = this.display.scrollWidth;

    }

}
