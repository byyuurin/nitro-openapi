# @byyuurin/nitro-openapi

> WIP

## Install

```bash
npm i -D @byyuurin/nitro-openapi
```

## Usage

Enable openApi

```ts
// nitor.config.ts
export default defineNitroConfig({
  experimental: {
    openAPI: true,
  },
})
```

Create nitor plugin:

```ts
// plugins/swagger.ts
import { createOpenApiRegister } from '@byyuurin/nitro-openapi'
import type { OpenAPI3 } from 'openapi-typescript'

export const { register, merge, configExtends } = createOpenApiRegister({
  // ...
})

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('beforeResponse', (event, context) => {
    if (!/openapi.json/.test(event.path))
      return

    // merge config
    const config = context.body as OpenAPI3
    context.body = merge(config)
  })
})
```

Auto import

```ts
// utils/swagger.ts
export { register } from '../plugins/swagger'
```

Or custom register

```ts
// utils/swagger.ts
import type { PathOperationItem, PathOperationMethod } from '@byyuurin/nitro-openapi'
import type { InternalApi } from 'nitropack'
import type { configExtends } from '../plugins/swagger'
import { register } from '../plugins/swagger'

type RouteMeta = PathOperationItem<typeof configExtends> & {
  method?: PathOperationMethod
}

export function defineRouteMeta(
  route: keyof InternalApi,
  meta: RouteMeta,
) {
  const { method, ...operation } = meta
  register(route, operation, method)
}
```

Then use the register

```ts
// route/**/*.ts

defineRouteMeta('/api/...', {
  /* ... */
})

export default defineEventHandler(() => {
  /* ... */
})
```
