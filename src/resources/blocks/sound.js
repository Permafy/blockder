import javascriptGenerator from "../javascriptGenerator";
import registerBlock from "../register";

const categoryColor = "#CF63CF";

function register() {
    registerBlock("sound_startsound", {
        message0: "start sound %1",
        args0: [
            {
                type: "field_input",
                name: "SOUND",
                text: "https://t.ly/2gHlM",
                spellcheck: false,
            },
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const sound = block.getFieldValue("SOUND");
        return `doSound(\`${sound}\`, Scratch.vm.runtime.targets.find(target => target.isStage), Scratch.vm.runtime);\n`;
    });
}

export default register;