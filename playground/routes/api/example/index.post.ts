defineApiRouteMeta(
  '/api/example',
  {
    method: 'post',
    summary: 'Create data',
    description: '# Create Example',
  },
)

export default defineEventHandler(() => createApiResponse())
