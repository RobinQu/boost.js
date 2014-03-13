(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        //Allow using this built library as an AMD module
        //in another project. That other project will only
        //see this AMD call, not the internal modules in
        //the closure below.
        define("boost", [], factory);
    } else {
        //Expose boost globally if AMD is not present
        root.boost = factory();
    }
}(this, function () {
