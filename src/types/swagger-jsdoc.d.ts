declare module 'swagger-jsdoc' {
  type SwaggerDefinition = Record<string, any>
  interface Options {
    definition: SwaggerDefinition
    apis: string[]
  }
  function swaggerJSDoc(opts: Options): any
  export default swaggerJSDoc
}
