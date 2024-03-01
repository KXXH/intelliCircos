/**
 * ts-to-zod configuration.
 *
 * @type {import("ts-to-zod").TsToZodConfig}
 */
module.exports = {
  input: './types/circos/trackConfig.d.ts',
  output: './types/circos/trackConfig.d.zod.ts',
  jsDocTagFilter: (tags) => {
    console.log(tags)
    return !tags.map(tag => tag.name).includes('notExtract')
  },
}
