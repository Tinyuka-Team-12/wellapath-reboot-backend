import swaggerJSDoc from 'swagger-jsdoc'


const version = '1.0.0'
const title = 'WellaPath Backend API'
const description = 'API for WellaPath (auth via AWS Cognito, geo via Nominatim).'

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: { title, version, description },
    servers: [{ url: 'http://localhost:4000', description: 'Local' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description:
            'Paste an AWS Cognito ID/Access token. Issuer must match your pool and audience = App Client ID.'
        }
      },
      schemas: {
        // Minimal shared schemas we use now
        SymptomReport: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            description: { type: 'string' },
            severity: { type: 'string', enum: ['mild', 'moderate', 'severe'] },
            gender: { type: 'string', nullable: true },
            yearOfBirth: { type: 'integer', nullable: true },
            meta: { type: 'object', nullable: true, additionalProperties: true },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Clinic: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            lat: { type: 'number' },
            lng: { type: 'number' },
            address: { type: 'string', nullable: true },
            premium: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Pharmacy: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            lat: { type: 'number' },
            lng: { type: 'number' },
            address: { type: 'string', nullable: true },
            premium: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  // Scan route files for @openapi JSDoc blocks
  apis: ['src/routes/*.ts', 'src/controllers/*.ts']
})
