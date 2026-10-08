import Blockly from "blockly/core";
import javascriptGenerator from "../javascriptGenerator";
import registerBlock from "../register";

const categoryColor = "#5CB1D6";

function register() {
    registerBlock("sensing_keypress", {
        message0: "when key %1 is pressed %2 %3",
        args0: [
            { type: "field_input", name: "KEY", spellcheck: false },
            { type: "input_dummy" },
            { type: "input_statement", name: "BLOCKS" },
        ],
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
        extensions: ["single_character_validation"],
    }, (block) => {
        const key = JSON.stringify(block.getFieldValue("KEY"));
        const body = javascriptGenerator.statementToCode(block, "BLOCKS");
        return `document.addEventListener("keypress", event => { if (event.key === ${key}) { ${body} } });\n`;
    });

    registerBlock("sensing_alert", {
        message0: "alert %1",
        args0: [{ type: "input_value", name: "ALERT" }],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const alert = javascriptGenerator.valueToCode(
            block,
            "ALERT",
            javascriptGenerator.ORDER_ATOMIC
        );
        return `alert(${alert || '""'});\n`;
    });

    registerBlock("sensing_confirm", {
        message0: "confirm %1",
        args0: [{ type: "input_value", name: "ALERT" }],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const alert = javascriptGenerator.valueToCode(
            block,
            "ALERT",
            javascriptGenerator.ORDER_ATOMIC
        );
        return [`confirm(${alert || '""'})`, javascriptGenerator.ORDER_ATOMIC];
    });

    registerBlock("sensing_prompt", {
        message0: "prompt %1",
        args0: [{ type: "input_value", name: "ALERT" }],
        output: "String",
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const alert = javascriptGenerator.valueToCode(
            block,
            "ALERT",
            javascriptGenerator.ORDER_ATOMIC
        );
        return [`prompt(${alert || '""'})`, javascriptGenerator.ORDER_ATOMIC];
    });

    registerBlock("sensing_time", {
        message0: "time (ms) since 1970",
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor,
    }, () => ["Date.now()", javascriptGenerator.ORDER_ATOMIC]);

    registerBlock("sensing_year", {
        message0: "current year",
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor,
    }, () => ["new Date().getFullYear()", javascriptGenerator.ORDER_ATOMIC]);

    registerBlock("sensing_leapyear", {
        message0: "is leap year?",
        args0: [],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor,
    }, () => [
        "new Date(new Date().getFullYear(), 1, 29).getDate() === 29",
        javascriptGenerator.ORDER_ATOMIC,
    ]);
}

if (!Blockly.Extensions.isRegistered("single_character_validation")) {
    Blockly.Extensions.register("single_character_validation", function () {
        this.getField("KEY").setValidator((value) =>
            value.slice(-1)
        );
    });
}

export default register;