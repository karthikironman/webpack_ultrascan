
import Helpers from './Helpers.js';

// ---------- helper functions used by GaugeDataItem

const averageOf = Helpers.averageOf;
const randBetween = Helpers.randBetween;
const checkIndexInRange = Helpers.checkIndexInRange;
const indexAccum = Helpers.indexAccum;
const maxOf = Helpers.maxOf;
const minOf = Helpers.minOf;


// ---------- helper functions used by SimulatedDataFetcher

const fuzz = Helpers.fuzz;

const pi_over_2 = Math.PI / 2;

// =====================================================================
//  Data objects
// =====================================================================

// ---------- container class for transducer/wall data

class GaugeDataItem
{
	// Note:
	// * Walls/layers are ordered from innermost to outermost
	// * Transducers are located by degrees around a circle,
	//      with 0 degrees at the top, increasing clockwise

	constructor(OD, wall_data,waterTemp,pingRate,PGS)
	{
		this.OD = OD;

		let wdl = wall_data.length;
		let transducer_angle_increment = 360 / wdl;
		let aa = [];
		for (let ii = 0; ii < wdl; ++ii) aa.push(ii * transducer_angle_increment);
		this.transducer_positions = aa;
		this.transducer_count = wdl;

		let nn = 0;
		for (let ii = 0; ii < wdl; ++ii)
		{
			let aa = wall_data[ii];
			if (ii == 0) nn = aa.length;
			else if (aa.length != nn) throw 'Inconsistent lengths';
		}
		if (nn == 0) throw 'Must supply wall data';
		this.wall_count = nn;
		this.wall_data = wall_data;
		this.water_temp = waterTemp;
		this.ping_rate = pingRate;
		this.pgs = PGS;
		
	}

	transducerPositions()
	{
		return [...this.transducer_positions];
	}

	getThicknessAt(transducer_num, wall_num)
	{
		checkIndexInRange(transducer_num, this.transducer_count, 'transducer');
		checkIndexInRange(wall_num, this.wall_count, 'wall');
		return this.wall_data[transducer_num][wall_num];
	}

	getTranducerData(transducer_num)
	{
		checkIndexInRange(transducer_num, this.transducer_count, 'transducer');
		const clone = [...this.wall_data[transducer_num]];
		return clone;
	}

	transducerThicknesses()
	{
		return indexAccum(this.transducer_count, ii => Helpers.sumOf(this.wall_data[ii]) );
	}

	transducerPositionsAndThicknesses()
	{
		let tt = this.transducerThicknesses();
		return indexAccum(this.transducer_count, ii => {
			return { angle: this.transducer_positions[ii], thickness: tt[ii] }
		});
	}

	getWallData(wall_num)
	{
		checkIndexInRange(wall_num, this.wall_count, 'wall');
		return indexAccum(this.transducer_count, ii => this.wall_data[ii][wall_num]);
	}

    wallAverageThickness(wall_num) { return averageOf( this.getWallData(wall_num) ); }

    wallAverageThicknesses()
    {
		return indexAccum(this.wall_count,
			ii => averageOf( indexAccum(this.transducer_count,
								jj => this.wall_data[jj][ii]
							) ) );
	}

	wallMaxThicknesses()
    {
		return indexAccum(this.wall_count, ii=>maxOf(this.getWallData(ii)));		
		
	}
	wallMinThicknesses()
    {
		return indexAccum(this.wall_count, ii=>minOf(this.getWallData(ii)));		
		
	}

	concentricity(wall_num)
	{
		checkIndexInRange(wall_num, this.wall_count, 'wall');
		let aa = this.wallMinThicknesses();
		let bb = this.wallMaxThicknesses();
		return (aa[wall_num] / (bb[wall_num] + 0.0000001)) * 100;
	}
	concentricities()
	{
		return indexAccum(this.wall_count, ii=>this.concentricity(ii));
	}

	waterTemp()
	{
		return this.water_temp;
	}
	pingRate()
	{
		//return  fuzz(2000, 5);
		return this.ping_rate;
	
	}
	PGS()
	{
		return this.pgs;
		
	}
	
}

// ---------- container class for waveform data

class WaveformData
{
	constructor(max, wf_array)
	{
		this.max = max;
		this.data = wf_array;
	}
}

// =====================================================================
//  Data producers
// =====================================================================

// ---------- abstract base class for fetching data

class DataFetcher // abstract base class
{
	constructor(id)
	{
		this.ID = id;
	}

