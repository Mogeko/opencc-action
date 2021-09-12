"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const util = __importStar(require("util"));
const fs = __importStar(require("fs"));
const opencc_1 = require("opencc");
const readFileAsync = util.promisify(fs.readFile);
const readDirAsync = util.promisify(fs.readdir);
const writeFileAsync = util.promisify(fs.writeFile);
const getConfig = () => {
    core.debug("Processing config");
    const input = {
        input: core.getInput('input'),
        output: core.getInput('output'),
        config: core.getInput('config')
    };
    core.debug(`input: ${input.input}`);
    core.debug(`output: ${input.output}`);
    core.debug(`config: ${input.config}`);
    return input;
};
const handleFile = async (input_path, output_path, converter) => readFileAsync(input_path)
    .then(data => converter.convertPromise(data.toString()))
    .then(data => writeFileAsync(output_path, data));
const main = async () => {
    const config = getConfig();
    const converter = new opencc_1.OpenCC(config.config);
    return await readDirAsync(config.input)
        .then(files => files
        .map(file => handleFile(`${config.input}/${file}`, `${config.output}/${file}`, converter)
        .catch((e) => core.info(e.message)))).catch(() => handleFile(config.input, config.output, converter));
};
main().catch((e) => {
    core.setFailed(e.message);
});
//# sourceMappingURL=main.js.map