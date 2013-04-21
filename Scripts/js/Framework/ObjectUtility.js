var ObjectUtility = {}

// extends 'poFrom' object with members poFrom 'poTo'. If 'poTo' is null, a deep clone of 'poFrom' is returned
ObjectUtility.extend = function(poFrom, poTo)
{
    if (poFrom == null || typeof poFrom != "object") return poFrom;
    if (poFrom.constructor != Object && poFrom.constructor != Array) return poFrom;
    if (poFrom.constructor == Date || poFrom.constructor == RegExp || poFrom.constructor == Function ||
        poFrom.constructor == String || poFrom.constructor == Number || poFrom.constructor == Boolean)
        return new poFrom.constructor(poFrom);

    poTo = poTo || new poFrom.constructor();

    for (var name in poFrom)
    {
        poTo[name] = typeof poTo[name] == "undefined" ? extend(poFrom[name], null) : poTo[name];
    }

    return poTo;
}

ObjectUtility.clone = function(poObject)
{
	return ObjectUtility.extend(poObject);
}