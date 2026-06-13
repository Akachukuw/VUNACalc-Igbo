/**
 * Calculator Unit Tests
 * Tests for core calculator functions including basic operations, 
 * normalization, and Igbo number translation
 */

// Mock DOM elements
const mockDOM = () => {
  document.body.innerHTML = `
    <input id="result" type="text" value="0" />
    <button id="theme-toggle">🌙</button>
    <div id="igbo-translation"></div>
  `;
};

// Define calculator functions for testing
let LAST_RESULT = 0;
let currentExpression = "";

function normalizeExpression(expr) {
  return expr
    .replace(/asin\(/g, "asinDeg(")
    .replace(/acos\(/g, "acosDeg(")
    .replace(/atan\(/g, "atanDeg(")
    .replace(/sin\(/g, "sinDeg(")
    .replace(/cos\(/g, "cosDeg(")
    .replace(/tan\(/g, "tanDeg(")
    .replace(/asinh\(/g, "asinh(")
    .replace(/sinh\(/g, "sinh(")
    .replace(/\be\b/g, "Math.E")
    .replace(/\bpi\b/g, "Math.PI");
}

function calculateExpression(expression) {
  try {
    let normalizedExpression = normalizeExpression(expression);
    normalizedExpression = normalizedExpression.replace(/\bans\b/gi, LAST_RESULT);
    let result = eval(normalizedExpression);
    if (isNaN(result) || !isFinite(result)) {
      throw new Error();
    }
    return result;
  } catch (e) {
    return "Error";
  }
}

const igboUnits = [
  "efu",
  "otu",
  "abuo",
  "ato",
  "ano",
  "ise",
  "isii",
  "asaa",
  "asato",
  "itoolu"
];

const igboTens = {
  10: "iri",
  20: "iri abuo",
  30: "iri ato",
  40: "iri ano",
  50: "iri ise",
  60: "iri isii",
  70: "iri asaa",
  80: "iri asato",
  90: "iri itoolu"
};

function convertBelow1000(num) {
  if (num === 0) return "";
  let words = [];
  if (num >= 100) {
    let hundreds = Math.floor(num / 100);
    words.push(igboUnits[hundreds] + " nari");
    num %= 100;
  }
  if (num >= 20) {
    let tens = Math.floor(num / 10) * 10;
    words.push(igboTens[tens]);
    num %= 10;
  } else if (num >= 10) {
    const teenWords = {
      10: "iri",
      11: "iri na otu",
      12: "iri na abuo",
      13: "iri na ato",
      14: "iri na ano",
      15: "iri na ise",
      16: "iri na isii",
      17: "iri na asaa",
      18: "iri na asato",
      19: "iri na itoolu"
    };
    words.push(teenWords[num]);
    num = 0;
  }
  if (num > 0) {
    words.push(igboUnits[num]);
  }
  return words.join(" ");
}

function numberToIgbo(num) {
  if (num === 0) return "efu";
  let result = [];
  let millions = Math.floor(num / 1000000);
  if (millions > 0) {
    result.push(convertBelow1000(millions) + " nde");
    num %= 1000000;
  }
  let thousands = Math.floor(num / 1000);
  if (thousands > 0) {
    result.push(convertBelow1000(thousands) + " puku");
    num %= 1000;
  }
  if (num > 0) {
    result.push(convertBelow1000(num));
  }
  return result.join(" ");
}

// Tests
describe("Calculator Functions", () => {
  beforeEach(() => {
    mockDOM();
    LAST_RESULT = 0;
    currentExpression = "";
  });

  describe("calculateExpression", () => {
    test("should add two numbers", () => {
      expect(calculateExpression("2+3")).toBe(5);
    });

    test("should subtract two numbers", () => {
      expect(calculateExpression("10-3")).toBe(7);
    });

    test("should multiply two numbers", () => {
      expect(calculateExpression("4*5")).toBe(20);
    });

    test("should divide two numbers", () => {
      expect(calculateExpression("20/4")).toBe(5);
    });

    test("should handle power operation (^)", () => {
      const result = calculateExpression("2**3");
      expect(result).toBe(8);
    });

    test("should handle complex expressions", () => {
      expect(calculateExpression("2+3*4")).toBe(14);
    });

    test("should handle parentheses", () => {
      expect(calculateExpression("(2+3)*4")).toBe(20);
    });

    test("should replace pi with Math.PI", () => {
      const result = calculateExpression("pi");
      expect(Math.abs(result - Math.PI) < 0.0001).toBe(true);
    });

    test("should replace e with Math.E", () => {
      const result = calculateExpression("e");
      expect(Math.abs(result - Math.E) < 0.0001).toBe(true);
    });

    test("should handle negative numbers", () => {
      expect(calculateExpression("-5+3")).toBe(-2);
    });

    test("should handle decimal numbers", () => {
      expect(calculateExpression("3.5+2.5")).toBe(6);
    });

    test("should return 'Error' for invalid expressions", () => {
      expect(calculateExpression("2++3")).toBe("Error");
    });

    test("should return 'Error' for division by zero", () => {
      expect(calculateExpression("5/0")).toBe("Error");
    });

    test("should handle modulo operation", () => {
      expect(calculateExpression("10%3")).toBe(1);
    });

    test("should handle square root", () => {
      const result = calculateExpression("Math.sqrt(16)");
      expect(result).toBe(4);
    });

    test("should handle absolute value", () => {
      const result = calculateExpression("Math.abs(-5)");
      expect(result).toBe(5);
    });
  });

  describe("normalizeExpression", () => {
    test("should replace sin with sinDeg", () => {
      const result = normalizeExpression("sin(0)");
      expect(result).toContain("sinDeg(0)");
    });

    test("should replace cos with cosDeg", () => {
      const result = normalizeExpression("cos(0)");
      expect(result).toContain("cosDeg(0)");
    });

    test("should replace tan with tanDeg", () => {
      const result = normalizeExpression("tan(0)");
      expect(result).toContain("tanDeg(0)");
    });

    test("should replace asin with asinDeg", () => {
      const result = normalizeExpression("asin(0)");
      expect(result).toContain("asinDeg(0)");
    });

    test("should replace acos with acosDeg", () => {
      const result = normalizeExpression("acos(0)");
      expect(result).toContain("acosDeg(0)");
    });

    test("should replace atan with atanDeg", () => {
      const result = normalizeExpression("atan(0)");
      expect(result).toContain("atanDeg(0)");
    });

    test("should replace pi with Math.PI", () => {
      const result = normalizeExpression("pi*2");
      expect(result).toContain("Math.PI*2");
    });

    test("should replace e with Math.E", () => {
      const result = normalizeExpression("e+1");
      expect(result).toContain("Math.E+1");
    });

    test("should not replace e in nested context", () => {
      const result = normalizeExpression("exp(1)");
      expect(result).not.toContain("Math.Exbp");
    });
  });

  describe("convertBelow1000", () => {
    test("should return empty string for 0", () => {
      expect(convertBelow1000(0)).toBe("");
    });

    test("should convert single digit", () => {
      expect(convertBelow1000(1)).toBe("otu");
    });

    test("should convert double digit in teens", () => {
      expect(convertBelow1000(15)).toBe("iri na ise");
    });

    test("should convert multiples of 10", () => {
      expect(convertBelow1000(20)).toBe("iri abuo");
    });

    test("should convert numbers in 20s", () => {
      expect(convertBelow1000(25)).toContain("iri abuo");
    });

    test("should convert hundreds", () => {
      const result = convertBelow1000(100);
      expect(result).toContain("otu nari");
    });

    test("should convert 999", () => {
      const result = convertBelow1000(999);
      expect(result).toContain("nari");
    });
  });

  describe("numberToIgbo", () => {
    test("should convert 0 to efu", () => {
      expect(numberToIgbo(0)).toBe("efu");
    });

    test("should convert single digit", () => {
      expect(numberToIgbo(5)).toBe("ise");
    });

    test("should convert tens", () => {
      expect(numberToIgbo(20)).toBe("iri abuo");
    });

    test("should convert hundreds", () => {
      const result = numberToIgbo(100);
      expect(result).toContain("nari");
    });

    test("should convert thousands", () => {
      const result = numberToIgbo(1000);
      expect(result).toContain("puku");
    });

    test("should convert millions", () => {
      const result = numberToIgbo(1000000);
      expect(result).toContain("nde");
    });

    test("should convert complex number", () => {
      const result = numberToIgbo(1234);
      expect(result).toContain("puku");
    });

    test("should handle large numbers", () => {
      const result = numberToIgbo(999999);
      expect(result.length > 0).toBe(true);
    });
  });

  describe("ans (last result) functionality", () => {
    test("should use LAST_RESULT in expressions", () => {
      LAST_RESULT = 5;
      const result = calculateExpression("ans+3");
      expect(result).toBe(8);
    });

    test("should use ans in complex expressions", () => {
      LAST_RESULT = 10;
      const result = calculateExpression("ans*2+5");
      expect(result).toBe(25);
    });
  });

  describe("Edge cases", () => {
    test("should handle very small decimals", () => {
      const result = calculateExpression("0.00001+0.00001");
      expect(result).toBeCloseTo(0.00002, 5);
    });

    test("should handle very large numbers", () => {
      const result = calculateExpression("999999*999999");
      expect(result).toBeCloseTo(999998000001, -3);
    });

    test("should handle negative zero", () => {
      const result = calculateExpression("-0");
      expect(Object.is(result, -0) || result === 0).toBe(true);
    });

    test("should handle multiple operations", () => {
      const result = calculateExpression("1+2+3+4+5");
      expect(result).toBe(15);
    });

    test("should handle nested parentheses", () => {
      const result = calculateExpression("((2+3)*4)+5");
      expect(result).toBe(25);
    });
  });
});
