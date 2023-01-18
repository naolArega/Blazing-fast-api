import { APIRouter } from './router.js';
import { info, warn, error } from '../logger.js';
import { createServer, IncomingMessage } from 'node:http';

export class BlazingAPI {
    #host = '0.0.0.0';
    #port = 80;
    /**
     * @type {{path:string, method: string, handler: (...params: unknown) => unknown}[]}
     */
    #routes = [];

    /**
     * 
     * @param {{host: string?, port: number?, argv: string[]?}?} options 
     */
    constructor(options) {
        if(options.host) {
            this.#host = options.host;
        } 

        if(options.port) {
            this.#port = options.port;
        }
    }


    /**
     * 
     * @param {APIRouter} router
     */
    includeRouter(router) {
        this.#routes.push(...router.routes);
    }

    /**
     * 
     */
    async listen() {
        return new Promise((resolve, reject) => {
            const server = createServer();

            server.addListener('listening', () => {
                info`Server is starting on \"${this.#host}:${this.#port}\"`;
            });

            server.addListener('request', (req, res) => {
                const route = this.#routes.find(route => {
                    if(route.path == req.url &&
                        route.method == req.method) {
                        return true;
                    }
                    return false;
                });

                res.setHeader('Server', 'BlazingAPI');

                if(route) {
                    try {
                        const request = req.read();
                        const response = route.handler(request);
                        if(typeof response == 'object') {
                            res.setHeader('Content-Type', 'application/json');
                            res.write(JSON.stringify(response));
                        } else {
                            res.setHeader('Content-Type', 'text/plain');
                            res.write(response.toString());
                        }
                        info`${req.method} | ${req.url} | [200]`;
                    } catch(e) {
                        error`${req.method} | ${req.url} | something went wrong | [500]`;
                        res.writeHead(500);
                        res.write('Something went wrong');
                    }
                } else {
                    warn`${req.method} | ${req.url} | route not found | [400]`;
                    res.writeHead(404);
                    res.write('Path not found')
                }
                res.end();
            });

            server.addListener('error', () => {
                reject('Something went wrong with server');
            });

            server.addListener('close', () => {
                resolve('Server is closed');
            });

            server.listen(this.#port, this.#host);
        });
    }
}