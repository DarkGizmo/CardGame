
var CardStackStyling = { };

CardStackStyling.oHealthBar = new function()
{
	this.fHorizontalSpacing = 6.0;
	this.fVerticalSpacing = 0.0;
	this.bRelativeToTopCard = false;
}

CardStackStyling.StaminaBar = new function()
{
	this.fHorizontalSpacing = 0.0;
	this.fVerticalSpacing = -6.0;
	this.bRelativeToTopCard = false;
}

CardStackStyling.SimpleStack = new function()
{
	this.fHorizontalSpacing = 3.0;
	this.fVerticalSpacing = -3.0;
	this.bRelativeToTopCard = false;
}

CardStackStyling.DragStack = new function()
{
	this.fHorizontalSpacing = 0.0;
	this.fVerticalSpacing = 3.0;
	this.bRelativeToTopCard = true;
}

function CardStack(poCardStackStyle)
{
	this.bBeingMoved = false;
	
	var mtoCards = [];
	var mfPositionX = 0.0;
	var mfPositionY = 0.0;
	
	var moDrawComponent = goDrawManagerInstance.addComponent(this, 0);
	
	if(poCardStackStyle == null)
	{
		poCardStackStyle = CardStackStyling.oHealthBar();
	}
	var fHorizontalSpacing 	= poCardStackStyle.fHorizontalSpacing;
	var fVerticalSpacing 	= poCardStackStyle.fVerticalSpacing;
	var bRelativeToTopCard 	= poCardStackStyle.bRelativeToTopCard;
	
	this.setPosition = function(pfNewPositionX, pfNewPositionY)
	{
		mfPositionX = pfNewPositionX;
		mfPositionY = pfNewPositionY;
		for(var i = 0; i < mtoCards.length; ++i)
		{
			this.positionCard(mtoCards[i], i);
		}
	};
	
	this.positionCard = function(poCard, Index)
	{
		if(bRelativeToTopCard)
		{
			Index = (mtoCards.length - Index);
		}
		
		poCard.fPositionX = mfPositionX + fHorizontalSpacing * Index;
		poCard.fPositionY = mfPositionY + fVerticalSpacing * Index;
	}
	
	this.getCardCount = function()
	{
		return mtoCards.length;
	}
	
	this.pushCard = function(poCard)
	{
		if(mtoCards.length > 0)
		{
			mtoCards[mtoCards.length - 1].setFaceUp(false);
		}
		poCard.setFaceUp(true);
		
		this.positionCard(poCard, mtoCards.length);
		
		mtoCards.push(poCard);
		
		poCard.sText = mtoCards.length.toString();
		poCard.oParentStack = this;
	}
	
	this.popCard = function()
	{
		var oCard = mtoCards[mtoCards.length - 1];
		
		mtoCards.splice(mtoCards.length-1, 1);
		
		if(mtoCards.length > 0)
		{
			mtoCards[mtoCards.length - 1].setFaceUp(true);
		}
		
		for(var i = 0; i < mtoCards.length; ++i)
		{
			this.positionCard(mtoCards[i], i);
		}
		
		return oCard;
	}
	
	this.draw = function(poCanvas)
	{
		if(this.bBeingMoved)
		{
			poCanvas.save();
		}
		for(i = 0; i < mtoCards.length; ++i)
		{
			if(this.bBeingMoved)
			{
				poCanvas.globalAlpha = 0.5 / (mtoCards.length - i);
			}
			mtoCards[i].draw(poCanvas, i == mtoCards.length - 1);
		}
		
		if(this.bBeingMoved)
		{
			poCanvas.restore();
		}
	};
	
	this.onMouseDrag = function(piButton, pfDeltaMoveX, pfDeltaMoveY)
	{
		if(piButton == MouseClickType.eLeftClick)
		{
			this.setPosition(mfPositionX + pfDeltaMoveX, mfPositionY + pfDeltaMoveY);
		}
	}
};