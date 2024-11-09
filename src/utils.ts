import { defu } from 'defu'
import type { ExampleDescription, SchemaObjectType } from './types'

export function toExampleSchema<T>(
  example: T,
  description: ExampleDescription<T> | undefined,
  options: Partial<Omit<SchemaObjectType<T>, 'type' | 'example'> & { withExample?: boolean }> = {},
): SchemaObjectType<T> {
  const { withExample = true, ...overrides } = options

  const createSchemaObject = <T extends SchemaObjectType<any>>(schema: T) => {
    const merged: SchemaObjectType<any> = {
      ...schema,
      ...typeof description === 'string' && description !== '' ? { description } : {},
      ...withExample ? { example } : {},
      ...overrides,
    }

    return merged
  }

  let schema = createSchemaObject({
    type: 'null',
  })

  if (typeof example === 'number') {
    schema = createSchemaObject({
      type: 'number',
    })
  }

  if (typeof example === 'string') {
    schema = createSchemaObject({
      type: 'string',
    })
  }

  if (typeof example === 'boolean') {
    schema = createSchemaObject({
      type: 'boolean',
    })
  }

  if (typeof example === 'object' && example !== null) {
    if (Array.isArray(example)) {
      const value = typeof example[0] === 'object' ? defu({}, ...example) : example[0]

      schema = createSchemaObject({
        type: 'array',
        items: toExampleSchema(value, typeof description === 'string' ? '' : description as any, { withExample: false }),
      })
    }
    else {
      schema = createSchemaObject({
        type: 'object',
        properties: Object.fromEntries(Object.entries(example).map(([k, v]) => {
          const _description = typeof description === 'object' ? (description as any)[k] : description
          return [k, toExampleSchema(v, _description, { withExample: false })]
        })),
      })
    }
  }

  return schema as SchemaObjectType<T>
}
