import swaggerJSDoc from 'swagger-jsdoc'

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: { title: 'WellaPath Backend API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:4000', description: 'Local' }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } }
    }
  },
  apis: ['src/routes/*.ts', 'src/controllers/*.ts'] // <- important glob
})
