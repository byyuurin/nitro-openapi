import type { PathOperationMethod } from '@byyuurin/nitro-openapi'
import type { OperationObject, ParameterObject, RequestBodyObject, SchemaObject } from 'openapi-typescript'

export interface ApiJsonModel<T = undefined> {
  code: number
  message: string
  data: T
}

export type ApiJsonResponse<T extends ApiJsonModel<unknown>> = Omit<T, T['data'] extends undefined ? 'data' : ''>

export type ApiResponseModel<T> = Record<keyof T, SchemaObject>

export interface ApiRouteMetaOptions<P> extends Pick<OperationObject, 'tags' | 'summary' | 'description'> {
  method?: PathOperationMethod
  parameters?: (ParameterObject & { name: keyof P })[]
  requestBody?: RequestBodyObject
  response?: SchemaObject
}
