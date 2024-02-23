interface ResponseType {
  index: number
  text: string
  status: boolean
}

defineApiRouteMeta(
  '/api/example/:id',
  {
    description: '# GET Example',
    summary: 'Get data by id',
    response: {
      $ref: '#/components/schemas/ExampleData',
    },
  },
)

export default defineEventHandler(() => createApiResponse({
  index: 0,
  text: 'text',
  status: true,
} satisfies ResponseType))
