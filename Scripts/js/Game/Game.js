function initializeGame()
{
	goDrawManager.SetBackground("Assets/Images/Background.png");
	
	var oHealthBar = new CardStack(CardStackStyling.VisualStyle.oHealthBar, CardStackStyling.InteractiveStyle.oNonInteractive);
	for(i = 0; i < 20; ++i)
	{
		oHealthBar.pushCard(new Card("Assets/Images/Card.png"));
	}
	oHealthBar.setPosition(10, 570);
	
	var oActionCard1 = new CardStack(CardStackStyling.VisualStyle.oActionStack, CardStackStyling.InteractiveStyle.oMultipleDragCardStack);
	var lotSize = 1 + Math.round(Math.random() * 4.0);
	for(i = 0; i < lotSize; ++i)
	{
		oActionCard1.pushCard(new Card("Assets/Images/Card.png"));
	}
	oActionCard1.setPosition(350, 570);
	
	var oActionCard2 = new CardStack(CardStackStyling.VisualStyle.oActionStack, CardStackStyling.InteractiveStyle.oSingleDragCardStack);
	
	lotSize = 1 + Math.round(Math.random() * 4.0);
	for(i = 0; i < lotSize; ++i)
	{
		oActionCard2.pushCard(new Card("Assets/Images/Card.png"));
	}
	oActionCard2.setPosition(500, 570);
	
	var oStaminaSlot = new CardStack(CardStackStyling.VisualStyle.oCardSlot, CardStackStyling.InteractiveStyle.oSingleCardSlot);
	oStaminaSlot.setPosition(300, 350);
	
	
}
gtfInitializationFunctions.push(initializeGame);