import javascriptGenerator from "../javascriptGenerator";
import registerBlock from "../register";

const categoryColor = "#FF661A";
const order = javascriptGenerator.ORDER_ATOMIC;

function registerValue(id, label, inputs, output, generate) {
    registerBlock(`json_${id}`, {
        message0: label,
        args0: inputs.map(([name, check]) => ({
            type: "input_value",
            name,
            ...(check ? { check } : {}),
        })),
        output,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const values = Object.fromEntries(inputs.map(([name]) => [
            name,
            javascriptGenerator.valueToCode(block, name, order),
        ]));
        return [generate(values), order];
    });
}

function register() {
    registerValue("validate", "is %1 valid JSON?", [["INPUT", "String"]], "Boolean", ({ INPUT }) =>
        `await (async () => { try { JSON.parse(${INPUT || '"{}"'}); return true; } catch { return false; } })()`
    );
    registerValue("tojson", "string %1 to JSON", [["INPUT", "String"]], ["JSONArray", "JSONObject"], ({ INPUT }) =>
        `await (async () => { try { return JSON.parse(${INPUT || '"{}"'}); } catch { return false; } })()`
    );
    registerValue("tostring", "JSON %1 to string", [["INPUT", ["JSONArray", "JSONObject"]]], "String", ({ INPUT }) =>
        `JSON.stringify(${INPUT || "{}"})`
    );
    registerValue("arrayinsert", "insert %1 at end of %2", [["X"], ["Y", "JSONArray"]], "JSONArray", ({ X, Y }) =>
        `[...(${Y || "[]"}), ${X || '""'}]`
    );
    registerValue("arrayset", "set %1 to %2 in array %3", [["X", "Number"], ["Y"], ["Z", "JSONArray"]], "JSONArray", ({ X, Y, Z }) =>
        `await (async () => { const array = [...(${Z || "[]"})]; array[${X || 0}] = ${Y || '""'}; return array; })()`
    );
    registerValue("arraymerge", "merge array %1 with %2", [["X", "JSONArray"], ["Y", "JSONArray"]], "JSONArray", ({ X, Y }) =>
        `[...(${X || "[]"}), ...(${Y || "[]"})]`
    );
    registerValue("arrayget", "get %1 from array %2", [["X", "Number"], ["Y", "JSONArray"]], null, ({ X, Y }) =>
        `(${Y || "[]"})[${X || 0}]`
    );
    registerValue("arraylength", "length of array %1", [["X", "JSONArray"]], "Number", ({ X }) =>
        `(${X || "[]"}).length`
    );
    registerValue("objectset", "set %1 to %2 in object %3", [["X", "String"], ["Y"], ["Z", "JSONObject"]], "JSONObject", ({ X, Y, Z }) =>
        `await (async () => { const object = { ...((${Z || "{}"})) }; object[${X || '""'}] = ${Y || '""'}; return object; })()`
    );
    registerValue("objectget", "get %1 from object %2", [["X", "String"], ["Y", "JSONObject"]], null, ({ X, Y }) =>
        `(${Y || "{}"})[${X || '""'}]`
    );
    registerValue("objectkeys", "keys of object %1", [["X", "JSONObject"]], "JSONArray", ({ X }) =>
        `Object.keys(${X || "{}"})`
    );
    registerValue("objectvalues", "values of object %1", [["X", "JSONObject"]], "JSONArray", ({ X }) =>
        `Object.values(${X || "{}"})`
    );
    registerValue("objectmerge", "merge object %1 with %2", [["X", "JSONObject"], ["Y", "JSONObject"]], "JSONObject", ({ X, Y }) =>
        `({ ...(${X || "{}"}), ...(${Y || "{}"}) })`
    );
}

export default register;