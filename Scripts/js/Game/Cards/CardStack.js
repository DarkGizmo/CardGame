
var CardStackStyling = {};

CardStackStyling.VisualStyle = {};

CardStackStyling.VisualStyle.oDefault = new function()
{
	this.sBackgroundImagePath = "";
	this.fHorizontalSpacing = 2.0;
	this.fVerticalSpacing = -2.0;
	this.bRelativeToTopCard = false;
	this.bLastCardFaceUp = false;
	this.bUseAlpha = false;
	this.fAlphaMultiplier = 1.0;
}

CardStackStyling.VisualStyle.oHealthBar = new function()
{
	this.sBackgroundImagePath = "";
	this.fHorizontalSpacing = 6.0;
	this.fVerticalSpacing = 0.0;
	this.bRelativeToTopCard = false;
	this.bLastCardFaceUp = false;
	this.bUseAlpha = false;
	this.fAlphaMultiplier = 1.0;
}

CardStackStyling.VisualStyle.oActionStack = new function()
{
	this.sBackgroundImagePath = "";
	this.fHorizontalSpacing = 0.0;
	this.fVerticalSpacing = -3.0;
	this.bRelativeToTopCard = false;
	this.bLastCardFaceUp = true;
	this.bUseAlpha = false;
	this.fAlphaMultiplier = 1.0;
}

CardStackStyling.VisualStyle.oSimpleStack = new function()
{
	this.sBackgroundImagePath = "";
	this.fHorizontalSpacing = 3.0;
	this.fVerticalSpacing = -3.0;
	this.bRelativeToTopCard = false;
	this.bLastCardFaceUp = true;
	this.bUseAlpha = false;
	this.fAlphaMultiplier = 1.0;
}

CardStackStyling.VisualStyle.oDragStack = new function()
{
	this.sBackgroundImagePath = "";
	this.fHorizontalSpacing = 0.0;
	this.fVerticalSpacing = 3.0;
	this.bRelativeToTopCard = true;
	this.bLastCardFaceUp = true;
	this.bUseAlpha = true;
	this.fAlphaMultiplier = 0.5;
}

