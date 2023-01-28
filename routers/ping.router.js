import { APIRouter } from '../core/blazingAPI.js';

export const pingRouter = new APIRouter('/ping');

pingRouter.get('', () => {
    return {
        message: 'hello world'
    };
});

pingRouter.post('', data => {
    return {
        message: `data recieved ${data}`
    };
});