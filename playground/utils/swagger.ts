import type { InternalApi } from 'nitropack'
import type { configExtends } from '../plugins/swagger'
import { defineOperation, register } from '../plugins/swagger'
import type { ApiJsonModel, ApiJsonResponse, ApiRouteMeta } from '../types'

export { toExampleSchema } from '@byyuurin/nitro-openapi'

export { defineOperation }

export function createApiResponse<DataT = undefined>(
  data?: DataT,
  options: Partial<Omit<ApiJsonModel, 'data'>> = {},
): ApiJsonResponse<ApiJsonModel<DataT>> {
  const { code = 0, message = 'success' } = options
  return { code, message, data } as any
}

export function defineApiRouteMeta(
  route: keyof InternalApi,
  options: ApiRouteMeta<typeof configExtends> = {},
) {
  const { method, response, ...defaults } = options

  if (response)
    response.description ??= 'Response content'

  const operation = defineOperation({
    ...defaults,
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                code: { type: 'number', description: 'Response code' },
                message: { type: 'string', description: 'Response description' },
                ...response ? { data: response } : {},
              },
            },
          },
        },
      },
    },
  })

  register(route, operation, method)
}