CardStackStyling.VisualStyle.oCardSlot = new function()
{
	this.sBackgroundImagePath = "Assets/Images/CardSlot.png";
	this.fHorizontalSpacing = 0.0;
	this.fVerticalSpacing = 3.0;
	this.bRelativeToTopCard = false;
	this.bLastCardFaceUp = true;
	this.bUseAlpha = false;
	this.fAlphaMultiplier = 1.0;
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
	var mtoCards = [];
	var mfPositionX = 0.0;
	var mfPositionY = 0.0;
	var moDrawComponent = null;
	var moMouseEventComponent = null;
	var moBackgroundImage = null;
	var moVisualStyle = null;
	var moInteractiveStyle = null;
	var moStackDropRectangle = null;
	
	var moDraggedCardStack = null;
	
	this.ctor = function(poCardStackVisualStyle, poCardStackInteractiveStyle)
	{
		moDrawComponent = goDrawManager.addComponent(this, 0);

		moVisualStyle = poCardStackVisualStyle;
		moInteractiveStyle = poCardStackInteractiveStyle;
		
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
		
		if(moInteractiveStyle.bDropOut)
		{
			moMouseEventComponent = goMouseEventManager.addComponent(this, 0);
		}
		
		this.updateCardSlotRectangle();
	}
	
	this.getDrawComponent = function()
	{
		return moDrawComponent;
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
	
	this.getPosition = function()
	{
		var oPosition = {};
		oPosition.X = mfPositionX;
		oPosition.Y = mfPositionY;
		
		return oPosition;
	}
	
	this.destroy = function()
	{
		if(moDrawComponent != null)
		{
			goDrawManager.removeComponent(this);
			moDrawComponent = null;
		}
		
		if(moMouseEventComponent != null)
		{
			goMouseEventManager.removeComponent(this);
			moMouseEventComponent = null;
		}
	}
	
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
		if(moVisualStyle.bUseAlpha)
		{
			poCanvas.save();
		}
		for(i = 0; i < mtoCards.length; ++i)
		{
			if(moVisualStyle.bUseAlpha)
			{
				poCanvas.globalAlpha = moVisualStyle.fAlphaMultiplier / (mtoCards.length - i);
			}
			mtoCards[i].draw(poCanvas, i == mtoCards.length - 1);
		}
		
		if(moVisualStyle.bUseAlpha)
		{
			poCanvas.restore();
		}
		
		// Hack this should be in update
		this.updateCardSlotRectangle();
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
			
			if(moDraggedCardStack != null)
			{
				moMouseEventComponent.update(moDraggedCardStack.getPosition().X, moDraggedCardStack.getPosition().Y, oLastCard.getSize().x, oLastCard.getSize().y);
			}
			else
			{
				moMouseEventComponent.update(oLastCard.fPositionX, oLastCard.fPositionY, oLastCard.getSize().x, oLastCard.getSize().y);
			}
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
	
	this.updateCursor = function()
	{
		if(mtoCards.length > 0)
		{
			if(moMouseEventComponent.tbMouseDown[MouseClickType.eLeftClick])
			{
				setCursorStyle("url(Assets/Images/UI/DragCursor.png)");
			}
			else if(moMouseEventComponent.bMouseOver)
			{
				setCursorStyle("url(Assets/Images/UI/GrabCursor.png)");
			}
			else
			{
				setCursorStyle("auto");
			}
		}
		else
		{
			setCursorStyle("auto");
		}
	}
	
	this.onMouseIn = function()
	{
		this.updateCursor();
		
		return true;
	}
	
	this.onMouseOut = function()
	{
		this.updateCursor();
	}
	
	this.onMouseDown = function(piButton, pfPositionX, pfPositionY)
	{
		if(piButton == MouseClickType.eLeftClick)
		{
			this.updateCursor();
			
			return true;
		}
	}
	
	this.onMouseUp = function(piButton, pfPositionX, pfPositionY)
	{
		if(piButton == MouseClickType.eLeftClick)
		{
			if(moDraggedCardStack != null)
			{
				var bValidCardSlot = false;
				var oCardStack = goCardStackManager.getCardStackAtPosition(pfPositionX, pfPositionY);
				
				if(oCardStack != null)
				{
					bValidCardSlot = oCardStack.validate(moDraggedCardStack);
				}
				
				if(!bValidCardSlot)
				{
					var oTopCard = moDraggedCardStack.popCard();
					while(moDraggedCardStack.getCardCount() != 0)
					{
						this.pushCard(moDraggedCardStack.popCard());
					}
					this.pushCard(oTopCard);
				}
				else
				{
					oCardStack.assignCardStack(moDraggedCardStack);
				}
				
				this.flipFrontCard();
				
				moDraggedCardStack.destroy();
				moDraggedCardStack = null;
				
				moMouseEventComponent.setZOrder(0);
			}
			
			this.updateCursor();
		}
	}
	
	this.onMouseDrag = function(piButton, pfDeltaMoveX, pfDeltaMoveY)
	{
		if(piButton == MouseClickType.eLeftClick)
		{
			// We just started dragging
			if(moInteractiveStyle.bDropOut && moDraggedCardStack == null)
			{
				var bShouldFlipCard = this.getDropOutMaxCount() - 1 != 0;
				
				moDraggedCardStack = new CardStack(CardStackStyling.VisualStyle.oDragStack, CardStackStyling.InteractiveStyle.oDragStack);
				var oLastCard = mtoCards[mtoCards.length - 1];
				moDraggedCardStack.setPosition(oLastCard.fPositionX, oLastCard.fPositionY);
				moDraggedCardStack.pushCard(this.popCard(bShouldFlipCard));
				
				moDraggedCardStack.getDrawComponent().setZOrder(100);
				moMouseEventComponent.setZOrder(100);
			}
			
			var oPosition = moDraggedCardStack.getPosition();
			moDraggedCardStack.setPosition(oPosition.X + pfDeltaMoveX, oPosition.Y + pfDeltaMoveY);
			
			return true;
		}
	}
	
	this.getCardDropOutCount = function()
	{
		return this.getDropOutMaxCount() - moDraggedCardStack.getCardCount();
	}
	
	this.onMouseWheel = function(piDelta)
	{
		if(moDraggedCardStack != null)
		{
			if(piDelta > 0)
			{
				if(this.getCardCount() > 0 && this.getCardDropOutCount() != 0)
				{
					var bShouldFlipCard = this.getDropOutMaxCount() - moDraggedCardStack.getCardCount() - 1 != 0;
					// Keep this card on top, so that we don't recreate all the components for the new top card
					var oTopCard = moDraggedCardStack.popCard();
					{
						moDraggedCardStack.pushCard(this.popCard(bShouldFlipCard));
					}
					moDraggedCardStack.pushCard(oTopCard);
				}
			}
			else
			{
				if(moDraggedCardStack.getCardCount() > 1)
				{
					// Keep this card on top, so that we don't recreate all the components for the new top card
					var oTopCard = moDraggedCardStack.popCard();
					{
						this.pushCard(moDraggedCardStack.popCard(), this.getCardDropOutCount() != 0);
					}
					moDraggedCardStack.pushCard(oTopCard);
				}
			}
			
			return true;
		}
	}
	
	this.ctor(poCardStackVisualStyle, poCardStackInteractiveStyle);
};
