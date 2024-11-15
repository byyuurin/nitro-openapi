import { createOpenApiRegister } from '@byyuurin/nitro-openapi'
import type { OpenAPI3 } from 'openapi-typescript'

export const { defineOperation, register, merge, configExtends } = createOpenApiRegister({
  info: {
    title: 'Swagger API',
    version: 'dev',
  },
  tags: [
    { name: 'API Routes', description: 'All API list' },
    { name: 'Internal', description: 'Internal Routes' },
  ] as const,
  components: {
    securitySchemes: {
      FrontendToken: {
        type: 'http',
        description: 'Frontend JWT Token',
        scheme: 'bearer',
      },
      BackendToken: {
        type: 'http',
        description: 'Backend JWT Token',
        scheme: 'bearer',
      },
    },
    schemas: {
      ExampleData: toExampleSchema({
        index: 0,
        text: 'text',
        status: false,
      }, {
        index: 'Number value',
        text: 'Text value',
        status: 'true or false',
      }, {
        description: 'Example data',
      }),
    } as const,
  },
})

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('error', (error) => {
    // eslint-disable-next-line no-console
    console.log('nitro error:', error.message)
  })

  nitro.hooks.hook('beforeResponse', (event, context) => {
    // config adjust
    if (event.path.endsWith('swagger')) {
      let body = context.body as string

      const settings = Object.entries({
        // docExpansion: 'none', // collapse all groups
        // defaultModelsExpandDepth: -1, // hide schemas
      }).map(([k, v]) => `$1${k}: ${typeof v === 'string' ? `"${v}"` : JSON.stringify(v)}`).join('')

      body = body.replace(/(\s*)(url:\s"[^"]+")/, `${settings}${settings ? ',' : ''}$1$2`)
      // console.log(body.match(/(?:SwaggerUIBundle\(([^;]+)\))/)?.[1])

      context.body = body
      return
    }

    if (!/openapi.json/.test(event.path))
      return

    // merge config
    const config = merge(context.body as OpenAPI3)

    config.openapi = '3.0.3'

    const { paths = {} } = config

    for (const path in paths) {
      Object.entries(paths[path]).forEach(([method, operation]) => {
        if ('tags' in operation) {
          paths[path][method as any] = {
            ...operation,
            tags: operation.tags.slice(-1),
          }
        }
      })
    }

    context.body = config
  })
})
