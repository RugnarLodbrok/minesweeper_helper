const Generator = Object.getPrototypeOf(function* () {
});
Generator.prototype.xmap = function* (mapper, thisArg) {
    for (const val of this) {
        yield mapper.call(thisArg, val);
    }
};
Generator.prototype.map = function (mapper, thisArg) {
    return this.xmap(mapper, thisArg).array();
};

Generator.prototype.exhaust = function (thisArg) {
    for (const val of this) {
    }
};

Generator.prototype.array = function (thisArg) {
    return Array.from(this);
};
