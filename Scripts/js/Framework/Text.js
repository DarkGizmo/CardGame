var FontTypes = {};

FontTypes.oCard = new function()
{
	this.sfont = '60px san-serif';
	this.sStrokeStyle = '#ffffff';
}

var Text = {}

Text.drawText = function(poCanvas, psString, pfPositionX, pfPositionY, poFontType, peHorizontalAlignment, peVerticalAlignment)
{
	poCanvas.font = poFontType.sfont;
	poCanvas.textBaseline = peVerticalAlignment ? peVerticalAlignment : "bottom";
	poCanvas.textAlign = peHorizontalAlignment ? peHorizontalAlignment : "left";
	
	if(poFontType.sFillStyle)
	{
		poCanvas.fillStyle = poFontType.sFillStyle;
		poCanvas.fillText(psString, pfPositionX, pfPositionY);
	}
	else if(poFontType.sStrokeStyle)
	{
		poCanvas.strokeStyle = poFontType.sStrokeStyle;
		poCanvas.strokeText(psString, pfPositionX, pfPositionY);
	}
	else
	{
		alert("FontType given was invalid");
	}
}