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
    response: toExampleSchema<ResponseType>(
      {
        index: 0,
        text: 'text',
        status: false,
      },
      {
        index: 'Number value',
        text: 'Text value',
        status: 'true or false',
      },
    ),
  },
)

export default defineEventHandler(() => createApiResponse({
  index: 0,
  text: 'text',
  status: true,
} satisfies ResponseType))
