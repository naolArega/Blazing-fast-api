import { APIRouter } from '../core/blazingAPI.js';

export const pingRouter = new APIRouter('/ping');

pingRouter.get('', () => {
    return {
        message: 'hello world'
    };
});