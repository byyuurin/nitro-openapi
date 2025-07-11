import defu from 'defu'
import type { OpenAPI3, PathItemObject } from 'openapi-typescript'
import type { ApiRegisterOptions, OperationType, PathOperation } from './types'

export function createOpenApiRegister<T extends ApiRegisterOptions = ApiRegisterOptions>(
  options: T,
) {
  const { paths = {}, components = {}, security = [], servers = [], info, tags = [] } = options

  const defineOperation = (operation: OperationType<T>) => operation

  function register(
    route: string,
    routeOperation: OperationType<T>,
    method: keyof PathOperation = 'get',
  ) {
    const path = normalizeRoute(route)

    paths[path] = {
      ...paths[path],
      [method]: routeOperation,
    }
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
  appends: ApiRegisterOptions,
): Partial<OpenAPI3> {
  const { info } = appends
  const { openapi, servers, security, tags, paths = {} } = defaults

  for (const path in paths) {
    const operations = paths[path]
    const operationsAppend = appends.paths?.[path] ?? {}

    if ('$ref' in operationsAppend) {
      paths[path] = operationsAppend
      continue
    }

    if ('$ref' in operations)
      continue

    paths[path] = Object.fromEntries(Object.entries(operations).map(([method, operation]) => {
      const extendOperation = operationsAppend[method as keyof PathItemObject] ?? {}
      return [method, defu(operation, extendOperation)]
    }))
  }

  return {
    openapi,
    info,
    servers,
    security,
    tags,
    ...defu(defaults, appends),
    paths,
  }
}
