import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  name: '@byyuurin/nitro-openapi',
  entries: [
    'src/index',
  ],
  rollup: {
    emitCJS: true,
  },
})
