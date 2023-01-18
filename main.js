import { pingRouter } from './routers/ping.router.js';
import { BlazingAPI } from './core/blazingAPI.js';

(async function main(argv) {
    const app = new BlazingAPI({
        port: 8080,
        argv
    });

    app.includeRouter(pingRouter);

    try {
        await app.listen();
    } catch(e) {
        console.error(e);
    }
})(process.argv);