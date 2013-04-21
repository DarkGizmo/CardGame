
var CardStackStyling = {};

CardStackStyling.VisualStyle = {};

CardStackStyling.VisualStyle.oDefault = new function()
{
	this.bCardNumberOnBack = true;
	this.bCardNumberOnFront = true;
	this.sBackgroundImagePath = "";
	this.fHorizontalSpacing = 2.0;
	this.fVerticalSpacing = -2.0;
	this.bRelativeToTopCard = false;
	this.bTopCardFaceUp = false;
	this.bUseAlpha = false;
	this.fAlphaMultiplier = 1.0;
}

CardStackStyling.VisualStyle.oHealthBar = new function()
{
	this.bCardNumberOnBack = true;
	this.bCardNumberOnFront = false;
	this.sBackgroundImagePath = "";
	this.fHorizontalSpacing = 6.0;
	this.fVerticalSpacing = 0.0;
	this.bRelativeToTopCard = false;
	this.bTopCardFaceUp = false;
	this.bUseAlpha = false;
	this.fAlphaMultiplier = 1.0;
}

CardStackStyling.VisualStyle.oActionStack = new function()
{
	this.bCardNumberOnBack = false;
	this.bCardNumberOnFront = true;
	this.sBackgroundImagePath = "";
	this.fHorizontalSpacing = 0.0;
	this.fVerticalSpacing = -3.0;
	this.bRelativeToTopCard = false;
	this.bTopCardFaceUp = true;
	this.bUseAlpha = false;
	this.fAlphaMultiplier = 1.0;
}

CardStackStyling.VisualStyle.oSimpleStack = new function()
{
	this.bCardNumberOnBack = false;
	this.bCardNumberOnFront = true;
	this.sBackgroundImagePath = "";
	this.fHorizontalSpacing = 3.0;
	this.fVerticalSpacing = -3.0;
	this.bRelativeToTopCard = false;
	this.bTopCardFaceUp = true;
	this.bUseAlpha = false;
	this.fAlphaMultiplier = 1.0;
}

CardStackStyling.VisualStyle.oDragStack = new function()
{
	this.bCardNumberOnBack = false;
	this.bCardNumberOnFront = true;
	this.sBackgroundImagePath = "";
	this.fHorizontalSpacing = 0.0;
	this.fVerticalSpacing = 3.0;
	this.bRelativeToTopCard = true;
	this.bTopCardFaceUp = true;
	this.bUseAlpha = true;
	this.fAlphaMultiplier = 0.5;
}

