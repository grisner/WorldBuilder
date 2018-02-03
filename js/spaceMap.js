/**
 * Created by Jerome on 09-11-16.
 */

// A space map is a custom data struture, similar to a sparse 2D array. Entities are stored according to their coordinates;
// that is, two keys are needed to fetch entities, the x position and the y position. This allows fast look-up based on position.
function spaceMap(){}

spaceMap.prototype.add = function(x,y,object,z){
    if(!z) { z = 0;}
    if(!this.hasOwnProperty(x)){
        this[x] = {};
    }
    if(!this[x].hasOwnProperty(y)){
        this[x][y] = {};
    }
    if(!this[x][y].hasOwnProperty(z)){
        this[x][y][z] = [];
    }
    this[x][y][z].push(object);
};

// if no c we presume only one map
spaceMap.prototype.delete = function(x,y,object,z){
    if(!z) {z = 0;}
    if(!this.hasOwnProperty(x) ||!this[x].hasOwnProperty(y) ||!this.hasOwnProperty(z) ) return;    
    var idx = this[x][y][z].indexOf(object);
    if (idx >= 0) this[x][y][z].splice( idx, 1 );
};

// At this time we only accept movement in 2d
spaceMap.prototype.move = function(x1,y1,x2,y2,object){
    this.delete(x1,y1,object);
    this.add(x2,y2,object);
};

spaceMap.prototype.get = function(x,y,z){
    if(!z) {z = 0;}
    if(!this.hasOwnProperty(x)){
        return null;
    }
    if(!this[x].hasOwnProperty(y)){
        return null;
    }
    return this[x][y][z];
};

spaceMap.prototype.getFirst = function(x,y,z){
    //if(!c){c = 0;}
    var objects = this.get(x,y,z);
    return (objects ? objects[0] : null);
};

spaceMap.prototype.getFirstFiltered = function(x,y,filters,notFilters,z){
    // filters is an array of property names that need to be true
    // notFilters is an array of property names that need to be false
    // Returns the first entity at the given position, for which the values in filters are true and the values in notFilters are false
    // e.g. return the first item on a given cell that is visible but is not a chest
    if(notFilters === undefined) notFilters = [];
    var objects = this.get(x,y,z);
    if(!objects) return null;
    for(var o = 0; o < objects.length; o++){
        var ok = true;
        for(var f = 0; f < filters.length; f++){
            if(!objects[o][filters[f]]) {
                ok = false;
                break;
            }
        }
        if(!ok) return null;
        for(var f = 0; f < notFilters.length; f++){
            if(objects[o][notFilters[f]]) {
                ok = false;
                break;
            }
        }
        if(ok) return objects[o];
    }
    return null;
};

spaceMap.prototype.getAll = function(fnCall){
    var l = [];
    for(var i = 0; i < Object.keys(this).length; i++) { // NB: If use forEach instead, "this" won't refer to the object!
        var x = Object.keys(this)[i];
        if (this.hasOwnProperty(x)) {
            for(var j = 0; j < Object.keys(this[x]).length; j++) {
                var y = Object.keys(this[x])[j];
                if (this[x].hasOwnProperty(y)){
                    for(var m=0; m < Object.keys(this[x][y]).length; m++) {
                        var z = Object.keys(this[x][y])[m];
                        if(this[x][y].hasOwnProperty(z)){
                            if(fnCall){
                                for(var k = 0; k < this[x][y][z].length; k++){
                                    l.push(this[x][y][z][k][fnCall]());
                                }
                            }else {
                                l = l.concat(this[x][y][z]);
                            }
                        }
                    }
                }
            }
        }
    }
    return l;
};

if (typeof window === 'undefined') {
    module.exports.spaceMap = spaceMap;
}
