import type { InternalApi } from 'nitropack'
import type { OperationObject } from 'openapi-typescript'
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
  options: ApiRouteMetaOptions<P> = {},
) {
  const { method = 'get', response, ...defaults } = options

  if (response)
    response.description ??= '回傳內容'

  const operationObject: OperationObject = {
    ...defaults,
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                code: { type: 'number', description: '狀態碼' },
                message: { type: 'string', description: '狀態說明' },
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
