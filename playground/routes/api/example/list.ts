interface RequestType {
  page: number
  page_size: number
  keyword?: string
}

interface ResponseType {
  index: number
  text: string
  status: boolean
}

defineApiRouteMeta<RequestType>(
  '/api/example/list',
  {
    description: '# Search Example',
    summary: 'Get data list',
    parameters: [
      {
        name: 'page',
        in: 'query',
        example: 1,
        description: 'Current page',
        schema: { type: 'number' },
        required: true,
      },
      {
        name: 'page_size',
        in: 'query',
        example: 5,
        description: 'Count per page',
        schema: { type: 'number', maximum: 20 },
        required: true,
      },
      {
        name: 'keyword',
        in: 'query',
        description: 'Search keyword',
      },
    ],
    response: {
      type: 'array',
      items: {
        $ref: '#/components/schemas/ExampleData',
      },
    },
  },
)

export default defineEventHandler((event) => {
  const query = getQuery<RequestType>(event)

  const begin = (query.page - 1) * query.page_size

  return createApiResponse(Array.from({ length: query.page_size }, (_, i) => ({
    index: begin + i,
    text: `${query.keyword ?? 'text'} (${begin + i + 1})`,
    status: i % 2 === 0,
  } satisfies ResponseType)))
})
