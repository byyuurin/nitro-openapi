defineApiRouteMeta(
  '/api/example/:id',
  {
    method: 'put',
    summary: 'Update data by id',
    description: '# Update Example',
  },
)

export default defineEventHandler(() => createApiResponse())