	getData() { throw 'Cannot invoke base class version'; }
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// ---------- subclass of DataFetcher to get simulated data

class SimulatedDataFetcher extends DataFetcher
{
	constructor(id, n_transducers, n_walls, ideal_OD, ideal_center_size)
	{
		super(id);
		this.n_transducers = n_transducers;
		this.n_walls = n_walls;

		this.ideal_OD = ideal_OD ?? 100;
		this.ideal_center_size = ideal_center_size ?? 30;
		this.ideal_thickness = this.ideal_OD - this.ideal_center_size;

		this.round_digits = 3;

		let rel_weights = indexAccum( this.n_walls, () => randBetween(1.0, 3.0) );
		this.partitioner = new Helpers.Partitioner(rel_weights);

		this.n_waveform_points = 500; // this represents elapsed time of 500ns
		this.waveform_hump_half_width = 20;

		// If there are n layers, there must be n-1 boundaries between layers,
		// plus outer and inner diameters.  That means there must be n+1 "humps"
		// in the waveform data.
		// To make the data plausible, the humps must be distributed randomly
		// (but not TOO randomly) along the x-axis.
		// n layers requires n+1 humps, which divide the x-axis into n+2 intervals.
		// We space these intervals so that no interval is more than 3 times as large
		// as any other.
		let inter_hump_dists = indexAccum(2 + this.n_walls, () => randBetween(1,3));
		let p = new Helpers.Partitioner(inter_hump_dists);
		let aa = p.partition(this.n_waveform_points);
		let init_accum = { tot: 0, ary: [] };
		let red_fun = (accum, val) => { accum.ary.push(accum.tot += val); return accum; };
		let bb = aa.reduce(red_fun, init_accum).ary;
		bb.pop();
		let hump_positions = bb.map(xx => Math.round(xx));
				// now we have the x-coordinates of the centers of the humps

		const max_hump_height = 1000;
		const min_hump_height = 400;
		p = Helpers.scale_1D([0, hump_positions.length], [max_hump_height, min_hump_height]);
					// this scaling function makes each hump smaller than the last
		let hump_heights = indexAccum(hump_positions.length, ii => Helpers.round(p(ii), this.round_digits));

		// now combine the hump positions and heights into one structure
		this.hump_data = hump_positions.map(elt => ({ pos: elt, ht: hump_heights.shift() }) );
		// This is the "ideal" specification for the humps, but it gets "fuzzed" in getWaveforms()

		this.hump_scale_max = 1100; // used (possibly) in scaling the graph for the waveforms

		this.center_size_fuzzFactor = 0.015; // 1.5%
		this.thickness_fuzzFactor = 0.02; // 2%
		this.layer_fuzzFactor = 0.012; // 1.2%
	}

	setFuzzFactors(center_size_fuzzFactor, thickness_fuzzFactor, layer_fuzzFactor)
	{
		this.center_size_fuzzFactor = center_size_fuzzFactor;
		this.thickness_fuzzFactor = thickness_fuzzFactor;
		this.layer_fuzzFactor = layer_fuzzFactor;
	}

	getWaveforms()
	{
		const pos_fuzzFactor = 0.005; // fuzz factor for positions of humps
		const wd_fuzzFactor = 0.007; // fuzz factor for widths of humps
		const ht_fuzzFactor = 0.05; // fuzz factor for heights of humps

		let aa = indexAccum(this.n_waveform_points, () => 0);
		this.hump_data.forEach(item =>
			{
				let hump_pos = item.pos + this.n_waveform_points*randBetween(0, pos_fuzzFactor);
				hump_pos = Math.round(hump_pos);

				let hmax = fuzz(item.ht, ht_fuzzFactor);
				aa[hump_pos] = hmax;

				let hw = Math.round(fuzz(this.waveform_hump_half_width, wd_fuzzFactor));

				let sf = Helpers.scale_1D([0,hw], [0, pi_over_2]);
				for (let ii = 1; ii <= hw; ++ii) {
					// make the hump symmetric (for now)
					aa[hump_pos - ii] = aa[hump_pos + ii] = hmax * Math.cos(sf(ii));
				}
			});
		return new WaveformData(this.hump_scale_max, aa);
	}

	getData()
	{
		let fuzzy_center_size = fuzz(this.ideal_center_size, this.center_size_fuzzFactor);
		fuzzy_center_size = Helpers.round(fuzzy_center_size, this.round_digits);
		let fuzzy_thickness = fuzz(this.ideal_thickness, this.thickness_fuzzFactor);
		let thicknesses = this.partitioner.partition(fuzzy_thickness);

		let max_total_wall = 0; // max total thickness across all transducers
		let aa = indexAccum(this.n_transducers, ii => {
			let td_total = 0; // total for this transducer
			let bb = indexAccum(this.n_walls, jj => {
				let thickness = fuzz(thicknesses[jj], this.layer_fuzzFactor);
				thickness = Helpers.round(thickness, this.round_digits);
				td_total += thickness;
				return thickness;
			});
			// wall data for this transducer

			if (td_total > max_total_wall) max_total_wall = td_total;
			return bb;
		});
		// data for transducers

		let OD = max_total_wall + fuzzy_center_size;

		let waterTemp = Helpers.round(fuzz(20, 0.01), this.round_digits);
		let pingRate = Helpers.round(fuzz(2000, 0.05), this.round_digits);
		let PGS = Helpers.round(fuzz(90, 0.01), this.round_digits);

		return new GaugeDataItem(OD, aa,waterTemp, pingRate,PGS);
	}
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// ---------- subclass of DataFetcher to get data from gauge

class GaugeDataFetcher extends DataFetcher
{
	constructor(id, IPaddr, port)
	{
		super(id);
		this.IPaddr = IPaddr;
		this.port = port;
	}

	getData()
	{
		throw 'GaugeDataFetcher getData() not yet implemented';
	}
}

// =====================================================================
//  Export class
// =====================================================================

class DataGathering { }

// class DataGathering has no constructor, no members, no methods
//    Its only function is to have static, class-level functions
//    for creating DataFetcher objects.

DataGathering.makeSimulator =
	function(id, transducer_count, wall_count, ideal_OD, ideal_center_size)
	{
		return new SimulatedDataFetcher(id, transducer_count, wall_count,
											ideal_OD, ideal_center_size);
	};

DataGathering.makeGaugeGetter = (id, IPaddr, port) => new GaugeDataFetcher(id, IPaddr, port);

export default DataGathering;
