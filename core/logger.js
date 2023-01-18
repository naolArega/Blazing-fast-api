/**
 * 
 * @param {string[]} templates 
 * @param  {...any} values 
 */
function info(templates, ...values) {
    log('INFO', templates, values);
}

/**
 * 
 * @param {string[]} templates 
 * @param  {...any} values 
 */
function warn(templates, ...values) {
    log('WARN', templates, values);
}

/**
 * 
 * @param {string[]} templates 
 * @param  {...any} values 
 */
function error(templates, ...values) {
    log('ERROR', templates, values);
}

/**
 * 
 * @param {string} type 
 * @param {string[]} templates 
 * @param {any[]} values 
 */
function log(type, templates, values) {
    let message = `[${type}]\t`;
    templates.forEach((template, index) => {
        message += template;
        if(index < values.length) {
            message += values[index];
        }
    });
    console.log(message);
}

export {
    info,
    warn,
    error
};