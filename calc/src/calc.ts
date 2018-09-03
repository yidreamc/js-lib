class Calc {

    /**
     * 计算表达式
     * @param expression 表达式
     */
    public calc(expression: string): number {
        try {
            const rpolish = this.toRPolish(expression.replace(/\s+/g, ''))
            const result = this.cacRPolish(rpolish);
            return result;
        } catch (e) {
            return NaN
        }
    }

    /**
     * 精确乘法
     * @param agr1 
     * @param arg2 
     * @param others 
     */
    public mul(arg1: number, arg2: number, ...others: number[]): number {
        if (others.length > 0) {
            return this.mul(this.mul(arg1, arg2), others[0], ...others.slice(1))
        }
        let str1 = this.toNonExponential(arg1), str2 = this.toNonExponential(arg2);
        let base = 0;
        try {
            base += str1.split('.')[1].length;
        } catch (e) {
            // 整数不处理
        }
        try {
            base += str2.split('.')[1].length;
        } catch (e) {
            // 整数不处理
        }
        return Number(str1.replace('.', '')) * Number(str2.replace('.', '')) / Math.pow(10, base);

    }
    /**
     * 精确加法
     * @param arg1 
     * @param arg2 
     * @param others 
     */
    public add(arg1: number, arg2: number, ...others: number[]): number {
        if (others.length > 0) {
            return this.add(this.add(arg1, arg2), others[0], ...others.slice(1))
        }
        let agr1ToNonExponential: string = this.toNonExponential(arg1);
        let agr2ToNonExponential: string = this.toNonExponential(arg2);
        let r1: number, r2: number;
        try {
            r1 = agr1ToNonExponential.split('.')[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = agr2ToNonExponential.split('.')[1].length;
        } catch (e) {
            r2 = 0;
        }
        let c = Math.abs(r1 - r2);
        let m = Math.pow(10, Math.max(r1, r2));
        if (c > 0) {
            if (r1 > r2) {
                arg1 = Number(agr1ToNonExponential.replace(".", ""));
                arg2 = Number(agr2ToNonExponential.replace(".", "")) * Math.pow(10, c);
            } else {
                arg1 = Number(agr1ToNonExponential.replace(".", "")) * Math.pow(10, c);
                arg2 = Number(agr2ToNonExponential.replace(".", ""));
            }
        } else {
            arg1 = Number(agr1ToNonExponential.replace(".", ""));
            arg2 = Number(agr2ToNonExponential.replace(".", ""));
        }
        return (arg1 + arg2) / m;
    }

    /**
     * 精确减法
     * @param arg1 
     * @param arg2 
     * @param others 
     */
    public sub(arg1: number, arg2: number, ...others: number[]): number {
        if (others.length > 0) {
            return this.sub(this.sub(arg1, arg2), others[0], ...others.slice(1))
        }
        let r1: number, r2: number;
        try {
            r1 = this.toNonExponential(arg1).split('.')[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = this.toNonExponential(arg2).split('.')[1].length;
        } catch (e) {
            r2 = 0;
        }
        let maxr: number = (r1 >= r2) ? r1 : r2;
        let m: number = Math.pow(10, maxr); //动态控制精度
        return Number(((arg1 * m - arg2 * m) / m).toFixed(maxr));
    }

    public div(arg1: number, arg2: number, ...others: number[]): number {
        if (others.length > 0) {
            return this.div(this.div(arg1, arg2), others[0], ...others.slice(1))
        }
        let agr1ToNonExponential: string = this.toNonExponential(arg1);
        let agr2ToNonExponential: string = this.toNonExponential(arg2);

        // 小数位
        let r1: number, r2: number;
        try {
            r1 = agr1ToNonExponential.split('.')[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = agr2ToNonExponential.split('.')[1].length;
        } catch (e) {
            r2 = 0;
        }
        // 变成整数
        let t1: number = Number(agr1ToNonExponential.replace(".", ""));
        let t2: number = Number(agr2ToNonExponential.replace(".", ""));
        return (t1 / t2) * Math.pow(10, r2 - r1);
    }

    /**
     * 科学计数法转换成数字字符串
     * @param num 
     */
    private toNonExponential(num: number): string {
        try {
            let m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
            // @ts-ignore
            return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
        } catch (e) {
            // 不是科学计数法
            return num.toString();
        }

    }

    /**
     * 计算后缀表达式值
     * @param rpolish 后缀表达式
     */
    private cacRPolish(rpolish: string[]): number {
        let operReg = /(\+|\-|\*|\/|\(|\))/
        let cacStack: number[] = [];
        for (let i = 0; i < rpolish.length; i++) {
            let current = rpolish[i];
            if (!operReg.test(current)) {
                // 数字
                cacStack.push(Number(current));
            } else {
                // 符号
                const cac1 = cacStack.pop();
                const cac2 = cacStack.pop();
                if (cac1 === undefined || cac2 === undefined) {
                    throw "illegal"
                }
                let tmpCacResult: number;
                switch (current) {
                    case '+':
                        tmpCacResult = this.add(cac2, cac1);
                        break;
                    case '-':
                        tmpCacResult = this.sub(cac2, cac1);
                        break;
                    case '*':
                        tmpCacResult = this.mul(cac2, cac1);
                        break;
                    case '/':
                        tmpCacResult = this.div(cac2, cac1);
                        break;
                    default:
                        throw "illegal";
                }
                cacStack.push(tmpCacResult)
            }
        }
        if (cacStack.length !== 1){
            throw "illegal";
        }
        return cacStack[0];
    }


    /**
     * 把输入串转换为后缀表达式
     * @param input 输入串
     */
    private toRPolish(input: string): any {
        let symbolReg = /(\+|\-|\*|\/|\(|\))/
        let inputArray: string[] = input.split(symbolReg);
        let result: string[] = [];
        let symbolStack: string[] = [];
        symbolStack.push('#')
        for (let i = 0; i < inputArray.length; i++) {
            let current: string = inputArray[i]; // 当前遍历的字符
            if (current && !symbolReg.test(current)) {
                // 数字: 直接输出
                result.push(current)
            } else if (current === '(') {
                // (: 压如符号栈
                symbolStack.push(current)
            } else if (current === ')') {
                // ): 弹出 ( 之后的所有符号
                while (symbolStack[symbolStack.length - 1] !== '(') {
                    const symbol = symbolStack.pop();
                    if (!symbol || symbol === '#') {
                        throw "illegal"
                    }
                    result.push(symbol);
                }
                // 丢弃 （
                symbolStack.pop();

            } else if (current === '+' || current === '-' || current === '*' || current === '/') {
                // + - * / 操作符

                // 当前操作符比栈顶优先级小就弹出栈顶的操作符
                while (this.isPriorityLow(current, symbolStack[symbolStack.length - 1])) {
                    result.push(symbolStack[symbolStack.length - 1]);
                    symbolStack.pop();
                }

                // 优先级大于 压栈顶
                symbolStack.push(current);
            } else if (current) {
                throw "illegal";
            }
        }

        // 把符号栈剩下的符号弹出
        while (symbolStack[symbolStack.length - 1] !== '#') {
            result.push(symbolStack[symbolStack.length - 1]);
            symbolStack.pop();
        }
        return result;
    }


    /**
     * 判断当前符号优先级是不是比栈顶优先级小
     * @param curSym current symbol
     * @param topSym stack top symbol
     */
    private isPriorityLow(curSym: string, topSym: string): boolean {
        if (curSym === '+' || curSym === '-') {
            if (topSym === '*' || topSym === '/' || topSym === '+' || topSym === '-') {
                return true;
            }
        }
        if (curSym === '*' || curSym === '/') {
            if (topSym === '*' || topSym === '/') {
                return true;
            }
        }
        return false;
    }
}
export default Calc;
