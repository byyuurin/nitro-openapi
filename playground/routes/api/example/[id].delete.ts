defineApiRouteMeta(
  '/api/example/:id',
  {
    method: 'delete',
    summary: 'Delete data by id',
    description: '# Delete Example',
  },
)

export default defineEventHandler(() => createApiResponse())
