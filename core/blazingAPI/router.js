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
     * @param {(req: Request, res: Response) => unknown} handler 
     */
    get(path, handler) {
        if(this.#prefix) {
            path = this.#prefix + path;
        }
        this.#routes.push({
            path,
            method: 'GET',
            handler
        });
    }

    /**
     * 
     * @param {string} path 
     * @param {(req: Request, res: Response) => unknown} handler 
     */
    post(path, handler) {
        if(this.#prefix) {
            path = this.#prefix + path;
        }
        this.#routes.push({
            path,
            method: 'POST',
            handler
        })
    }
}