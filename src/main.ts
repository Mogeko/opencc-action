import * as core from '@actions/core'
import * as util from 'util'
import * as fs from 'fs';
import { OpenCC } from 'opencc'

const readFileAsync  = util.promisify(fs.readFile)
const readDirAsync   = util.promisify(fs.readdir)
const writeFileAsync = util.promisify(fs.writeFile)

const getConfig = () => {
  core.debug("Processing config")

  const input = {
    input: core.getInput('input'),
    output: core.getInput('output'),
    config: core.getInput('config')
  }

  core.debug(`input: ${input.input}`)
  core.debug(`output: ${input.output}`)
  core.debug(`config: ${input.config}`)

  return input
}

const handleFile = async (input_path: string, output_path: string, converter: OpenCC) => readFileAsync(input_path)
  .then(data => converter.convertPromise(data.toString()))
  .then(data => writeFileAsync(output_path, data))

const main = async () => {

  const config = getConfig()
  const converter = new OpenCC(config.config)

  return await readDirAsync(config.input)
    .then(files => files
      .map(file => handleFile(`${config.input}/${file}`, `${config.output}/${file}`, converter)
        .catch((e: Error) => core.info(e.message))
      )
    ).catch(() => handleFile(config.input, config.output, converter))
}

main().catch((e: Error) => {
  core.setFailed(e.message)
})
