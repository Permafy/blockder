import javascriptGenerator from "../javascriptGenerator";
import registerBlock from "../register";

const categoryColor = "#FF6680";

function register() {
    registerBlock("blocks_create", {
        message0: "create block %1 id: %2 %3 text: %4 %5 type: %6 %7 inputs: %8 %9 function: %10 %11",
        args0: [
            { type: "input_dummy" },
            { type: "field_input", name: "ID", text: "id", spellcheck: false },
            { type: "input_dummy" },
            { type: "field_input", name: "TEXT", text: "text", spellcheck: false },
            { type: "input_dummy" },
            {
                type: "field_dropdown",
                name: "TYPE",
                options: [["block", "COMMAND"], ["reporter", "REPORTER"], ["boolean", "BOOLEAN"]],
            },
            { type: "input_dummy" },
            { type: "input_dummy" },
            { type: "input_statement", name: "INPUTS", check: "BlockInput" },
            { type: "input_dummy" },
            { type: "input_statement", name: "FUNC" },
        ],
        nextStatement: null,
        inputsInline: false,
        colour: categoryColor,
    }, (block) => {
        const id = JSON.stringify(block.getFieldValue("ID"));
        const text = JSON.stringify(block.getFieldValue("TEXT"));
        const type = block.getFieldValue("TYPE");
        const inputs = javascriptGenerator.statementToCode(block, "INPUTS");
        const body = javascriptGenerator.statementToCode(block, "FUNC");
        return `blocks.push({ opcode: ${id}, blockType: Scratch.BlockType.${type}, text: ${text}, arguments: { ${inputs} }, disableMonitor: true });\nExtension.prototype[${id}] = async (args, util) => { ${body} };\n`;
    });

    registerBlock("blocks_input", {
        message0: "create input %1 id: %2 %3 type: %4 %5 default: %6",
        args0: [
            { type: "input_dummy" },
            { type: "field_input", name: "ID", text: "ID", spellcheck: false },
            { type: "input_dummy" },
            {
                type: "field_dropdown",
                name: "TYPE",
                options: [
                    ["string", "STRING"], ["number", "NUMBER"], ["boolean", "BOOLEAN"],
                    ["color", "COLOR"], ["costume", "COSTUME"], ["sound", "SOUND"],
                    ["angle", "ANGLE"], ["matrix", "MATRIX"], ["note", "NOTE"], ["empty", "empty"],
                ],
            },
            { type: "input_dummy" },
            { type: "input_value", name: "DEFAULT" },
        ],
        nextStatement: "BlockInput",
        previousStatement: "BlockInput",
        inputsInline: false,
        colour: categoryColor,
    }, (block) => {
        const id = JSON.stringify(block.getFieldValue("ID"));
        const type = block.getFieldValue("TYPE");
        const value = javascriptGenerator.valueToCode(
            block,
            "DEFAULT",
            javascriptGenerator.ORDER_ATOMIC
        );
        return `${id}: { type: Scratch.ArgumentType.${type}${value ? `, defaultValue: ${value}` : ""} },\n`;
    });

    registerBlock("blocks_get", {
        message0: "get %1",
        args0: [{ type: "field_input", name: "NAME", text: "INPUTID", spellcheck: false }],
        output: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => [
        `args[${JSON.stringify(block.getFieldValue("NAME"))}]`,
        javascriptGenerator.ORDER_ATOMIC,
    ]);

    registerBlock("blocks_return", {
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
}

export default register;