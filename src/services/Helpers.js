
// ------------ export class has no ctor, it offers static members only

class Helpers { }

// ------------ static methods exported through class Helper

const sum_reducer = (accum, curr) => accum + curr;
Helpers.sumOf = function (aa) { return aa.reduce(sum_reducer); };

Helpers.averageOf = function (aa) { return Helpers.sumOf(aa) / aa.length; };

Helpers.maxOf = function (aa) {
	return Math.max(...aa);
 };
 Helpers.minOf = function (aa) {
	 return Math.min(...aa);
    
 };
 
Helpers.randBetween = function (a, b) { return a + (b - a)*Math.random(); };

Helpers.indexInRange = function (ii, nn) { return (0 <= ii) && (ii < nn); };
Helpers.checkIndexInRange = function (ii, nn, tag)
{
	if (!Helpers.indexInRange(ii, nn)) throw 'Bad ' + tag + ' index';
};

Helpers.indexAccum = function (nn, fun)
{
	let aa = [];
	for (let ii = 0; ii < nn; ++ii) { aa.push(fun(ii)); }
	return aa;
};

Helpers.fuzz = function (val, fuzzFactor)
{
	let ff = (2.0 * Math.random()) - 1; // now -1 <= ff < 1
	ff *= fuzzFactor; // now -fuzzFactor <= ff <= fuzzFactor
	ff += 1; // if fuzzFactor was 2% = 0.02, then 0.98 <= ff < 1.02
	return ff * val; // result is val with a fuzz added of +/- fuzzFactor
};

Helpers.round = function (val, digits)
{
	let ii = 0, ff = 1.0;
	while (++ii <= digits) { ff *= 10.0; }
	return Math.round(val * ff) / ff;
};

Helpers.scale_1D = function ([a, b], [p, q]) // scale interval [a,b] to [p,q]
{
	let a_to_b = b - a;
	let p_to_q = q - p;
	let f = p_to_q / a_to_b;
	return x => p + (x - a) * f;
}

// ------------ surprise! a class can be exported this way too

class Partitioner
{
	constructor(aa)
	{
		let tt = Helpers.sumOf(aa);
		this.weights = aa.map( x => x / tt );
	}

	partition(N) { return this.weights.map( x => N*x ); }
};

Helpers.Partitioner = Partitioner;

// ------------ Here's where we do the export

export default Helpers;
