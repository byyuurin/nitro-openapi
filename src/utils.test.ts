import { expect, it } from 'vitest'
import { toExampleSchema } from './utils'

it('transform example to schema object', () => {
  expect(toExampleSchema('foo', 'string value', { enum: ['foo', 'bar'] })).toMatchInlineSnapshot(`
    {
      "description": "string value",
      "enum": [
        "foo",
        "bar",
      ],
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

  expect(toExampleSchema({ foo: 'bar' }, { foo: 'foo description' }, { nullable: true })).toMatchInlineSnapshot(`
    {
      "example": {
        "foo": "bar",
      },
      "nullable": true,
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
    { description: 'Description for array' },
  )).toMatchInlineSnapshot(`
    {
      "description": "Description for array",
      "example": [
        {
          "boo": true,
          "num": 100,
          "str": "string",
        },
      ],
      "items": {
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
