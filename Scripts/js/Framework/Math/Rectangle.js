function Rectangle(pfPositionX, pfPositionY, pfWidth, pfHeight)
{
	this.fLeft; // Initialization Done at the end of class
	this.fRight; // Initialization Done at the end of class
	this.fTop; // Initialization Done at the end of class
	this.fBottom; // Initialization Done at the end of class
	
	this.ctor = function(pfPositionX, pfPositionY, pfWidth, pfHeight)
	{
		this.updateBounds(pfPositionX, pfPositionY, pfWidth, pfHeight);
	}
	
	this.updateBounds = function(pfPositionX, pfPositionY, pfWidth, pfHeight)
	{
		this.fLeft = pfPositionX;
		this.fRight = pfPositionX + pfWidth;
		this.fTop = pfPositionY;
		this.fBottom = pfPositionY + pfHeight;
	}
	
	this.isInside = function(pfPositionX, pfPositionY)
	{
		return 	pfPositionX >= this.fLeft && pfPositionX <= this.fRight && 
				pfPositionY >= this.fTop && pfPositionY <= this.fBottom;
	}
	
	this.ctor(pfPositionX, pfPositionY, pfWidth, pfHeight);
}
