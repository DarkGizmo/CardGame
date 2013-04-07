function setCursorStyle(poStyle)
{
	var oCanvas = document.getElementById('container');
	if(!poStyle.match(/auto$/))
	{
		poStyle += ", auto";
	}
	oCanvas.style.cursor = poStyle;
}