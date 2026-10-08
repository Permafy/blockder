import javascriptGenerator from "../javascriptGenerator";
import registerBlock from "../register";

const categoryColor = "#FF8C1A";

function register() {
    registerBlock("variable_set", {
        message0: "set %1 to %2",
        args0: [
            { type: "input_value", name: "NAME", check: "String" },
            { type: "input_value", name: "VAR" },
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const name = javascriptGenerator.valueToCode(
            block,
            "NAME",
            javascriptGenerator.ORDER_ATOMIC
        );
        const value = javascriptGenerator.valueToCode(
            block,
            "VAR",
            javascriptGenerator.ORDER_ATOMIC
        );
        return `variables[${name || '""'}] = ${value || '""'};\n`;
    });

    registerBlock("variable_get", {
        message0: "get %1",
        args0: [{ type: "input_value", name: "NAME", check: "String" }],
        output: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const name = javascriptGenerator.valueToCode(
            block,
            "NAME",
            javascriptGenerator.ORDER_ATOMIC
        );
        return [`variables[${name || '""'}]`, javascriptGenerator.ORDER_ATOMIC];
    });

    registerBlock("variable_setls", {
        message0: "set localstorage %1 to %2",
        args0: [
            { type: "input_value", name: "NAME", check: "String" },
            { type: "input_value", name: "VAR" },
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const name = javascriptGenerator.valueToCode(
            block,
            "NAME",
            javascriptGenerator.ORDER_ATOMIC
        );
        const value = javascriptGenerator.valueToCode(
            block,
            "VAR",
            javascriptGenerator.ORDER_ATOMIC
        );
        return `localStorage.setItem(${name || '""'}, ${value || '""'});\n`;
    });

    registerBlock("variable_getls", {
        message0: "get localstorage %1",
        args0: [{ type: "input_value", name: "NAME", check: "String" }],
        output: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const name = javascriptGenerator.valueToCode(
            block,
            "NAME",
            javascriptGenerator.ORDER_ATOMIC
        );
        return [`localStorage.getItem(${name || '""'})`, javascriptGenerator.ORDER_ATOMIC];
    });
}

export default register;