export class APIRouter {
    #prefix = null;
    #routes = [];

    /**
     * 
     * @param {string?} prefix 
     */
    constructor(prefix) {
        this.#prefix = prefix;
    }

    /**
     * 
     * @returns {{path: string, method: string, handler: (...params: unknown) => unknown}[]}
     */
    get routes() {
        return this.#routes;
    }

    /**
     * 
     * @param {string} path 
     * @param {() => unknown} handler 
     */
    get(path, handler) {
        this.#registerPathHandler(path, 'GET', handler);
    }

    /**
     * 
     * @param {string} path 
     * @param {(data?: unknown) => unknown} handler 
     */
    post(path, handler) {
        this.#registerPathHandler(path, 'POST', handler);
    }
    
    /**
     * 
     * @param {string} path 
     * @param {(data?: unknown) => unknown} handler 
     */
    put(path, handler) {
        this.#registerPathHandler(path, 'PUT', handler);
    }

    /**
     * 
     * @param {string} path 
     * @param {(data?: unknown) => unknown} handler 
     */
    delete(path, handler) {
        this.#registerPathHandler(path, 'DELETE', handler);
    }

    /**
     * 
     * @param {string} path 
     * @param {(data?: unknown) => unknown} handler 
     */
    patch(path, handler) {
        this.#registerPathHandler(path, 'PATCH', handler);
    }

    /**
     * 
     * @param {string} path 
     * @param {() => unknown} handler 
     */
    head(path, handler) {
        this.#registerPathHandler(path, 'HEAD', handler);
    }

    /**
     * 
     * @param {string} path 
     * @param {'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD'} method 
     * @param {(data?: unknown) => unknown} handler 
     */

    #registerPathHandler(path, method, handler) {
        if(this.#prefix) {
            path = this.#prefix + path;
        }
        this.#routes.push({
            path,
            method,
            handler
        })
    }
}