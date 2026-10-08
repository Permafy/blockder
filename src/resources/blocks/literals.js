import javascriptGenerator from "../javascriptGenerator";
import registerBlock from "../register";

const categoryColor = "#59C08E";

function register() {
    const values = [
        ["true", "true", "Boolean", () => "true"],
        ["false", "false", "Boolean", () => "false"],
        ["null", "null", "Null", () => "null"],
        ["array", "blank array", "JSONArray", () => "[]"],
        ["object", "blank object", "JSONObject", () => "{}"],
    ];

    for (const [id, label, output, generate] of values) {
        registerBlock(`literals_${id}`, {
            message0: label,
            args0: [],
            output,
            inputsInline: true,
            colour: categoryColor,
        }, () => [generate(), javascriptGenerator.ORDER_ATOMIC]);
    }

    registerBlock("literals_number", {
        message0: "(%1)",
        args0: [{ type: "field_number", name: "NUMBER", value: 0 }],
        output: "Number",
        inputsInline: true,
        colour: categoryColor,
    }, (block) => [
        String(block.getFieldValue("NUMBER")),
        javascriptGenerator.ORDER_ATOMIC,
    ]);

    registerBlock("literals_string", {
        message0: "'%1'",
        args0: [{ type: "field_input", name: "STRING", text: "string", spellcheck: false }],
        output: "String",
        inputsInline: true,
        colour: categoryColor,
    }, (block) => [
        JSON.stringify(block.getFieldValue("STRING")),
        javascriptGenerator.ORDER_ATOMIC,
    ]);

    registerBlock("literals_color", {
        message0: "%1",
        args0: [{ type: "field_colour", name: "COLOR", colour: "#ff0000" }],
        output: "Color",
        inputsInline: true,
        colour: categoryColor,
    }, (block) => [
        JSON.stringify(block.getFieldValue("COLOR")),
        javascriptGenerator.ORDER_ATOMIC,
    ]);

    registerBlock("literals_arraylength", {
        message0: "array of length %1",
        args0: [{ type: "input_value", name: "X", check: "Number" }],
        output: "JSONArray",
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const length = javascriptGenerator.valueToCode(
            block,
            "X",
            javascriptGenerator.ORDER_ATOMIC
        );
        return [`Array(${length || 0})`, javascriptGenerator.ORDER_ATOMIC];
    });
}

export default register;