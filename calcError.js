// Express Error Class for more dynamic and responsive errors
class CalcError extends Error {
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;

        // JS Error Object has stack property.
        console.log(this.stack);
    }
}

module.exports = CalcError;