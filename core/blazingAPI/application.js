import { APIRouter } from './router.js';
import { createServer } from 'node:http';
import { info, warn, error } from '../logger.js';

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

            server.addListener('error', error => {
                reject({
                    message: 'Something went wrong with server ',
                    error
                });
            });

            server.addListener('close', () => {
                resolve('Server is closed');
            });

            server.addListener('request', (req, res) => {
                const url = new URL(`http://server${req.url}`);
                const route = this.#routes.find(route => {
                    if(route.path == url.pathname &&
                        route.method == req.method) {
                        return true;
                    }
                    return false;
                });

                res.setHeader('Server', 'BlazingAPI');

                if(route) {
                    let requestBody = null;

                    req.on('end', () => {
                        try {
                            let response = null;
                            if(["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
                                let handlerArgs = null;
                                if(req.headers['content-type'] == "application/json") {
                                    handlerArgs = JSON.parse(requestBody);
                                } else {
                                    handlerArgs = requestBody;
                                }
                                response = route.handler(handlerArgs);
                            } else {
                                response = route.handler();
                            }
                            if(typeof response == 'object') {
                                res.setHeader('Content-Type', 'application/json');
                                res.write(JSON.stringify(response));
                            } else {
                                res.setHeader('Content-Type', 'text/plain');
                                res.write(response.toString());
                            }
                            info`${req.method} | ${url.pathname} | [200]`;
                        } catch(e) {
                            error`${req.method} | ${url.pathname} | something went wrong | [500]`;
                            res.writeHead(500);
                            res.write('Something went wrong');
                        }
                        res.end();
                    });

                    req.on('data', chunk => {
                        if(requestBody != null) {
                            requestBody += chunk;
                        } else {
                            requestBody = chunk;
                        }
                    });
                } else {
                    warn`${req.method} | ${url.pathname} | route not found | [400]`;
                    res.writeHead(404);
                    res.write('Path not found');
                    res.end();
                }
            });

            server.listen({
                port: this.#port,
                host: this.#host
            }, () => {
                info`Server is starting on \"http://${this.#host}:${this.#port}\"`;
            });
        });
    }
}