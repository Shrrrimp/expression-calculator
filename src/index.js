function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
//состовляем обратную польскую запись
    let pNotation=[];
    let count = true; //переменная, для поиска границ числа
    let stack=[];
    for(let i = 0; i<expr.length; ++i){
        switch(expr[i]){
            case "+": 
                toDo(({symbol: "+", priority: 1}), stack, pNotation);
                break;
            case "-": 
                toDo(({symbol: "-", priority: 1}), stack, pNotation);
                break;
            case "*": 
                toDo(({symbol: "*", priority: 2}), stack, pNotation);
                break;
            case "/": 
                toDo(({symbol: "/", priority: 2}), stack, pNotation);
                break;
            case "(": 
                toDo(({symbol: "(", priority: 0}), stack, pNotation);
                break;
            case ")": 
                toDo(({symbol: ")", priority: 0}), stack, pNotation);
                break;
            case " ": 
                break;
            default:
                if(count){
                    pNotation.push(expr[i]);
                    count = false;
                }
                else
                    pNotation[pNotation.length-1]+=expr[i];
        }
    }

    //если в стеке еще что-то осталось
    while(stack.length){
        if(stack[stack.length-1].symbol == "(")
            throw new Error("ExpressionError: Brackets must be paired");
        pNotation.push(stack.pop().symbol);
    }

    function toDo(obj){
        count = true;
        if(stack.length==0){
            stack.push(obj);
            return;
        }
        if(obj.symbol == ")"){
            let i = stack.length-1;
            while(stack[i].symbol != "("){
                pNotation.push(stack[i].symbol);
                stack.pop();
                --i;
                if(i<0)
                    throw new Error("ExpressionError: Brackets must be paired");
            }
            stack.pop();
            return;
        }

        if(obj.symbol == "("){
            stack.push(obj);
            return;
        }
        while(stack.length>0 && stack[stack.length-1].priority >= obj.priority) {
            pNotation.push(stack[stack.length-1].symbol);
            stack.pop();
        }
        stack.push(obj);
    }

//считаем результат выражения
    let res=0;
    let stack2=[];
    for(let i=0; i<pNotation.length; ++i){
        switch(pNotation[i]){
            case "+": 
                operation("+");
                break;
            case "-": 
                operation("-");
                break;
            case "*": 
                operation("*");
                break;
            case "/": 
                operation("/");
                break;
            default: stack2.push(pNotation[i]);
        }
    }

    function operation(char) {
        if (stack2.length>=2){
            //+, чтобы явно преобразовать в число
            b=+stack2.pop();
            a=+stack2.pop();

            switch(char){
                case "+": 
                    res=a+b;
                    break;
                case "-": 
                    res=a-b;
                    break;
                case "*": 
                    res=a*b;
                    break;
                case "/": 
                    if(b==0)
                        throw new Error("TypeError: Division by zero.");
                    res=a/b;
                    break;
            }
            stack2.push(res);
        }
    }

    return res;
}

module.exports = {
    expressionCalculator
}