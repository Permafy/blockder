import javascriptGenerator from "../javascriptGenerator";
import registerBlock from "../register";

const categoryColor = "#FFBF00";

function register() {
    registerBlock("events_interval", {
        message0: "every %1 seconds do %2 %3",
        args0: [
            { type: "input_value", name: "TIME", check: "Number" },
            { type: "input_dummy" },
            { type: "input_statement", name: "BLOCKS" },
        ],
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const time = javascriptGenerator.valueToCode(
            block,
            "TIME",
            javascriptGenerator.ORDER_ATOMIC
        );
        const blocks = javascriptGenerator.statementToCode(block, "BLOCKS");
        return `setInterval(async () => { ${blocks} }, (${time} * 1000));\n`;
    });

    registerBlock("events_timeout", {
        message0: "in %1 seconds do %2 %3",
        args0: [
            { type: "input_value", name: "TIME", check: "Number" },
            { type: "input_dummy" },
            { type: "input_statement", name: "BLOCKS" },
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const time = javascriptGenerator.valueToCode(
            block,
            "TIME",
            javascriptGenerator.ORDER_ATOMIC
        );
        const blocks = javascriptGenerator.statementToCode(block, "BLOCKS");
        return `setTimeout(async () => { ${blocks} }, (${time} * 1000));\n`;
    });
}

export default register;