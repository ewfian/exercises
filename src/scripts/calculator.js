var Calculator = (function () {

    var Calculator = function (_expression) {
        this._expression = _expression || null;
    };

    Calculator.prototype.calculate = function () {
        var operands = [];
        var operators = [];

        parse(this._expression).forEach(sym => {
            if ('+-*/()'.split('').indexOf(sym) > -1) {
                if (operators.length === 0 || sym === '(') {
                    operators.push(sym);
                } else {
                    while (operators.length > 0) {
                        var top = operators[operators.length - 1];
                        var priority = comparePriority(sym, top);
                        if (sym === ')' && top === '(') {
                            operators.pop();
                            break;
                        } else if (!priority && top !== '(') {
                            operands.push(compute(operators.pop(), operands.pop(), operands.pop()));
                        } else {
                            break;
                        }
                    }
                    if (sym !== ')') {
                        operators.push(sym);
                    }
                }
            } else {
                operands.push(parseFloat(sym));
            }
        });

        while (operators.length > 0) {
            operands.push(compute(operators.pop(), operands.pop(), operands.pop()));
        }
        return operands[0] || null;
    };

    Calculator.prototype.verify = function () {
        var r = this.calculate();
        var e = eval(this._expression);
        return `Correct: ${r === e}, Result: ${r}, Eval: ${e}`;
    };

    var operatorPriority = {
        ')': 0,
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '(': 3
    };

    var parse = function (_expression) {
        return [].concat(..._expression.trim()
            .match(/[-\d.]+|[(|)]|[^\d()]/g)
            .map(i => {
                if (i.match(/\d-/g)) {
                    return i.split('');
                }
                return i.trim();
            })
            .filter(i => i));
    };

    var comparePriority = function (op1, op2) {
        return operatorPriority[op1] > operatorPriority[op2];
    };

    var compute = function (op, num1, num0) {
        switch (op) {
            case '+':
                return num0 + num1;
            case '-':
                return num0 - num1;
            case '*':
                return num0 * num1;
            case '/':
                return num0 / num1;
        }
    };

    return Calculator;
})();

var cal = new Calculator('1+2+3+4+5+6+7+8+9+10');
console.log(cal.verify());

cal._expression = '1+2*3-4/5';
console.log(cal.verify());

cal._expression = '1+(2-3)*5';
console.log(cal.verify());

cal._expression = '1+((2-3))/5';
console.log(cal.verify());

cal._expression = '(((1+((2-3))/5)))';
console.log(cal.verify());

cal._expression = '(1+2)*(3-4)+2.125';
console.log(cal.verify());

cal._expression = ' -2 + (-3.55) -(-1.256*(-2.5) * 233/ 3 * (-6 - 2)*5-(-6)-(-2.6)+1*2.333*(-2)) ';
console.log(cal.verify());
