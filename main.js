// -------------------------------------------------------------------------- //
// Nodes
// -------------------------------------------------------------------------- //

const main   = document.querySelector('main');
const screen = document.querySelector('.screen');


// -------------------------------------------------------------------------- //
// Event Listeners
// -------------------------------------------------------------------------- //

main.addEventListener('click', (e) => {
  switch (e.target.textContent) {
    case '9':
    case '8':
    case '7':
    case '6':
    case '5':
    case '4':
    case '3':
    case '2':
    case '1':
    case '0':
    case '+':
    case '-':
    case '*':
    case '/': screen.textContent = updateScreen(e.target.textContent); break;
    case '=': screen.textContent = convertRPN(screen.textContent); break;
    case 'C': screen.textContent = ''; break;
  }
})

// -------------------------------------------------------------------------- //
// Function Definitions
// -------------------------------------------------------------------------- //

String.prototype.isNumeric = function() {
  return !isNaN(parseFloat(this)) && isFinite(this);
}

Array.prototype.peek = function() {
  if (this.length === 0) {
    return undefined;
  }
  return this[this.length - 1];
}

function updateScreen(str) {
  if('+-*/'.includes(str) && '+-*/'.includes(screen.textContent.slice(-1))) {
    return screen.textContent.slice(0,-1).concat(str);
  }
  return screen.textContent.concat(str);
}

function convertRPN(str) {

  const stack = [];
  const queue = [];
  const operators = {
    '*': 3,
    '/': 3,
    '+': 2,
    '-': 2,
  }

  str = str.split(/([\+\-\*\/\^\(\)])/);

  // Infix to Postfix
  for (let i = 0; i < str.length; i += 1) {
    let token = str[i];

    // If the Token is a number: Push it into the Queue
    if (token.isNumeric()) {
      queue.push(Number(token));
    }

    // If the Token is a operators:
    // - Pop operators with the same or higher precedence and push them in to the Queue
    // - Push the operator into the Stack
    if (token in operators) {
      while(stack.peek() && operators[stack.peek()] >= operators[token]) {
        stack2queue(stack.pop(), queue);
      }
      stack.push(token);
    }
  }

  // Do the thing with the Operator Stack
  while (stack.length) {
    stack2queue(stack.pop(),queue)
  }

  return queue[0];
}

// Action to perform whenever we pop an operator
// from the stack and push it into the queue
function stack2queue(op, queue) {
  let vR = queue.pop();
  let vL = queue.pop();

  if (vL === undefined || vR === undefined) {
    throw 'Incorrect Expression'
  }

  switch (op) {
    case '+': queue.push(vL + vR); break;
    case '-': queue.push(vL - vR); break;
    case '*': queue.push(vL * vR); break;
    case '/': queue.push(vL / vR); break;
  }
}

// -------------------------------------------------------------------------- //
