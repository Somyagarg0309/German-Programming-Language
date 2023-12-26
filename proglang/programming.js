const ADD = "ADD";
const DIV = "DIV";
const SUB = "SUB";
const MUL = "MUL";
const PUSH = "PUSH";
const STOP = "STOP";
const LT = "LT";
const GT = "GT";
const EQ = "EQ";
const AND = "AND";
const OR = "OR";
const JUMP = "JUMP";
const JUMPI = "JUMPI";

class Machine {
  constructor() {
    this.state = {
      programCounter: 0,
      stack: [],
      code: [],
      executionCount: 0,
    };
  }

  jump() {
    const destination = this.state.stack.pop();
    if (destination < 0 || destination >= this.state.code.length) {
      throw new Error(`Invalid destination: ${destination}`);
    }
    this.state.programCounter = destination;
    this.state.programCounter--;
  }

  runInstructions(code) {
    this.state.code = code; //[PUSH,2,PUSH,3,ADD,STOP]
    while (this.state.programCounter < this.state.code.length) {
      console.log(this.state.programCounter, this.state.code.length);
      this.state.executionCount++;
      if (this.state.executionCount > 10000) {
        throw new Error("Infinite Loop Detected");
      }
      const opcode = this.state.code[this.state.programCounter];
      try {
        switch (opcode) {
          case STOP:
            throw new Error("Instruction Successful");
          case PUSH:
            this.state.programCounter++;
            if (this.state.programCounter === this.state.code.length) {
              throw new Error("This PUSH instruction is not valid");
            }
            const value = this.state.code[this.state.programCounter];
            this.state.stack.push(value);
            break;
          case ADD:
          case SUB:
          case DIV:
          case MUL:
          case LT:
          case GT:
          case EQ:
          case AND:
          case OR:
            const a = this.state.stack.pop();
            const b = this.state.stack.pop();
            let result;
            if (opcode === ADD) result = a + b;
            if (opcode === SUB) result = a - b;
            if (opcode === MUL) result = a * b;
            if (opcode === DIV) result = a / b;
            if (opcode === LT) result = a < b ? 1 : 0;
            if (opcode === GT) result = a > b ? 1 : 0;
            if (opcode === EQ) result = a === b ? 1 : 0;
            if (opcode === AND) result = a && b;
            if (opcode === OR) result = a || b;
            this.state.stack.push(result);
            break;
          case JUMP:
            this.jump();
            break;
          case JUMPI:
            const condition = this.state.stack.pop();
            if (condition === 1) {
              this.jump();
            }
            break;
          default:
            break;
        }
      } catch (e) {
        if (e.message === "Instruction Successful") {
          return this.state.stack[this.state.stack.length - 1];
        }
        throw e;
      }
      this.state.programCounter++;
    }
  }
}

// Examples
let code = [PUSH, 2, PUSH, 2, EQ, STOP];
let instruction = new Machine();
let result = instruction.runInstructions(code);
console.log(result);

//Other test cases...
