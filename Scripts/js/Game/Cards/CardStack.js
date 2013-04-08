
var CardStackStyling = {};

CardStackStyling.VisualStyle = {};

CardStackStyling.VisualStyle.oDefault = new function()
{
	this.sBackgroundImagePath = "";
	this.fHorizontalSpacing = 2.0;
	this.fVerticalSpacing = -2.0;
	this.bRelativeToTopCard = false;
	this.bLastCardFaceUp = false;
}

CardStackStyling.VisualStyle.oHealthBar = new function()
{
	this.sBackgroundImagePath = "";
	this.fHorizontalSpacing = 6.0;
	this.fVerticalSpacing = 0.0;
	this.bRelativeToTopCard = false;
	this.bLastCardFaceUp = false;
}

CardStackStyling.VisualStyle.oActionStack = new function()
{
	this.sBackgroundImagePath = "";
	this.fHorizontalSpacing = 0.0;
	this.fVerticalSpacing = -3.0;
	this.bRelativeToTopCard = false;
	this.bLastCardFaceUp = true;
}

CardStackStyling.VisualStyle.oSimpleStack = new function()
{
	this.sBackgroundImagePath = "";
	this.fHorizontalSpacing = 3.0;
	this.fVerticalSpacing = -3.0;
	this.bRelativeToTopCard = false;
	this.bLastCardFaceUp = true;
}

CardStackStyling.VisualStyle.oDragStack = new function()
{
	this.sBackgroundImagePath = "";
	this.fHorizontalSpacing = 0.0;
	this.fVerticalSpacing = 3.0;
	this.bRelativeToTopCard = true;
	this.bLastCardFaceUp = true;
}

CardStackStyling.VisualStyle.oCardSlot = new function()
{
	this.sBackgroundImagePath = "Assets/Images/CardSlot.png";
	this.fHorizontalSpacing = 0.0;
	this.fVerticalSpacing = 3.0;
	this.bRelativeToTopCard = false;
	this.bLastCardFaceUp = true;
}

CardStackStyling.InteractiveStyle = {};

CardStackStyling.InteractiveStyle.oDefault = new function()
{
	this.bDropOut = false;
	this.iDropOutMaxCount = 0;
	this.bDropIn = false;
	this.iDropInMaxCount = 0;
}

CardStackStyling.InteractiveStyle.oNonInteractive = new function()
{
	this.bDropOut = false;
	this.iDropOutMaxCount = 0;
	this.bDropIn = false;
	this.iDropInMaxCount = 0;
}

CardStackStyling.InteractiveStyle.oDragStack = new function()
{
	this.bDropOut = false;
	this.iDropOutMaxCount = 0;
	this.bDropIn = false;
	this.iDropInMaxCount = 0;
}

CardStackStyling.InteractiveStyle.oSingleCardSlot = new function()
{
	this.bDropOut = true;
	this.iDropOutMaxCount = 1;
	this.bDropIn = true;
	this.iDropInMaxCount = 1;
}

CardStackStyling.InteractiveStyle.oMultipleCardSlot = new function()
{
	this.bDropOut = true;
	this.iDropOutMaxCount = -1;
	this.bDropIn = true;
	this.iDropInMaxCount = -1;
}

CardStackStyling.InteractiveStyle.oSingleDragCardStack = new function()
{
	this.bDropOut = true;
	this.iDropOutMaxCount = 1;
	this.bDropIn = true;
	this.iDropInMaxCount = -1;
}

CardStackStyling.InteractiveStyle.oMultipleDragCardStack = new function()
{
	this.bDropOut = true;
	this.iDropOutMaxCount = -1;
	this.bDropIn = true;
	this.iDropInMaxCount = -1;
}

