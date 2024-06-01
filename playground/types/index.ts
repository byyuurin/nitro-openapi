import type {
  ApiRegisterOptions,
  MaybeReference,
  OperationType,
  PathOperation,
  ReferenceType,
  SchemaType,
} from '@byyuurin/nitro-openapi'
import type {
  SchemaObject,
} from 'openapi-typescript'

export interface ApiJsonModel<T = undefined> {
  code: number
  message: string
  data: T
}

export type ApiJsonResponse<T extends ApiJsonModel<unknown>> = Omit<T, T['data'] extends undefined ? 'data' : ''>

export type ApiResponseModel<T> = Record<keyof T, SchemaObject>

export interface ApiRouteMeta<T extends ApiRegisterOptions = ApiRegisterOptions> extends Omit<OperationType<T>, 'responses'> {
  /** @default "get" */
  method?: keyof PathOperation
  response?: MaybeReference<SchemaType<ReferenceType<T>>, ReferenceType<T>>
}
