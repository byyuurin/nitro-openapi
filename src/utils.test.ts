import { expect, it } from 'vitest'
import { resolveSchemaObject, toExampleSchema } from './utils'

it('check transform cases', () => {
  expect(resolveSchemaObject(0)).toMatchInlineSnapshot(`
    {
      "example": 0,
      "type": "number",
    }
  `)

  expect(resolveSchemaObject('text')).toMatchInlineSnapshot(`
    {
      "example": "text",
      "type": "string",
    }
  `)

  expect(resolveSchemaObject(false)).toMatchInlineSnapshot(`
    {
      "example": false,
      "type": "boolean",
    }
  `)

  expect(resolveSchemaObject([0, 1, 2])).toMatchInlineSnapshot(`
    {
      "example": [
        0,
        1,
        2,
      ],
      "items": {
        "type": "number",
      },
      "type": "array",
    }
  `)

  expect(resolveSchemaObject({
    text: 'hello',
    boolean: false,
    index: 1,
  })).toMatchInlineSnapshot(`
    {
      "example": {
        "boolean": false,
        "index": 1,
        "text": "hello",
      },
      "properties": {
        "boolean": {
          "type": "boolean",
        },
        "index": {
          "type": "number",
        },
        "text": {
          "type": "string",
        },
      },
      "type": "object",
    }
  `)

  expect(resolveSchemaObject(Array.from({ length: 2 }, (_, i) => ({
    text: `hello ${i}`,
    boolean: i % 2 === 0,
    index: i,
  })))).toMatchInlineSnapshot(`
    {
      "example": [
        {
          "boolean": true,
          "index": 0,
          "text": "hello 0",
        },
        {
          "boolean": false,
          "index": 1,
          "text": "hello 1",
        },
      ],
      "items": {
        "properties": {
          "boolean": {
            "type": "boolean",
          },
          "index": {
            "type": "number",
          },
          "text": {
            "type": "string",
          },
        },
        "type": "object",
      },
      "type": "array",
    }
  `)
})

it('transform example to schema object', () => {
  expect(toExampleSchema('foo', 'string value')).toMatchInlineSnapshot(`
    {
      "description": "string value",
      "example": "foo",
      "type": "string",
    }
  `)

  expect(toExampleSchema(100, 'number value')).toMatchInlineSnapshot(`
    {
      "description": "number value",
      "example": 100,
      "type": "number",
    }
  `)

  expect(toExampleSchema(true, 'boolean value')).toMatchInlineSnapshot(`
    {
      "description": "boolean value",
      "example": true,
      "type": "boolean",
    }
  `)

  expect(toExampleSchema({ foo: 'bar' }, { foo: 'foo description' })).toMatchInlineSnapshot(`
    {
      "example": {
        "foo": "bar",
      },
      "properties": {
        "foo": {
          "description": "foo description",
          "type": "string",
        },
      },
      "type": "object",
    }
  `)

  expect(toExampleSchema([0, 1], 'number array')).toMatchInlineSnapshot(`
    {
      "description": "number array",
      "example": [
        0,
        1,
      ],
      "items": {
        "type": "number",
      },
      "type": "array",
    }
  `)

  expect(toExampleSchema(
    [{ str: 'string', num: 100, boo: true }],
    { str: 'string', num: 'number', boo: 'boolean' },
  )).toMatchInlineSnapshot(`
    {
      "items": {
        "example": {
          "boo": true,
          "num": 100,
          "str": "string",
        },
        "properties": {
          "boo": {
            "description": "boolean",
            "type": "boolean",
          },
          "num": {
            "description": "number",
            "type": "number",
          },
          "str": {
            "description": "string",
            "type": "string",
          },
        },
        "type": "object",
      },
      "type": "array",
    }
  `)
})
