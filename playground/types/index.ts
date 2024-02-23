import type { MaybeReference, PathOperationMethod, ReferenceRef } from '@byyuurin/nitro-openapi'
import type { ComponentsObject, OperationObject, ParameterObject, SchemaObject } from 'openapi-typescript'

export interface ApiJsonModel<T = undefined> {
  code: number
  message: string
  data: T
}

export type ApiJsonResponse<T extends ApiJsonModel<unknown>> = Omit<T, T['data'] extends undefined ? 'data' : ''>

export type ApiResponseModel<T> = Record<keyof T, SchemaObject>

export interface ApiRouteMetaOptions<T, ComponentsT extends ComponentsObject = ComponentsObject> extends Omit<OperationObject, 'parameters' | 'responses'> {
  /** @default "get" */
  method?: PathOperationMethod
  parameters?: MaybeReference<ParameterObject & { name: keyof T }, ReferenceRef<ComponentsT>>[]
  response?: MaybeReference<SchemaObject, ReferenceRef<ComponentsT>>
}
