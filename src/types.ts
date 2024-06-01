import type {
  OpenAPI3,
  OperationObject,
  PathItemObject,
  ReferenceObject,
  SchemaObject,
  SecurityRequirementObject,
} from 'openapi-typescript'

export type ReferenceType<T extends ApiRegisterOptions> = T extends { components: infer C }
  ? { [K in keyof C]: C[K] extends object ? `#/components/${K & string}/${keyof C[K] & string}` : never }[keyof C]
  : string

export type ReplaceRef<T, RefT> = T extends ReferenceObject
  ? Omit<T, '$ref'> & { $ref: RefT }
  : T extends object
    ? { [K in keyof T]: ReplaceRef<T[K], RefT> }
    : T

export type WithTypedRef<T, RefT> = ReplaceRef<T, RefT>

export type SchemaType<RefT extends string> = ReplaceRef<SchemaObject, RefT>
export type MaybeReference<T, RefT = string> = T | ReplaceRef<ReferenceObject, RefT>

export type MaybeValueOrObject<ExampleT, ContentT> = ExampleT extends number | string | boolean
  ? ContentT
  : ExampleT extends (infer ArrayT)[]
    ? ContentT | MaybeValueOrObject<ArrayT, ContentT>
    : ExampleT extends object
      ? { [key in keyof ExampleT]?: ContentT } | ContentT
      : unknown

export type PathOperation = Omit<PathItemObject, 'servers' | 'parameters' | `x-${string}`>

export type OperationType<T extends ApiRegisterOptions> = Omit<ReplaceRef<OperationObject, ReferenceType<T>>, 'tags' | 'security'> & {
  tags?:
  T extends { tags: infer Tags }
    ? Tags extends ({ name: infer Tag })[]
      ? Tag[] | string[]
      : string[]
    : string[]

  security?:
  T extends { components: infer C }
    ? C extends { securitySchemes: infer S }
      ? { [SecurityName in keyof S]?: string[] }[]
      : SecurityRequirementObject[]
    : SecurityRequirementObject[]
}

export type ApiRegisterOptions = Pick<
  Partial<OpenAPI3>,
  'paths' | 'components' | 'security' | 'servers' | 'info' | 'tags'
>
