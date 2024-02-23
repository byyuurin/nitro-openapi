import type {
  MaybeReference,
  OpenApiRegisterConfig,
  PathOperationItem,
  PathOperationMethod,
  ReferenceRef,
  SchemaExtended,
} from '@byyuurin/nitro-openapi'
import type {
  ParameterObject,
  SchemaObject,
} from 'openapi-typescript'

export interface ApiJsonModel<T = undefined> {
  code: number
  message: string
  data: T
}

export type ApiJsonResponse<T extends ApiJsonModel<unknown>> = Omit<T, T['data'] extends undefined ? 'data' : ''>

export type ApiResponseModel<T> = Record<keyof T, SchemaObject>

export interface ApiRouteMetaOptions<T, ConfigT extends OpenApiRegisterConfig = OpenApiRegisterConfig> extends Omit<PathOperationItem<ConfigT>, 'parameters' | 'responses'> {
  /** @default "get" */
  method?: PathOperationMethod
  parameters?: MaybeReference<ParameterObject & {
    name: keyof T
    schema?: SchemaExtended<ReferenceRef<ConfigT>>
  }, ReferenceRef<ConfigT>>[]
  response?: MaybeReference<SchemaExtended<ReferenceRef<ConfigT>>, ReferenceRef<ConfigT>>
}
