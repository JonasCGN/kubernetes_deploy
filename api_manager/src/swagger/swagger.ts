import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KUA API Manager',
      version: '1.0.0',
      description: 'API para gerenciamento de restaurante - pedidos, produtos, insumos e notificações',
      contact: {
        name: 'Kua Tech',
        email: 'contato@kuatech.com'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'Servidor de desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        basicAuth: {
          type: 'http',
          scheme: 'basic'
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT do Supabase (acessToken)'
        }
      },
      schemas: {
        Produto: {
          type: 'object',
          properties: {
            id_produto: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Pizza Margherita' },
            preco: { type: 'number', format: 'float', example: 25.90 },
            categoria: { type: 'string', example: 'Pizza' },
            disponibilidade: { type: 'boolean', example: true },
            path_image: { type: 'string', example: '/images/pizza_margherita.jpg' }
          }
        },
        Insumo: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Tomate' },
            categoria: { type: 'string', example: 'lanche' },
            preco: { type: 'number', format: 'float', example: 100.5 }
          }
        },
        Mesa: {
          type: 'object',
          properties: {
            id_mesa: { type: 'integer', example: 1 },
            numero: { type: 'integer', example: 5 },
            disponivel: { type: 'boolean', example: true }
          }
        },
        Pedido: {
          type: 'object',
          properties: {
            id_pedido: { type: 'integer', example: 1 },
            cliente_nome: { type: 'string', example: 'João Silva' },
            telefone: { type: 'string', example: '(11) 99999-9999' },
            endereco: { type: 'object' },
            total: { type: 'number', format: 'float', example: 45.80 },
            status: { type: 'string', example: 'pendente' },
            data_pedido: { type: 'string', format: 'date-time' }
          }
        },
        Usuario: {
          type: 'object',
          properties: {
            uid: { type: 'string', example: 'firebase_uid_123' },
            nome: { type: 'string', example: 'Admin User' },
            email: { type: 'string', example: 'admin@exemplo.com' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Mensagem de erro' }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'], // caminho para os comentários JSDoc
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
