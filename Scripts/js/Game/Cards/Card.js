function Card(psCardImagePath)
{
	this.fScale = 1.0;
	this.sFaceUpText = "";
	this.sFaceDownText = "";
	
	var mfPositionX = 0.0;
	var mfPositionY = 0.0;
	var mfRotation = 0.0;
	var mfAlpha = 1.0;
	var mZOrder = 0;
	var moCardImage = null;
	var mbFaceUp = false;
	var mbDrawText = true;
	var moDrawComponent = null;
	
	this.ctor = function()
	{
		moCardImage = new Image();
		moCardImage.src = psCardImagePath;
		moDrawComponent = goDrawManager.addComponent(this, 0);
		
		//this.setRotation(Random.range(-Math.PI / 64, Math.PI / 64));
	}
	
	this.clone = function()
	{
		var oClone = new Card(moCardImage.src);
		oClone.fScale = this.fScale
		oClone.sFaceUpText = this.sFaceUpText;
		oClone.sFaceDownText = this.sFaceDownText;
		oClone.setPosition(mfPositionX, mfPositionY);
		oClone.setRotation(mfRotation);
		oClone.setAlpha(mfAlpha);
		oClone.setZOrder(mZOrder);
		oClone.setFaceUp(mbFaceUp);
		
		return oClone;
	}
	
	this.destroy = function()
	{
		if(moDrawComponent != null)
		{
			goDrawManager.removeComponent(this);
			moDrawComponent = null;
		}
	}
	
	this.setPosition = function(pfPositionX, pfPositionY)
	{
		mfPositionX = pfPositionX;
		mfPositionY = pfPositionY;
		
		moDrawComponent.fPositionX = mfPositionX;
		moDrawComponent.fPositionY = mfPositionY;
	}
	
	this.getPosition = function()
	{
		var oPosition = {};
		
		oPosition.mfX = mfPositionX;
		oPosition.mfY = mfPositionY;
		
		return oPosition;
	}
	
	this.setRotation = function(pfRotation)
	{
		mfRotation = pfRotation;
		
		moDrawComponent.fRotation = mfRotation;
	}
	
	this.setZOrder = function(pfZOrder)
	{
		mZOrder = pfZOrder;
		moDrawComponent.setZOrder(mZOrder);
	}
	
	this.setAlpha = function(pfAlpha)
	{
		mfAlpha = pfAlpha;
		moDrawComponent.fAlpha = pfAlpha;
	}
	
	this.getRotation = function()
	{
		return mfRotation;
	}
	
	this.draw = function(poCanvas)
	{
		poCanvas.save();
		{			
			var cardWidth = moCardImage.width * 0.5;
			poCanvas.drawImage(moCardImage, (mbFaceUp ? cardWidth : 0.0), 0.0, cardWidth, moCardImage.height, -cardWidth * 0.5 * this.fScale, moCardImage.height * 0.5 * this.fScale, cardWidth * this.fScale, moCardImage.height * this.fScale);
			
			if(mbDrawText)
			{
				if(mbFaceUp && this.sFaceUpText != "")
				{
					Text.drawText(poCanvas, this.sFaceUpText, 0, 0 + this.getSize().y, FontTypes.oCard, "center", "middle");
				}
				else if(!mbFaceUp && this.sFaceDownText != "")
				{
					Text.drawText(poCanvas, this.sFaceDownText, 0, 0 + this.getSize().y, FontTypes.oCard, "center", "middle");
				}
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
