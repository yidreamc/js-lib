# 计算  

提供了`+-*/`运算和表达式运算

### 用法
```ts
import Calc from 'calc.ts'

let calc = new Calc();

// add
calc.add(0.1, 0.2);
calc.add(0.1, 0.2, 0.3, 0.4);

// sub
calc.sub(0.1, 0.2);
calc.sub(0.1, 0.2, 0.3, 0.4);

// mul
calc.mul(0.1, 0.2);
calc.mul(0.1, 0.2, 0.3, 0.4);

// div
calc.div(0.1, 0.2);
calc.div(0.1, 0.2, 0.3, 0.4);

// expression
calc.calc('((((4-3)*2-1+1.2)+1)+1)/0.2')
```