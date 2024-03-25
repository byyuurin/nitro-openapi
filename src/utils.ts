import type { ArraySubtype, ObjectSubtype, SchemaObject } from 'openapi-typescript'
import type { MaybeValueOrObject } from './types'

type SchemaObjectOptions = SchemaObject & {
  allowExample?: boolean
}

export function resolveSchemaObject(
  value: any,
  options: SchemaObjectOptions = {},
): SchemaObject {
  const { allowExample = true, ...defaults } = options || {}

  const resolveResult = (obj: SchemaObject, example?: unknown) => {
    if (allowExample && example != null)
      obj.example = example

    return { ...defaults, ...obj }
  }

  if (Array.isArray(value)) {
    return resolveResult(
      {
        type: 'array',
        items: resolveSchemaObject(value[0], { allowExample: false }),
      },
      value,
    )
  }

  const _type = typeof value

  switch (_type) {
    case 'function':
    case 'symbol':
    case 'undefined':
      return { type: 'null' }
    case 'object':
      return resolveResult(
        {
          type: 'object',
          properties: Object.fromEntries(Object.entries(value).map(([k, v]) => [
            k,
            resolveSchemaObject(v, {
              allowExample: false,
            }),
          ])),
        },
        value,
      )
    case 'bigint':
      return resolveResult(
        { type: 'integer' },
        value,
      )
    case 'string':
      return resolveResult(
        { type: 'string' },
        value || null,
      )
    default:
      return resolveResult(
        { type: _type },
        value,
      )
  }
}

type ExampleDescription<ExampleT> = MaybeValueOrObject<ExampleT, string>

export function toExampleSchema<T = any>(
  example: T,
  description?: ExampleDescription<T>,
  options?: SchemaObject,
) {
  if (typeof example !== 'object') {
    return resolveSchemaObject(
      example,
      typeof description === 'string' ? { ...options, description } : {},
    )
  }

  if (Array.isArray(example)) {
    if (typeof description === 'string')
      return resolveSchemaObject(example, { ...options, description })

    const schema = resolveSchemaObject(example, { allowExample: false }) as SchemaObject & ArraySubtype
    schema.items = toExampleSchema(example[0], description, options)

    return schema
  }

  if (typeof description === 'string')
    return resolveSchemaObject(example, { ...options, description })

  const schema = resolveSchemaObject(example, options) as SchemaObject & ObjectSubtype

  schema.properties = Object.fromEntries(Object.entries(schema.properties!)
    .map(([p, item]) => [p, {
      ...item,
      ...typeof description === 'object' ? { description: (description as any)?.[p] } : {},
    }]))

  return schema
}
