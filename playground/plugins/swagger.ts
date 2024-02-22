import { createOpenApiRegister } from '@byyuurin/nitro-openapi'
import type { OpenAPI3 } from 'openapi-typescript'

export const { register, merge, configExtends } = createOpenApiRegister({
  info: {
    title: 'Swagger API',
    version: 'dev',
  },
  tags: [
    { name: 'Internal', description: 'Internal Routes' },
    { name: 'API Routes', description: 'All API list' },
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
      // let body = context.body as string
      // body = body.replace(/(\s*)(url:\s"[^"]+")/, '$1docExpansion: "none",$1$2')
      // context.body = body
      // console.log(body.match(/(?:SwaggerUIBundle\(([^;]+)\))/)?.[1])
      return
    }

    if (!/openapi.json/.test(event.path))
      return

    // merge config
    const config = context.body as OpenAPI3
    context.body = merge(config)
  })
})
