class Check {
    constructor(options) {
        this.name = options.name;
        this.description = options.description;
        this.run = options.run;
        this.optional = options.optional;
    }
}

module.exports = Check;