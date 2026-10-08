import javascriptGenerator from "../javascriptGenerator";
import registerBlock from "../register";

const categoryColor = "#5531D6";

function register() {
    registerBlock("functions_create", {
        message0: "function %1 %2 %3",
        args0: [
            { type: "field_input", name: "ID", text: "id", spellcheck: false },
            { type: "input_dummy" },
            { type: "input_statement", name: "FUNC" },
        ],
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const id = block.getFieldValue("ID");
        const body = javascriptGenerator.statementToCode(block, "FUNC");
        return `async function ${id}() { ${body} }\n`;
    });

    registerBlock("functions_inline", {
        message0: "inline function %1 %2",
        args0: [
            { type: "input_dummy" },
            { type: "input_statement", name: "FUNC" },
        ],
        output: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const body = javascriptGenerator.statementToCode(block, "FUNC");
        return [`await (async () => { ${body} })()`, javascriptGenerator.ORDER_ATOMIC];
    });

    registerBlock("functions_return", {
        message0: "return %1",
        args0: [{ type: "input_value", name: "VALUE" }],
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const value = javascriptGenerator.valueToCode(
            block,
            "VALUE",
            javascriptGenerator.ORDER_ATOMIC
        );
        return `return ${value || ""};\n`;
    });

    registerBlock("functions_call", {
        message0: "call %1",
        args0: [{ type: "field_input", name: "ID", text: "id", spellcheck: false }],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => `${block.getFieldValue("ID")}();\n`);

    registerBlock("functions_callreporter", {
        message0: "call %1",
        args0: [{ type: "field_input", name: "ID", text: "id", spellcheck: false }],
        output: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => [
        `${block.getFieldValue("ID")}()`,
        javascriptGenerator.ORDER_ATOMIC,
    ]);
}

export default register;