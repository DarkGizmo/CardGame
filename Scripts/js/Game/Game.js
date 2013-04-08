function initializeGame()
{
	goDrawManagerInstance.SetBackground("Assets/Images/Background.png");
	
	var cardLot = new CardStack(null, CardStackStyling.InteractiveStyle.oMultipleDragCardStack);
	var cardLot2 = new CardStack(CardStackStyling.VisualStyle.oSimpleStack, CardStackStyling.InteractiveStyle.oSingleDragCardStack);
	
	var lotSize = Math.round(Math.random() * 10.0);
	for(i = 0; i < lotSize; ++i)
	{
		cardLot.pushCard(new Card("Assets/Images/Card.png"));
	}
	cardLot.setPosition(100, 100);
	
	lotSize = Math.round(Math.random() * 10.0);
	for(i = 0; i < lotSize; ++i)
	{
		cardLot2.pushCard(new Card("Assets/Images/Card.png"));
	}
	cardLot2.setPosition(250, 100);
	
	var cardLot3 = new CardStack(CardStackStyling.VisualStyle.oCardSlot, CardStackStyling.InteractiveStyle.oMultipleCardSlot);
	cardLot3.setPosition(600, 100);
}
gtfInitializationFunctions.push(initializeGame);