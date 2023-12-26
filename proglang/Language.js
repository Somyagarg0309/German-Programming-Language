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

class Maschine {
  constructor() {
    this.zustand = {
      programmZaehler: 0,
      stapel: [],
      code: [],
      ausfuehrungsZaehler: 0,
    };
  }

  springen() {
    const ziel = this.zustand.stapel.pop();
    if (ziel < 0 || ziel >= this.zustand.code.length) {
        throw new Error(`Ungültiges ziel: ${zeil}`);
    }
    this.zustand.programmZaehler = ziel;
    this.zustand.programmZaehler--;
  }

  anweisungenAusfuehren(code) {
    this.zustand.code = code;
    while (this.zustand.programmZaehler < this.zustand.code.length) {
      this.zustand.ausfuehrungsZaehler++;
      if (this.zustand.ausfuehrungsZaehler > 10000) {
        throw new Error("Unendliche Schleife erkannt");
      }
      const opcode = this.zustand.code[this.zustand.programmZaehler];
      try {
        switch (opcode) {
          case STOP:
            throw new Error("Anweisung erfolgreich");
          case PUSH:
            this.zustand.programmZaehler++;
            if (this.zustand.programmZaehler === this.zustand.code.length) {
              throw new Error("Diese PUSH-Anweisung ist ungültig");
            }
            const wert = this.zustand.code[this.zustand.programmZaehler];
            this.zustand.stapel.push(wert);
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
            const a = this.zustand.stapel.pop();
            const b = this.zustand.stapel.pop();
            let ergebnis;
            if (opcode === ADD) ergebnis = a + b;
            if (opcode === SUB) ergebnis = a - b;
            if (opcode === MUL) ergebnis = a * b;
            if (opcode === DIV) ergebnis = a / b;
            if (opcode === LT) ergebnis = a < b ? 1 : 0;
            if (opcode === GT) ergebnis = a > b ? 1 : 0;
            if (opcode === EQ) ergebnis = a === b ? 1 : 0;
            if (opcode === AND) ergebnis = a && b;
            if (opcode === OR) ergebnis = a || b;
            this.zustand.stapel.push(ergebnis);
            break;
          case JUMP:
            this.springen();
            break;
          case JUMPI:
            const bedingung = this.zustand.stapel.pop();
            if (bedingung === 1) {
              this.springen();
            }
            break;
          default:
            break;
        }
      } catch (e) {
        if (e.message === "Anweisung erfolgreich") {
          return this.zustand.stapel[this.zustand.stapel.length - 1];
        }
        throw e;
      }
      this.zustand.programmZaehler++;
    }
  }
}
console.log("Beispiel");
let code = [PUSH, 3, PUSH, 2, ADD, STOP];
let maschine = new Maschine();
let ergebnis = maschine.anweisungenAusfuehren(code);
console.log(ergebnis);
console.log("Weitere Testfälle");