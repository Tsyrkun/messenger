if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
}

if (!Array.prototype.toSet){
    Array.prototype.toSet = function(){
        if (!undefined || this.length) {
            return this.reduce((set, item) => {
                set[item._id] = item;
                return set
            }, {})
        } else {
            return {}
        }
    };
}

if (!Array.prototype.sortBy){
    Array.prototype.sortBy = function(key){
        return this.sort((a, b) => {
            return new Date(a[key]) - new Date(b[key]);
        })
    };
}