import type { OpenAPI3, OperationObject, PathItemObject, ReferenceObject, SecurityRequirementObject } from 'openapi-typescript'

export type ReferenceSchema<T> = Omit<ReferenceObject, '$ref'> & { $ref: T }

export type MaybeReference<T, R = string> = T | ReferenceSchema<R>

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
