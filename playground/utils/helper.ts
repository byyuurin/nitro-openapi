import type { PathOperationItem } from '@byyuurin/nitro-openapi'
import type { InternalApi } from 'nitropack'
import type { configExtends } from '../plugins/swagger'
import { register } from '../plugins/swagger'
import type { ApiJsonModel, ApiJsonResponse, ApiRouteMetaOptions } from '../types'

export { resolveSchemaObject, toExampleSchema } from '@byyuurin/nitro-openapi'

export function createApiResponse<DataT = undefined>(
  data?: DataT,
  options: Partial<Omit<ApiJsonModel, 'data'>> = {},
): ApiJsonResponse<ApiJsonModel<DataT>> {
  const { code = 0, message = 'success' } = options
  return { code, message, data } as any
}

export function defineApiRouteMeta<P = Record<string, unknown>>(
  route: keyof InternalApi,
  options: ApiRouteMetaOptions<P, typeof configExtends> = {},
) {
  const { method = 'get', response, ...defaults } = options

  if (response)
    response.description ??= 'Response content'

  const operationObject: PathOperationItem<typeof configExtends> = {
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
  }

  register(route, operationObject, method)
}
