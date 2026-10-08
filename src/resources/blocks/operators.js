import javascriptGenerator from "../javascriptGenerator";
import registerBlock from "../register";

const categoryColor = "#59C059";

function registerBinary(id, label, output, check, expression) {
    registerBlock(`operators_${id}`, {
        message0: label,
        args0: [
            { type: "input_value", name: "X", ...(check ? { check } : {}) },
            { type: "input_value", name: "Y", ...(check ? { check } : {}) },
        ],
        output,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const left = javascriptGenerator.valueToCode(
            block,
            "X",
            javascriptGenerator.ORDER_ATOMIC
        ) || (check === "Boolean" ? "false" : check === "String" ? '""' : "0");
        const right = javascriptGenerator.valueToCode(
            block,
            "Y",
            javascriptGenerator.ORDER_ATOMIC
        ) || (check === "Boolean" ? "false" : check === "String" ? '""' : "0");
        return [expression(left, right), javascriptGenerator.ORDER_ATOMIC];
    });
}

function register() {
    registerBinary("equals", "%1 = %2", "Boolean", null, (x, y) => `(${x} == ${y})`);
    registerBinary("strictequals", "%1 === %2", "Boolean", null, (x, y) => `(${x} === ${y})`);
    registerBinary("more", "%1 > %2", "Boolean", "Number", (x, y) => `(${x} > ${y})`);
    registerBinary("less", "%1 < %2", "Boolean", "Number", (x, y) => `(${x} < ${y})`);
    registerBinary("and", "%1 and %2", "Boolean", "Boolean", (x, y) => `(${x} && ${y})`);
    registerBinary("or", "%1 or %2", "Boolean", "Boolean", (x, y) => `(${x} || ${y})`);
    registerBinary("add", "%1 + %2", "Number", "Number", (x, y) => `(${x} + ${y})`);
    registerBinary("minus", "%1 - %2", "Number", "Number", (x, y) => `(${x} - ${y})`);
    registerBinary("multiply", "%1 * %2", "Number", "Number", (x, y) => `(${x} * ${y})`);
    registerBinary("divide", "%1 ÷ %2", "Number", "Number", (x, y) => `(${x} / (${y} || 1))`);
    registerBinary("power", "%1 ^ %2", "Number", "Number", (x, y) => `(${x} ** ${y})`);
    registerBinary("log", "%1 log %2", "Number", "Number", (x, y) => `(Math.log(${y}) / Math.log(${x}))`);
    registerBinary("root", "%1 root %2", "Number", "Number", (x, y) => `(${x} ** (1 / ${y}))`);
    registerBinary("join", "join %1 %2", "String", "String", (x, y) => `(${x} + ${y})`);
    registerBinary("letter", "letter %1 of %2", "String", null, (x, y) => `String(${y}).charAt((${x}) - 1)`);
    registerBinary("randomint", "random int from %1 to %2", "Number", "Number", (x, y) => `Math.floor(Math.random() * (${y} - ${x} + 1) + ${x})`);

    registerBlock("operators_not", {
        message0: "not %1",
        args0: [{ type: "input_value", name: "X", check: "Boolean" }],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const value = javascriptGenerator.valueToCode(
            block,
            "X",
            javascriptGenerator.ORDER_ATOMIC
        ) || "false";
        return [`!${value}`, javascriptGenerator.ORDER_ATOMIC];
    });

    registerBlock("operators_adv", {
        message0: "%1 %2",
        args0: [
            {
                type: "field_dropdown",
                name: "X",
                options: [
                    ["sin", "sin"], ["cos", "cos"], ["tan", "tan"],
                    ["asin", "asin"], ["acos", "acos"], ["atan", "atan"],
                    ["ceiling", "ceil"], ["round", "round"], ["floor", "floor"],
                    ["absolute", "abs"], ["sign", "sign"],
                ],
            },
            { type: "input_value", name: "Y", check: "Number" },
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const operation = block.getFieldValue("X");
        const value = javascriptGenerator.valueToCode(
            block,
            "Y",
            javascriptGenerator.ORDER_ATOMIC
        ) || "0";
        return [`Math.${operation}(${value})`, javascriptGenerator.ORDER_ATOMIC];
    });
}

export default register;