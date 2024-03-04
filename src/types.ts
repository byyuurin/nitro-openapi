import type {
  MediaTypeObject,
  OpenAPI3,
  OperationObject,
  ParameterObject,
  PathItemObject,
  ReferenceObject,
  RequestBodyObject,
  ResponseObject,
  SchemaObject,
  SecurityRequirementObject,
} from 'openapi-typescript'

export type ReferenceRef<T extends OpenApiRegisterConfig> = T extends { components: infer C }
  ? { [K in keyof C]: C[K] extends object ? `#/components/${K & string}/${keyof C[K] & string}` : never }[keyof C]
  : string

export type SchemaExtended<T extends string> = SchemaObject | (
  {
    type: 'array'
    prefixItems?: MaybeReference<SchemaExtended<T>, T>[]
    items?: MaybeReference<SchemaExtended<T>, T> | MaybeReference<SchemaExtended<T>, T>[]
    enum?: MaybeReference<SchemaExtended<T>, T>[]
    description?: string
  } | {
    type: 'object' | ['object', 'null']
    properties?: {
      [name: string]: MaybeReference<SchemaExtended<T>, T>
    }
    allOf?: MaybeReference<SchemaExtended<T>, T>[]
    anyOf?: MaybeReference<SchemaExtended<T>, T>[]
    enum?: MaybeReference<SchemaExtended<T>, T>[]
    description?: string
  }
)

export type ReferenceExtended<T extends string> = Omit<ReferenceObject, '$ref'> & { $ref: T }
export type MaybeReference<T, R extends string = string> = T | ReferenceExtended<R>

export type MaybeValueOrObject<ExampleT, ContentT> = ExampleT extends number | string | boolean
  ? ContentT
  : ExampleT extends (infer ArrayT)[]
    ? ContentT | MaybeValueOrObject<ArrayT, ContentT>
    : ExampleT extends Record<infer PropertyT, unknown>
      ? { [key in PropertyT]?: ContentT } | ContentT
      : ContentT

export type PathOperations = Omit<PathItemObject, 'servers' | 'parameters' | `x-${string}`>
export type PathOperationMethod = keyof PathOperations

export type PathResponse<RefT extends string> = Omit<ResponseObject, 'content'> & {
  content?: {
    [contentType: string]: Omit<MediaTypeObject, 'schema'> & {
      schema?: MaybeReference<SchemaExtended<RefT>, RefT>
    }
  }
}

export type PathOperationItem<T extends OpenApiRegisterConfig> = Omit<OperationObject, 'tags' | 'parameters' | 'requestBody' | 'responses' | 'security'> & {
  tags?:
  T extends { tags: infer Tags }
    ? Tags extends ({ name: infer Tag })[]
      ? Tag[] | string[]
      : string[]
    : string[]

  parameters?: MaybeReference<ParameterObject & {
    schema?: SchemaExtended<ReferenceRef<T>>
  }, ReferenceRef<T>>[]

  requestBody?: MaybeReference<RequestBodyObject & {
    content: {
      [contentType: string]: MaybeReference<MediaTypeObject, ReferenceRef<T>>
    }
  }, ReferenceRef<T>>

  responses?: {
    [responseCode: string]: MaybeReference<PathResponse<ReferenceRef<T>>, ReferenceRef<T>>
  } & {
    default?: MaybeReference<PathResponse<ReferenceRef<T>>, ReferenceRef<T>>
  }

  security?:
  T extends { components: infer C }
    ? C extends { securitySchemes: infer S }
      ? { [SecurityName in keyof S]?: string[] }[]
      : SecurityRequirementObject[]
    : SecurityRequirementObject[]
}

export type OpenApiRegisterConfig = Pick<
  Partial<OpenAPI3>,
  'paths' | 'components' | 'security' | 'servers' | 'info' | 'tags'
>
