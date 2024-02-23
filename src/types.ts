import type { ComponentsObject, OpenAPI3, OperationObject, PathItemObject, ReferenceObject, SecurityRequirementObject } from 'openapi-typescript'

export type ReferenceRef<T extends ComponentsObject> = {
  [K in keyof T]: T[K] extends object ? `#/components/${K & string}/${keyof T[K] & string}` : never
}[keyof T]

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

export type PathOperationItem<T extends OpenApiRegisterConfig = Required<OpenApiRegisterConfig>> = Omit<OperationObject, 'security' | 'tags'> & {
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

export type OpenApiRegisterConfig = Pick<Partial<OpenAPI3>, 'paths' | 'components' | 'security' | 'servers' | 'info' | 'tags'>