function CardStack(poCardStackVisualStyle, poCardStackInteractiveStyle)
{
	this.bBeingMoved = false;
	
	var mtoCards = [];
	var mfPositionX = 0.0;
	var mfPositionY = 0.0;
	var moDrawComponent = goDrawManagerInstance.addComponent(this, 0);
	var moBackgroundImage; // Initialize later
	var moVisualStyle = poCardStackVisualStyle;
	var moInteractiveStyle = poCardStackInteractiveStyle;
	var moStackDropRectangle = null;
	
	if(moVisualStyle == null)
	{
		moVisualStyle = CardStackStyling.VisualStyle.oDefault;
	}
	
	if(moInteractiveStyle == null)
	{
		moInteractiveStyle = CardStackStyling.InteractiveStyle.oDefault;
	}

	if(moVisualStyle.sBackgroundImagePath != null && moVisualStyle.sBackgroundImagePath != "")
	{
		moBackgroundImage = new Image();
		moBackgroundImage.src = moVisualStyle.sBackgroundImagePath;
	}
	
	this.setPosition = function(pfNewPositionX, pfNewPositionY)
	{
		mfPositionX = pfNewPositionX;
		mfPositionY = pfNewPositionY;
		for(var i = 0; i < mtoCards.length; ++i)
		{
			this.positionCard(mtoCards[i], i);
		}
		
		this.updateCardSlotRectangle();
	};
	
	this.positionCard = function(poCard, Index)
	{
		if(moVisualStyle.bRelativeToTopCard)
		{
			Index = (mtoCards.length - Index - 1);
		}
		
		var offsetX = 0.0;
		var offsetY = 0.0;
		
		if(moBackgroundImage != null)
		{
			offsetX = (moBackgroundImage.width - poCard.getSize().x) * 0.5;
			offsetY = (moBackgroundImage.height - poCard.getSize().y) * 0.5;
		}
		
		poCard.fPositionX = mfPositionX + offsetX + moVisualStyle.fHorizontalSpacing * Index;
		poCard.fPositionY = mfPositionY + offsetY + moVisualStyle.fVerticalSpacing * Index;
	}
	
	this.getCardCount = function()
	{
		return mtoCards.length;
	}
	
	this.getDropOutMaxCount = function()
	{
		return moInteractiveStyle.iDropOutMaxCount;
	}
	
	this.pushCard = function(poCard, bFlipFrontCard)
	{
		if(bFlipFrontCard == null)
		{
			bFlipFrontCard = true;
		}
		
		if(mtoCards.length > 0)
		{
			mtoCards[mtoCards.length - 1].setFaceUp(false, moInteractiveStyle.bDropOut);
		}
		
		this.positionCard(poCard, mtoCards.length);
		
		mtoCards.push(poCard);
		
		poCard.sText = mtoCards.length.toString();
		poCard.oParentStack = this;
		
		if(bFlipFrontCard)
		{
			this.flipFrontCard();
		}
		
		this.updateCardSlotRectangle();
	}
	
	this.popCard = function(pbFlipFrontCard)
	{
		var oCard = mtoCards[mtoCards.length - 1];
		
		mtoCards.splice(mtoCards.length-1, 1);
		
		if(mtoCards.length > 0 && pbFlipFrontCard)
		{
			this.flipFrontCard();
		}
		
		for(var i = 0; i < mtoCards.length; ++i)
		{
			this.positionCard(mtoCards[i], i);
		}
		
		this.updateCardSlotRectangle();
		
		return oCard;
	}
	
	this.flipFrontCard = function()
	{
		if(moVisualStyle.bLastCardFaceUp)
		{
			if(mtoCards.length > 0)
			{
				mtoCards[mtoCards.length - 1].setFaceUp(true, moInteractiveStyle.bDropOut);
			}
		}
		else
		{
			mtoCards[mtoCards.length - 1].setDrawText(true);
		}
	}
	
	this.draw = function(poCanvas)
	{
		if(moBackgroundImage != null)
		{
			poCanvas.drawImage(moBackgroundImage, mfPositionX, mfPositionY);
		}
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
	
	this.isPositionOnCardStack = function(pfPositionX, pfPositionY)
	{
		if(moStackDropRectangle)
		{
			return moStackDropRectangle.isInside(pfPositionX, pfPositionY);
		}
		
		return false;
	}
	
	this.updateCardSlotRectangle = function()
	{
		if(!moInteractiveStyle.bDropIn)
		{
			return;	// Nothing to do
		}
		
		if(mtoCards.length == 0)
		{
			// We have no card
			if(moBackgroundImage != null)
			{
				// but we have a background
				if(moStackDropRectangle == null)
				{
					// Use background as the drop rectangle
					moStackDropRectangle = new Rectangle(0,0,0,0);
					goCardStackManager.registerCardSlot(this);
				}
				moStackDropRectangle.updateBounds(mfPositionX, mfPositionY, moBackgroundImage.width, moBackgroundImage.height);
			}
			else if(moStackDropRectangle != null)
			{
				// We have no background, remove the drop rectangle
				moStackDropRectangle = null;
				goCardStackManager.unregisterCardSlot(this);
			}
		}
		else
		{
			// We have cards

			if(moStackDropRectangle == null)
			{
				// But no drop rectangle
				// Create one
				moStackDropRectangle = new Rectangle(0,0,0,0);
				goCardStackManager.registerCardSlot(this);
			}
			
			// The drop rectangle is suppose to be on the last card
			var oLastCard = mtoCards[mtoCards.length - 1];
			moStackDropRectangle.updateBounds(oLastCard.fPositionX, oLastCard.fPositionY, oLastCard.getSize().x, oLastCard.getSize().y)
		}
	}
	
	this.validate = function(poCardStack)
	{
		var bValid = false;
		if(poCardStack != null)
		{
			var TotalCards = this.getCardCount() + poCardStack.getCardCount();
			bValid = TotalCards <=  moInteractiveStyle.iDropInMaxCount || moInteractiveStyle.iDropInMaxCount < 0;
			// Validate that this slot in unoccupied
			bValid = bValid && this.oCurrentStack == null;
		}
		return bValid;
	}
	
	this.assignCardStack = function(poCardStack)
	{
		while(poCardStack.getCardCount() > 0)
		{
			this.pushCard(poCardStack.popCard());
		}
	}
	
	this.updateCardSlotRectangle();
};