CardStackStyling.VisualStyle.oCardSlot = new function()
{
	this.bCardNumberOnBack = false;
	this.bCardNumberOnFront = true;
	this.sBackgroundImagePath = "Assets/Images/CardSlot.png";
	this.fHorizontalSpacing = 0.0;
	this.fVerticalSpacing = 3.0;
	this.bRelativeToTopCard = false;
	this.bTopCardFaceUp = true;
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
		
		while(mtoCards.length > 0)
		{
			mtoCards[0].destroy();
			mtoCards.splice(0, 1);
		}
	}
	
	
	this.positionCard = function(poCard, Index)
	{
		poCard.setZOrder(moDrawComponent.getZOrder() + Index);
		
		if(moVisualStyle.bRelativeToTopCard)
		{
			Index = (mtoCards.length - Index);
		}
		
		var offsetX = 0.0;
		var offsetY = 0.0;
		
		if(moBackgroundImage != null)
		{
			offsetX = (moBackgroundImage.width - poCard.getSize().x) * 0.5;
			offsetY = (moBackgroundImage.height - poCard.getSize().y) * 0.5;
		}
		
		poCard.setPosition(
			mfPositionX + offsetX + moVisualStyle.fHorizontalSpacing * Index,
			mfPositionY + offsetY + moVisualStyle.fVerticalSpacing * Index);
	}
	
	this.getCardCount = function()
	{
		return mtoCards.length;
	}
	
	this.getDropOutMaxCount = function()
	{
		return moInteractiveStyle.iDropOutMaxCount;
	}
	
	this.pushCard = function(poCard)
	{
		if(mtoCards.length > 0)
		{
			mtoCards[mtoCards.length - 1].setFaceUp(false, moInteractiveStyle.bDropOut);
		}
		
		mtoCards.push(poCard);
		
		for(var i = 0; i < mtoCards.length; ++i)
		{
			this.positionCard(mtoCards[i], i);
		}
		
		this.updateCardSlotRectangle();
		this.updateCardsVisual();
	}
	
	this.getTopCard = function()
	{
		return mtoCards[mtoCards.length - 1];
	}
	
	this.popCard = function()
	{
		var oCard = this.getTopCard();
		
		mtoCards.splice(mtoCards.length-1, 1);
		
		for(var i = 0; i < mtoCards.length; ++i)
		{
			this.positionCard(mtoCards[i], i);
		}
		
		this.updateCardSlotRectangle();
		this.updateCardsVisual();
		
		return oCard;
	}
	
	this.flipFrontCard = function()
	{
		if(moVisualStyle.bTopCardFaceUp)
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
			poCanvas.drawImage(moBackgroundImage, mfPositionX - moBackgroundImage.width * 0.5, mfPositionY + moBackgroundImage.height * 0.5);
		}
		
		// Hack this should be in update
		this.updateCardSlotRectangle();
	};
	
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
				moStackDropRectangle.updateBounds(mfPositionX - moBackgroundImage.width * 0.5, mfPositionY + moBackgroundImage.height * 0.5, moBackgroundImage.width, moBackgroundImage.height);
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
			var oLastCardPosition = oLastCard.getPosition();
			var oLastCardSize = oLastCard.getSize();
			
			moStackDropRectangle.updateBounds(oLastCardPosition.mfX - oLastCardSize.x * 0.5, oLastCardPosition.mfY +oLastCardSize.y * 0.5, oLastCard.getSize().x, oLastCard.getSize().y)
			
			if(moDraggedCardStack != null)
			{
				// Keep the MouseEventZone under the DraggedCardStack so that it cancels mouse over events from other stacks
				moMouseEventComponent.update(moDraggedCardStack.getPosition().X, moDraggedCardStack.getPosition().Y, oLastCard.getSize().x, oLastCard.getSize().y);
			}
			else
			{
				moMouseEventComponent.update(oLastCardPosition.mfX - oLastCardSize.x * 0.5, oLastCardPosition.mfY +oLastCardSize.y * 0.5, oLastCard.getSize().x, oLastCard.getSize().y);
			}
		}
	}
	
	this.validate = function(poCardStack)
	{
		var bValid = false;
		if(poCardStack != null && moDraggedCardStack == null)
		{
			var TotalCards = this.getCardCount() + poCardStack.getCardCount();
			bValid = TotalCards <=  moInteractiveStyle.iDropInMaxCount || moInteractiveStyle.iDropInMaxCount < 0;
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
	
	this.updateCardsVisual = function()
	{
		if(mtoCards.length > 0)
		{
			var iStartHiddenIndex = this.getCardCount();
			
			if(moDraggedCardStack != null)
			{	
				iStartHiddenIndex -= moDraggedCardStack.getCardCount();
			}

			var iHiddenCardsCount = this.getCardCount() - iStartHiddenIndex;
			for(var i = 0; i < mtoCards.length; ++i)
			{
				var oCard = mtoCards[i];
				
				oCard.sFaceUpText = i;
				
				if(i >= iStartHiddenIndex)
				{
					oCard.setAlpha(Math.pow(0.5, iHiddenCardsCount - (i - iStartHiddenIndex)));
					oCard.setFaceUp(true);
				}
				else
				{
					oCard.setAlpha(1.0);
					
					if(iStartHiddenIndex < this.getCardCount() && this.getCardDropOutCount() != 0 && i == iStartHiddenIndex - 1)
					{
						oCard.setFaceUp(true);
					}
					else
					{
						oCard.setFaceUp(false);
					}
				}
				oCard.setDrawText(false);
			}
			
			var oTopCard = this.getTopCard();
			if(moVisualStyle.bCardNumberOnBack)
			{
				oTopCard.sFaceDownText = mtoCards.length.toString();
			}
			
			if(moVisualStyle.bCardNumberOnFront)
			{
				oTopCard.sFaceUpText = (mtoCards.length - iHiddenCardsCount).toString();
			}
			
			if(moVisualStyle.bTopCardFaceUp)
			{
				oTopCard.setFaceUp(true);
			}
			
			oTopCard.setDrawText(true);
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
					moDraggedCardStack.destroy();
				}
				else
				{
					for(var i = 0; i < moDraggedCardStack.getCardCount(); ++i)
					{
						this.popCard(true).destroy();
					}
					oCardStack.assignCardStack(moDraggedCardStack);
				}
				
				this.flipFrontCard();
				
				moDraggedCardStack.destroy();
				moDraggedCardStack = null;
				
				this.updateCardsVisual();
				
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
				moDraggedCardStack = new CardStack(CardStackStyling.VisualStyle.oDragStack, CardStackStyling.InteractiveStyle.oDragStack);
				var oLastCard = this.getTopCard();
				moDraggedCardStack.setPosition(oLastCard.getPosition().mfX, oLastCard.getPosition().mfY);
				moDraggedCardStack.pushCard(oLastCard.clone());
				
				moDraggedCardStack.getDrawComponent().setZOrder(100);
				moMouseEventComponent.setZOrder(100);
				
				this.updateCardsVisual();
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
				var iCardIndex = this.getCardCount() - moDraggedCardStack.getCardCount();
				if(iCardIndex > 0 && this.getCardDropOutCount() != 0)
				{
					var oCard = mtoCards[iCardIndex - 1];
					moDraggedCardStack.pushCard(oCard.clone());
				}
			}
			else
			{
				if(moDraggedCardStack.getCardCount() > 1)
				{
					moDraggedCardStack.popCard(true).destroy();
				}
			}
			
			this.updateCardsVisual();
			
			return true;
		}
	}
	
	this.ctor(poCardStackVisualStyle, poCardStackInteractiveStyle);
};
