var Random = {}

Random.range = function(pfLowerBound, pfUpperBound)
{
	var range = pfUpperBound - pfLowerBound;
	
	return pfLowerBound + Math.random() * range;
}