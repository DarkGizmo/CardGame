function Card(psCardImagePath)
{
	this.fPositionX = 0;
	this.fPositionY = 0;
	this.fScale = 1.0;
	this.fRotation = 0.0;
	this.sText = "";

	
	var moCardImage = null;
	var mbFaceUp = false;
	var mbDrawText = false;
	var moDrawComponent = null;
	
	this.ctor = function()
	{
		moCardImage = new Image();
		moCardImage.src = psCardImagePath;
	}
	
	this.draw = function(poCanvas)
	{
		poCanvas.save();
		{
			poCanvas.translate(this.fPositionX, this.fPositionY);
			poCanvas.rotate(this.fRotation);
			
			var cardWidth = moCardImage.width * 0.5;
			poCanvas.drawImage(moCardImage, (mbFaceUp ? cardWidth : 0.0), 0.0, cardWidth, moCardImage.height, 0, 0, cardWidth * this.fScale, moCardImage.height * this.fScale);
			
			if(mbDrawText && this.sText != "")
			{
				Text.drawText(poCanvas, this.sText, 0 + this.getSize().x * 0.5, 0 + this.getSize().y * 0.5, FontTypes.oCard, "center", "middle");
			}
		}
		poCanvas.restore();
	};
	
	this.isFaceUp = function()
	{
		return mbFaceUp;
	}
	
	this.setFaceUp = function(pbNewFaceUp)
	{
		if(mbFaceUp != pbNewFaceUp)
		{
			mbFaceUp = pbNewFaceUp;
			
			this.setDrawText(mbFaceUp);
		}
	};
	
	this.setDrawText = function(pbDrawText)
	{
		mbDrawText = pbDrawText;
	}
	
	this.getSize = function()
	{
		var size = new Object();
		size.x = moCardImage.width * 0.5 * this.fScale;
		size.y = moCardImage.height * this.fScale;
		
		return size;
	}
	
	this.ctor();
}
