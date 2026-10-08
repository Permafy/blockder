import javascriptGenerator from "../javascriptGenerator";
import { compileVars } from "./compileVarSection";

const soundHelper = `
async function doSound(url, target, runtime) {
    if (Scratch.canFetch && !(await Scratch.canFetch(url))) {
        throw new Error("Permission to fetch sound URL denied");
    }
    const audio = new Audio(url);
    audio.volume = (target?.volume ?? 100) / 100;
    await audio.play();
    await new Promise(resolve => audio.addEventListener("ended", resolve, { once: true }));
}
`;

class Compiler {
    compile(workspace, extensionMetadata, imageStates) {
        compileVars.reset();
        const generatedCode = javascriptGenerator.workspaceToCode(workspace);
        const info = {
            id: extensionMetadata.id,
            name: extensionMetadata.name,
            color1: extensionMetadata.color1,
            color2: extensionMetadata.color2,
            color3: extensionMetadata.color3,
        };

        if (extensionMetadata.docsURL) info.docsURI = extensionMetadata.docsURL;
        if (extensionMetadata.tbShow) info.tbShow = extensionMetadata.tbShow;
        if (imageStates?.icon.image) info.blockIconURI = imageStates.icon.image;
        if (imageStates?.menuicon.image) info.menuIconURI = imageStates.menuicon.image;

        return [
            "/* Blockder extension */",
            "(async function (Scratch) {",
            'if (!Scratch.extensions.unsandboxed) { alert("This extension needs to be unsandboxed to run!"); return; }',
            "const variables = {};",
            "const blocks = [];",
            "const menus = [];",
            soundHelper,
            "class Extension {",
            "    getInfo() {",
            `        return { ...${JSON.stringify(info)}, blocks, menus };`,
            "    }",
            "}",
            generatedCode,
            "Scratch.extensions.register(new Extension());",
            "})(Scratch);",
        ].join("\n");
    }
}

export default Compiler;