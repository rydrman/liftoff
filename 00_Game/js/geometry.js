//////////////////////////
//      VECTOR 2D       //
//////////////////////////

var Vector2 = function( x, y )
{
    this._x = x ? x : 0;
    this._y = y ? y : 0;
    this.lengthInvalid = true;
    this.length();
}

//getters and setters to optimize length stuff
Vector2.prototype = {
    get x(){
        return this._x;
    },
    set x(x){
        this._x = x;
        this.lengthInvalid = true;
    },
    get y(){
        return this._y;
    },
    set y(y){
        this._y = y;
        this.lengthInvalid = true;
    }
}

Vector2.prototype.set = function( x, y )
{
    this.x = x ? x : this.x;
    this.y = y ? y : this.y;
    this.lengthInvalid = true;
    return this;
}

Vector2.prototype.copy = function( vec )
{
    this.x = vec.x;
    this.y = vec.y;
    return this;
}

Vector2.prototype.clone = function()
{
    return new Vector2( this.x, this.y );
}

Vector2.prototype.add = function( vector )
{
    this.x += vector.x;
    this.y += vector.y;
    return this;
}

Vector2.prototype.addVectors = function( vector1, vector2 )
{
    this.x = (vector1.x + vector2.x);
    this.y = (vector1.y + vector2.y);
    return this;
}

Vector2.prototype.sub = function( vector )
{
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
}

Vector2.prototype.subVectors = function( vector1, vector2 )
{
    this.x = (vector1.x - vector2.x);
    this.y = (vector1.y - vector2.y);
    return this;
}

Vector2.prototype.multiplyScalar = function( value )
{
    this.x *= value;
    this.y *= value;
    return this;
}

Vector2.prototype.getMultiplyScalar = function( value )
{
    return new Vector2(this.x * value, this.y * value);
}

Vector2.prototype.normalize = function()
{
    var len = this.length();
    this.x /= len;
    this.y /= len;
    return this;
}

Vector2.prototype.negate = function()
{
    return this.multiplyScalar( -1 );
}

Vector2.prototype.length = function()
{
    if(this.lengthInvalid)
    {
        this._length = Math.sqrt( this.lengthSqd() );
        this.lengthInvalid = false;
    }
    return this._length;
}

Vector2.prototype.lengthSqd = function( value )
{
    return this.x * this.x + this.y * this.y;
}

Vector2.prototype.limit = function( max, min )
{
    var len = this.length();
    if(len > max)
    {
        this.normalize( len );
        this.multScalar( max );
    }
    else if(len < min)
    {
        this.normalize( len );
        this.multScalar( min );
    }
    return this;
}

Vector2.prototype.compare = function( vector )
{
    return ( this.x == vector.x && this.y == vector.y );
}

Vector2.prototype.fromRotation = function( rotation, radius )
{
    // rotation in rads
    this.x = Math.sin(rotation) * -1 * radius;
    this.y = Math.cos(rotation) * radius;
    return this;
}

//////////////////////////
//         LINE         //
//////////////////////////

var Line = function( pointA, pointB )
{
    this.a = pointA ? pointA : new Vector2();
    this.b = pointB ? pointB : new Vector2();
    this.length();
}

Line.prototype.length = function()
{
    this._length = Math.sqrt( Math.pow(this.a.x - this.b.x, 2) + Math.pow(this.a.y - this.b.y, 2) );
    return this._length;
}

Line.prototype.getPosition = function( perc )
{
    return new Vector2( this.a.x + (this.b.x - this.a.x) * perc, this.a.y + (this.b.y - this.a.y) * perc );
}

//////////////////////////
//         PATH         //
//////////////////////////

var Path = function( lines )
{
    this.lines = lines ? lines : [];
    this.length();
}

Path.prototype.length = function()
{
    this._length= 0;
    for(var i in this.lines)
        this._length += this.lines[i].length();

    return this._length;
}

Path.prototype.Add = function( line )
{
    this.lines.push(line);
    this.length();
}

Path.prototype.getPosition = function( perc )
{
    var dist = this._length * perc;

    var curDist = 0;
    for(var i in this.lines)
    {
        if(curDist + this.lines[i].length() > dist)
        {
            var linePerc = (dist - curDist) / this.lines[i].length();

            return this.lines[i].getPosition( linePerc ); 
        }

        curDist += this.lines[i].length();
    }
    return null;
}

//////////////////////////
//       RECTANGLE      //
//////////////////////////

var Rectangle = function(x, y, w, h)
{
    this.x = x ? x : 0;
    this.y = y ? y : 0;
    this.w = w ? w : 0;
    this.h = h ? h : 0;
}

Rectangle.prototype = {
    get center(){
        return new Vector2(
            this.x + this.w * 0.5,
            this.y + this.h * 0.5
        );
    }
}

Rectangle.prototype.contains = function( vector )
{
    return (   vector.x >= this.x 
            && vector.x <= this.x + this.w
            && vector.y >= this.y
            && vector.y <= this.y + this.h );
}

Rectangle.prototype.distanceTo = function( vector )
{
    if(this.contains(vector)) return 0;
    
    var edges = [];
    //top 
    edges.push( this.y - vector.y );
    //right
    edges.push( vector.x - (this.x + this.w) );
    //bottom
    edges.push( vector.y - (this.y + this.h) );
    //left
    edges.push( this.x - vector.x );
    
    for(var i = 0; i < edges.length; ++i)
    {
        var amount = (i % 2 == 0) ? this.h : this.w; 
        
        if( edges[i] < 0)
        {
            var dist = Math.abs( edges[i] );
            edges[i] = (dist > amount) ? dist - amount : 0;
        }
    }
    
    var distances = [];
    
    for(var i = 0; i < edges.length; ++i)
    {
        var j = i + 1;
        if(j == edges.length) j = 0;

        //if(edges[i] < 0 && edges[j] < 0)  
        //    continue;
        distances.push( Math.sqrt( edges[i] * edges[i] + edges[j] * edges[j] ) );
    }
    
    distances.sort(function(a, b){return a-b});
    return distances[0];
}