
// Calculates Payout Multiplier for Users With Flex and Power Play
export const calculatePayoutMultiplier = (entryType, totalLegs, correctLegs) => {
    const payoutMultiplier = {
      "Power Play": {
        2: {2: 3},
        3: {3: 5},
        4: {4: 10},
        5: {5: 20},
        6: {6: 37.5},
      },
      "Flex Play": {
        3: {3: 2.5, 2: 1},
        4: {4: 5, 3: 1.5},
        5: {5: 10, 4: 2, 3: 0.4},
        6: {6: 25, 5: 2, 4: 0.4},
      },
    };

    return payoutMultiplier?.[entryType]?.[totalLegs]?.[correctLegs] || 0;
  };


  // Shows the Paypout Multiplier Based on the Entry Type and Legs
  export const showPayoutMultipliers = (type, totalLegs) => {
    if(type === "Power Play") {
        return [totalLegs];
    }
    else if(type === "Flex Play") {
        if(totalLegs === 3) {
            return [3, 2];
        }
        if(totalLegs === 4) {
            return [4, 3];
        }
        if(totalLegs === 5) {
            return [5, 4, 3];
        }
        if(totalLegs === 6) {
            return [6, 5, 4];
        }
    }
    
    return [];

}
