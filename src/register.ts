import defu from 'defu'
import type { OpenAPI3, ParameterObject, PathItemObject } from 'openapi-typescript'
import type { MaybeReference, OpenApiRegisterConfig, PathOperationItem, PathOperations, ReferenceRef } from './types'

export function createOpenApiRegister<T extends OpenApiRegisterConfig = OpenApiRegisterConfig>(
  defaults: T,
) {
  const { paths = {}, components = {}, security = [], servers = [], info, tags = [] } = defaults

  const defineOperation = (operation: PathOperationItem<T>) => operation

  function register(
    route: string,
    routeOperation: MaybeReference<PathOperationItem<T>, ReferenceRef<T>>,
    method: keyof PathOperations = 'get',
  ) {
    const _route = normalizeRoute(route)

    paths[_route] = defu(
      { [method]: routeOperation },
      paths[_route],
    )
  }

  function merge(config: Partial<OpenAPI3>) {
    return mergeConfig(
      config,
      {
        paths,
        components,
        security,
        servers,
        info,
        tags,
      },
    )
  }

  return {
    configExtends: {
      paths,
      components,
      security,
      servers,
      info,
      tags,
    } as T,
    defineOperation,
    register,
    merge,
  }
}

// ref: https://github.com/unjs/nitro/blob/1e8910daed9986186da9bab9c2dd87b07e61ecce/src/runtime/routes/openapi.ts#L65-L70
function normalizeRoute(_route: string) {
  let anonymousCtr = 0
  const route = _route
    .replace(/:(\w+)/g, (_, name) => `{${name}}`)
    .replace(/\/(\*)\//g, () => `/{param${++anonymousCtr}}/`)
    .replace(/\*\*{/, '{')
    .replace(/\/(\*\*)$/g, () => `/{*param${++anonymousCtr}}`)

  return route
}

function mergeConfig(
  defaults: Partial<OpenAPI3>,
  appends: OpenApiRegisterConfig,
): Partial<OpenAPI3> {
  const methods = new Set<(keyof PathOperations)>(['delete', 'get', 'head', 'options', 'patch', 'post', 'put', 'trace'])
  const { info } = appends
  const { paths = {} } = defaults

  // fix path parameter validation until removed after nitro updates
  for (const path in paths) {
    const operations = paths[path]

    if ('$ref' in operations)
      continue

    paths[path] = Object.fromEntries(Object.entries(operations).map(([key, obj]) => {
      if (methods.has(key as keyof PathOperations))
        return [key, normalizeSchema(obj)]

      return [key, obj]
    }))
  }

  return defu({ info }, defaults, appends)
}

function normalizeSchema(obj: MaybeReference<PathItemObject>) {
  if ('$ref' in obj)
    return obj

  const { parameters = [] } = obj

  obj.parameters = parameters.map((p) => {
    if ('$ref' in p)
      return p

    return defu(p, {
      schema: { type: 'string' },
    } satisfies Partial<ParameterObject>)
  })

  return obj
}
