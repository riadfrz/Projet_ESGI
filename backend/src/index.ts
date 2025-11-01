import { configureRateLimiter, errorHandlerMiddleware, httpLoggerMiddleware } from '@/middleware';
import dotenv from 'dotenv';
import Fastify, { FastifyInstance } from 'fastify';
import { corsConfig } from './config/cors';
import prisma from './config/prisma';
import { registerRoutes } from './routes/registerRoutes';
import { initSwagger } from './utils/swaggerUtils';

// Chargement des variables d'environnement
dotenv.config();

/**
 * Fonction pour construire et configurer l'instance Fastify
 */
export const buildApp = async (): Promise<FastifyInstance> => {
  const app = Fastify({
    logger: false,
  });

  // Plugins
  corsConfig(app);
  configureRateLimiter(app);
  errorHandlerMiddleware(app);
  initSwagger(app);

  // Middleware de log
  app.addHook('preHandler', httpLoggerMiddleware);

  // Enregistrement des routes
  registerRoutes(app);

  // Route de base
  app.get('/', async () => {
    return { message: "Bienvenue sur l'API Fastify avec Prisma et MySQL." };
  });

  // Initialisation de Minio

  // Initialisation des paramètres de l'application

  return app;
};

/**
 * Fonction pour démarrer le serveur
 */
const startServer = async () => {
  const app = await buildApp();
  const port = parseInt(process.env.PORT || '3000', 10);
  const env = process.env.NODE_ENV;

  try {
    // Utiliser 'localhost' plutôt que '0.0.0.0' pour le débogage
    await app.listen({ port, host: 'localhost' });
    console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
    console.log(`💻 Environnement: ${env || 'development'}`);


  } catch (err) {
    console.error('Erreur lors du démarrage du serveur:', err);
    app.log.error(err);
    process.exit(1);
  }
};

// Ne démarrer le serveur que si ce fichier est exécuté directement
if (require.main === module) {
  startServer();
}
