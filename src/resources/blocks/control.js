import javascriptGenerator from '../javascriptGenerator';
import registerBlock from '../register';
import { compileVars } from '../compiler/compileVarSection';

const categoryPrefix = 'control_';
const categoryColor = '#FFAB19';

function register() {
    registerBlock(`${categoryPrefix}wait`, {
        message0: 'wait %1 (ms)',
        args0: [{ type: 'input_value', name: 'MS', check: 'Number' }],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const milliseconds = javascriptGenerator.valueToCode(block, 'MS', javascriptGenerator.ORDER_ATOMIC);
        return `await new Promise(resolve => setTimeout(resolve, ${milliseconds || 0}));\n`;
    });

    registerBlock(`${categoryPrefix}waituntil`, {
        message0: 'wait until %1',
        args0: [{ type: 'input_value', name: 'CONDITION', check: 'Boolean' }],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const condition = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_ATOMIC);
        return `await new Promise(resolve => { const timer = setInterval(() => { if (${condition || 'false'}) { clearInterval(timer); resolve(); } }, 50); });\n`;
    });

    registerBlock(`${categoryPrefix}repeat`, {
        message0: 'repeat %1 %2 %3',
        args0: [
            { type: 'input_value', name: 'TIMES', check: 'Number' },
            { type: 'input_dummy' },
            { type: 'input_statement', name: 'BLOCKS' }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const times = javascriptGenerator.valueToCode(block, 'TIMES', javascriptGenerator.ORDER_ATOMIC);
        const body = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const variable = compileVars.next();
        return `for (let ${variable} = 0; ${variable} < (${times || 0}); ${variable}++) {\n${body}}\n`;
    });

    registerBlock(`${categoryPrefix}ifthenreturn`, {
        message0: 'if %1 then %2 else %3',
        args0: [
            { type: 'input_value', name: 'CONDITION', check: 'Boolean' },
            { type: 'input_value', name: 'X' },
            { type: 'input_value', name: 'Y' }
        ],
        output: null,
        inputsInline: false,
        colour: categoryColor
    }, (block) => {
        const condition = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_ATOMIC) || 'false';
        const whenTrue = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC) || 'null';
        const whenFalse = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC) || 'null';
        return [`(${condition} ? ${whenTrue} : ${whenFalse})`, javascriptGenerator.ORDER_ATOMIC];
    });

    registerBlock(`${categoryPrefix}switch`, {
        message0: 'switch %1 %2 %3',
        args0: [
            { type: 'input_value', name: 'VALUE' },
            { type: 'input_dummy' },
            { type: 'input_statement', name: 'BLOCKS', check: 'Case' }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const value = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC) || "''";
        const body = javascriptGenerator.statementToCode(block, 'BLOCKS');
        return `switch (${value}) {\n${body}}\n`;
    });

    registerBlock(`${categoryPrefix}case`, {
        message0: 'case %1 %2 %3',
        args0: [
            { type: 'input_value', name: 'VALUE' },
            { type: 'input_dummy' },
            { type: 'input_statement', name: 'BLOCKS' }
        ],
        previousStatement: 'Case',
        nextStatement: 'Case',
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const value = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC) || "''";
        const body = javascriptGenerator.statementToCode(block, 'BLOCKS');
        return `case ${value}:\n${body}`;
    });

    registerBlock(`${categoryPrefix}default`, {
        message0: 'default %1 %2',
        args0: [
            { type: 'input_dummy' },
            { type: 'input_statement', name: 'BLOCKS' }
        ],
        previousStatement: 'Case',
        inputsInline: true,
        colour: categoryColor
    }, (block) => `default:\n${javascriptGenerator.statementToCode(block, 'BLOCKS')}`);

    registerBlock(`${categoryPrefix}break`, {
        message0: 'break',
        args0: [],
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, () => 'break;\n');

    // if <> then {}
    registerBlock(`${categoryPrefix}ifthen`, {
        message0: 'if %1 then %2 %3',
        args0: [
            {
                "type": "input_value",
                "name": "CONDITION",
                "check": "Boolean"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const CONDITION = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_ATOMIC);
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `if (${CONDITION ? `Boolean(${CONDITION})` : 'false'}) { ${BLOCKS} };`;
        return `${code}\n`;
    })
    // if <> then {} else {}
    registerBlock(`${categoryPrefix}ifthenelse`, {
        message0: 'if %1 then %2 %3 else %4 %5',
        args0: [
            {
                "type": "input_value",
                "name": "CONDITION",
                "check": "Boolean"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS2"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const CONDITION = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_ATOMIC);
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const BLOCKS2 = javascriptGenerator.statementToCode(block, 'BLOCKS2');
        const code = `if (${CONDITION ? `Boolean(${CONDITION})` : 'false'}) { ${BLOCKS} } else { ${BLOCKS2} };`;
        return `${code}\n`;
    })
}

export default register;
