import { Application, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import basicAuth from 'express-basic-auth';
import logger from '../config/logger';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bediapottery API',
      version: '1.0.0',
      description: 'backend API for Bediapottery platform',
    },
  },
  apis: ['./swaggerdocs/*.yaml'],
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app: Application) {
  // Basic authentication middleware
  const authMiddleware = basicAuth({
    users: {
      admin: process.env.SWAGGER_PASSWORD as string, // Replace with your desired username and password
    },
    challenge: true, // Show authentication dialog
    realm: 'Bediapottery API Docs',
  });

  // Apply authentication to Swagger routes
  app.use('/api/docs', authMiddleware, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get('/docs.json', authMiddleware, (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  logger.info('Docs available at /api/docs (password-protected)');
}

export default setupSwagger;
