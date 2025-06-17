import swaggerJSDoc from 'swagger-jsdoc';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { loginSchema } from '../validators/authValidator';
import { submitInspectionSchema } from '../validators/inspectionValidator';

const loginReq = zodToJsonSchema(loginSchema, { name: 'LoginRequest' });
const submitInspectionReq = zodToJsonSchema(submitInspectionSchema, { name: 'SubmitInspection' });

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DVI API',
      version: '1.0.0',
      description: 'Digital Vehicle Inspection API',
    },
    components: {
      schemas: {
        LoginRequest: loginReq,
        LoginResponse: {
          type: 'object',
          required: ['mechanicId', 'name', 'role', 'token'],
          properties: {
            mechanicId: { type: 'number' },
            name: { type: 'string' },
            role: { type: 'string' },
            token: { type: 'string' },
          },
        },
        WorkOrder: {
          type: 'object',
          required: [
            'estimateNo',
            'firstName',
            'lastName',
            'carYear',
            'make',
            'model',
            'engineType',
            'license',
            'status',
            'date',
          ],
          properties: {
            estimateNo: { type: 'number' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            carYear: { type: 'string' },
            make: { type: 'string' },
            model: { type: 'string' },
            engineType: { type: 'string' },
            license: { type: 'string' },
            status: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
          },
        },
        LineItem: {
          type: 'object',
          required: ['id', 'partNumber', 'description'],
          properties: {
            id: { type: 'number' },
            partNumber: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', nullable: true },
            reason: { type: 'string', nullable: true },
            photo: { type: 'string', nullable: true },
          },
        },
        SubmitInspection: submitInspectionReq,
      },
    },
  },
  apis: ['../routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
