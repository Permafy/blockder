import javascriptGenerator from "../javascriptGenerator";
import registerBlock from "../register";

const categoryColor = "#8BC059";
const timeUnits = [
    ["milliseconds", "1"],
    ["seconds", "1000"],
    ["minutes", "60000"],
    ["hours", "3600000"],
    ["days", "86400000"],
];

function register() {
    registerBlock("conversions_tonumber", {
        message0: "%1 to number",
        args0: [{ type: "input_value", name: "VAL" }],
        output: "Number",
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const value = javascriptGenerator.valueToCode(
            block,
            "VAL",
            javascriptGenerator.ORDER_ATOMIC
        );
        return [`Number(${value})`, javascriptGenerator.ORDER_ATOMIC];
    });

    registerBlock("conversions_tostring", {
        message0: "%1 to string",
        args0: [{ type: "input_value", name: "VAL" }],
        output: "String",
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const value = javascriptGenerator.valueToCode(
            block,
            "VAL",
            javascriptGenerator.ORDER_ATOMIC
        );
        return [`String(${value})`, javascriptGenerator.ORDER_ATOMIC];
    });

    registerBlock("conversions_time", {
        message0: "%1 %2 to %3",
        args0: [
            { type: "input_value", name: "VAL", check: "Number" },
            { type: "field_dropdown", name: "MENU1", options: timeUnits },
            { type: "field_dropdown", name: "MENU2", options: timeUnits },
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const value = javascriptGenerator.valueToCode(
            block,
            "VAL",
            javascriptGenerator.ORDER_ATOMIC
        );
        const from = block.getFieldValue("MENU1");
        const to = block.getFieldValue("MENU2");
        return [`(${value} * ${from} / ${to})`, javascriptGenerator.ORDER_ATOMIC];
    });
}

export default register;