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

let add = (a, b) => a + b;


function* zip(...arrays) {
    let len = Math.min(...arrays.map((a) => a.length))

    for (let i = 0; i < len; ++i)
        yield arrays.map((a) => a[i]);
}

// let item, iterator = gen();
//
// while (item = iterator.next(), !item.done) {
//     console.log(item.value);
// }
