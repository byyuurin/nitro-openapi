defineApiResponse('/api/example/form', {
  method: 'post',
  summary: 'Create data (multipart/form-data)',
  parameters: [
    {
      name: 'descriptions',
      in: 'query',
      description: 'File descriptions',
      allowEmptyValue: false,
      schema: toExampleSchema(['upload some file'], ''),
    },
  ],
  requestBody: {
    content: {
      'multipart/form-data': {
        schema: {
          type: 'object',
          properties: {
            files: {
              type: 'array',
              items: {
                type: 'string',
                format: 'binary',
                description: 'file',
              },
            },
          },
        },
        encoding: {
          files: {
            style: 'form',
          },
        },
      },
    },
  },
})

export default defineEventHandler(() => createApiResponse())
