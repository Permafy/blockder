import javascriptGenerator from "../javascriptGenerator";
import registerBlock from "../register";

const categoryColor = "#666666";

function register() {
    for (const level of ["log", "warn", "error"]) {
        registerBlock(`debug_${level}`, {
            message0: `${level} %1`,
            args0: [{ type: "input_value", name: "LOG" }],
            previousStatement: null,
            nextStatement: null,
            inputsInline: true,
            colour: categoryColor,
        }, (block) => {
            const value = javascriptGenerator.valueToCode(
                block,
                "LOG",
                javascriptGenerator.ORDER_ATOMIC
            );
            return `console.${level}(${value});\n`;
        });
    }

    registerBlock("debug_rawblock", {
        message0: "raw %1",
        args0: [{ type: "field_input", name: "RAW", spellcheck: false }],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => `${block.getFieldValue("RAW")};\n`);

    registerBlock("debug_raw", {
        message0: "raw %1",
        args0: [{ type: "field_input", name: "RAW", spellcheck: false }],
        output: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => [block.getFieldValue("RAW"), javascriptGenerator.ORDER_ATOMIC]);

    registerBlock("debug_comment", {
        message0: "// %1",
        args0: [{ type: "field_input", name: "COMMENT", spellcheck: false }],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => `// ${block.getFieldValue("COMMENT")}\n`);

    registerBlock("debug_commentstack", {
        message0: "/* %1 %2 */",
        args0: [{ type: "input_dummy" }, { type: "input_statement", name: "BLOCKS" }],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const body = javascriptGenerator.statementToCode(block, "BLOCKS");
        return `/*\n${body}*/;\n`;
    });

    registerBlock("debug_catch", {
        message0: "code finished successfully? (runs code) %1 %2",
        args0: [{ type: "input_dummy" }, { type: "input_statement", name: "FUNC" }],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const body = javascriptGenerator.statementToCode(block, "FUNC");
        return [`await (async () => { try { ${body} return true; } catch { return false; } })()`, javascriptGenerator.ORDER_ATOMIC];
    });
}

export default register;