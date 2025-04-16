import { Box, Button, Divider, Typography } from "@mui/material";
import React, { useState } from "react";
import "./HelpCenter.css";
import { useEffect } from "react";

// Help Menu Categories
const helpCategories = [
  { id: 1, label: "Deposits & Withdrawals" },
  { id: 2, label: "Placing Entries" },
  { id: 3, label: "Lineup Details & Payouts" },
  { id: 4, label: "Promotions" },
  { id: 5, label: "FAQs" },
];

const HelpCenter = ({ isOpen, onClose }) => {
  const [activeSlide, setActiveSlide] = useState("menu");

  // Sets Active Slide to Menu When Help Center is Opened
  useEffect(() => {
    if (isOpen) {
      setActiveSlide("menu");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    
    // Main Container for the Help Center Fullscreen Popup
    <Box
      className="help-modal-backdrop"
      sx={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1350,
      }}
    >

      {/* Help Center Popup Container */}
      <Box
        className="help-center-container"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          border: "2px solid white",
          borderRadius: "1rem",
          boxShadow: "0 0 20px black",
          width: "100%",
          maxWidth: "700px",
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
          padding: "2rem",
          color: "white",
        }}
      >
        {/* Close Button */}
        <Button
          disableRipple
          onClick={onClose}
          sx={{
            textTransform: "none",
            position: "absolute",
            top: "1rem",
            right: "1rem",
            backgroundColor: "transparent",
            color: "white",
            fontWeight: "bold",
            fontFamily: "monospace",
            fontSize: "1.1rem",
            "&:hover": {
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
            },
            "&:focus": {
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
            },
          }}
        >
          Close
        </Button>

        {/* Back Button Only Appears In Selected Help Tabs */}
        {activeSlide !== "menu" && (
          <Button
            disableRipple
            onClick={() => setActiveSlide("menu")}
            sx={{
              textTransform: "none",
              position: "absolute",
              top: "1rem",
              left: "1rem",
              backgroundColor: "transparent",
              color: "white",
              fontWeight: "bold",
              fontFamily: "monospace",
              fontSize: "1.1rem",
              "&:hover": {
                outline: "none",
                backgroundColor: "transparent",
              },
              "&:focus": {
                outline: "none",
                backgroundColor: "transparent",
              },
            }}
          >
            ← Back
          </Button>
        )}

        {/* Help Center Header */}
        <Box 
          sx={{ 
            marginTop: "2rem" 
          }}
        >
          {/* Help Center Title */}
          <Typography
            sx={{
              fontSize: "2rem",
              fontFamily: "monospace",
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            Help Center
          </Typography>
        </Box>

        {/* Help Center Main Menu */}
        {activeSlide === "menu" ? (
          <>
            <Typography
              sx={{
                fontSize: "1.2rem",
                fontFamily: "monospace",
                marginBottom: "2rem",
              }}
            >
              How Can <strong>PlayBook</strong> Help You?
            </Typography>

            {/* Help Categories List */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {helpCategories.map((topic) => (
                <Box
                  key={topic.id}
                  onClick={() => setActiveSlide(topic.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid white",
                    borderRadius: "0.5rem",
                    padding: "1rem 2rem",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  {/* Help Topic Text */}
                  <Typography
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: "bold",
                    }}
                  >
                    {topic.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider
              sx={{
                width: "100%",
                backgroundColor: "white",
                margin: "2rem 0 1rem",
                height: "1px",
              }}
            />

            {/* Contact Support Box */}
            <Box
              sx={{
                border: "1px solid white",
                borderRadius: "0.5rem",
                padding: "2rem 3rem",
                width: "100%",
              }}
            >
              {/* Contact Support Header */}
              <Typography
                sx={{
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                  fontFamily: "monospace",
                  marginBottom: "1rem",
                }}
              >
                Contact Support
              </Typography>

              {/* Contact Support Description */}
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontFamily: "monospace",
                  marginBottom: "0.5rem",
                }}
              >
                If you didn't find what you're looking for, we're always here to help!
              </Typography>

              {/* Contact Support Email (NOT REAL EMAIL) */}
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontFamily: "monospace",
                }}
              >
                Email us at{" "}
                <a
                  href="mailto:support@playbook.com"
                  style={{ color: "#3399ff" }}
                >
                  support@playbook.com
                </a>
              </Typography>
            </Box>
          </>
        ) : (

          // Selected Help Topic Container
          <Box 
            sx={{ 
              width: "100%", 
            }}
          >

            {/* Selected Help Topic Header */}
            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                fontFamily: "monospace",
                marginBottom: "1rem",
              }}
            >
              {
                helpCategories.find((topic) => topic.id === activeSlide)?.label
              }
            </Typography>

            <Divider
              sx={{
                width: "100%",
                backgroundColor: "white",
                margin: "1rem 0",
                height: "1px",
              }}
            />

            {/* Deposit & Withdrawal Section */}
            {activeSlide === 1 && (
              <>

                {/* Deposit Header */}
                <Typography
                  sx={{
                    fontSize: "1.2rem",
                    fontFamily: "monospace",
                    marginBottom: "0.5rem",
                    fontWeight: "bold",
                  }}
                >
                  Depositing Funds
                </Typography>

                <Typography
                    sx={{
                      fontSize: "1rem",
                      fontFamily: "monospace",
                      marginBottom: "2rem",
                    }}
                  >
                    You will need funds in order to place entires (unless using our Promotion deals).
                    To desposit funds, follow these steps! 
                </Typography>
                
                { /* Deposit Steps */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 2,
                    textAlign: "left",
                  }}
                >
                  <Typography sx={{fontFamily: "monospace"}}>1. Go to your <strong>Funds</strong> tab in the top right of the Navigation Bar.</Typography>
                  <Typography sx={{fontFamily: "monospace"}}>2. Click on the <strong>Deposit</strong> button, remember to <strong>add a card</strong> first before doing so if you haven't already!</Typography>
                  <Typography sx={{fontFamily: "monospace"}}>3. Select the amount you want to deposit, select a card, and enter the card's CVV. </Typography>
                  <Typography sx={{fontFamily: "monospace"}}>4. Click on the <strong>Confirm</strong> button to confirm your deposit. Enjoy!</Typography>
                </Box>

                <Divider
                  sx={{
                    width: "100%",
                    backgroundColor: "white",
                    margin: "2rem 0",
                    height: "1px",
                  }}
                />

                {/* Withdraw Header */}
                <Typography
                  sx={{
                    fontSize: "1.2rem",
                    fontFamily: "monospace",
                    marginBottom: "0.5rem",
                    fontWeight: "bold",
                  }}
                >
                  Withdrawing Funds
                </Typography>
                
                {/* Withdraw Steps */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 2,
                    textAlign: "left",
                  }}
                >
                  <Typography sx={{fontFamily: "monospace"}}>1. Go to your <strong>Funds</strong> tab in the top right of the Navigation Bar.</Typography>
                  <Typography sx={{fontFamily: "monospace"}}>2. Click on the <strong>Withdraw</strong> button, remember to <strong>add a card</strong> first before doing so if you haven't already!</Typography>
                  <Typography sx={{fontFamily: "monospace"}}>3. Type the amount you want to withdrawal, and select a card</Typography>
                  <Typography sx={{fontFamily: "monospace"}}>4. Click on the <strong>Confirm</strong> button to confirm your withdraw. Enjoy!</Typography>
                </Box>


              </>
            )}

            {/* Placing Entries Section */}
            {activeSlide === 2 && (
              <>
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontFamily: "monospace",
                    marginBottom: "2.5rem",
                  }}
                >
                  <strong>Entries (lineups)</strong> are combinations of player prop predictions that you'd submit as a <strong>bet (parlay)</strong>.
                  If your picks are correct, you win a payout based on the number of players and the entry type.
                  To place an entry, follow these steps below:
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 2,
                    textAlign: "left",
                  }}
                >
                  <Typography sx={{fontFamily: "monospace"}}>1. Go to the Dashboard tab by clicking on our Name or Logo.</Typography>
                  <Typography sx={{fontFamily: "monospace"}}>2. Choose a category such as <strong>NBA, NFL, or VAL</strong> using the tabs at the top of the Dashboard.</Typography>
                  <Typography sx={{fontFamily: "monospace"}}>3. Click on any scheduled game to view available player props, or click on the Search Icon
                    to find a specific player, then choose between <strong>Over</strong> or <strong>Under</strong> the projected player stat.</Typography>
                  <Typography sx={{fontFamily: "monospace"}}>4. Build a lineup (entry) of <strong>2-6 players</strong>, you can mix and match all players from all categories! Just
                    make sure that they're not all from the same team.</Typography>
                  <Typography sx={{fontFamily: "monospace"}}>5. Once you're done building your lineup, open your lineup at the bottom pop-up bar, and click on the "Finalize Picks" button.</Typography>
                  <Typography sx={{fontFamily: "monospace"}}>6. Choose between a <strong>Flex Play</strong> (if applicable) or <strong>Power Play</strong>, and select the amount you want to wager.</Typography>
                  <Typography sx={{fontFamily: "monospace"}}>7. Click on the <strong>Submit</strong> button to confirm your entry. Good luck!</Typography>
                  </Box>
              </>
            )}

            {/* Lineup Details & Payouts Section */}
            {activeSlide === 3 && (
              <>
                {/* Lineup Details Header */}
                <Typography
                  sx={{
                    fontSize: "1.2rem",
                    fontFamily: "monospace",
                    marginBottom: "0.5rem",
                    fontWeight: "bold",
                  }}
                >
                  Lineup Details
                </Typography>

                <Typography sx={{fontFamily: "monospace"}}>The Lineup Details section can be seen in the Lineups Page after you click on any lineup. A pop-up will then appear, giving a complete
                  breakdown of each submitted entry. The number of picks, your Over or Under pick, entry amount, potential payout along with the multipliers, and a live status of each player will be shown with our 
                  visual progress bar! The progress bar will show how close the player is to their projected line, and the status of each player will be shown as either <strong>In Progress</strong> (white), <strong>Won</strong> (green), 
                  or <strong>Lost</strong> (red). If the player does not play <strong>(DNP)</strong>(DNP), then they will be grayed out and the multiplier will be fluxuated down by one size or however much players DNP. This essentially means
                  that the entry will continue and pay out as if that player was never picked. (Example, 6-Pick lineup will act as a 5-leg). However, if it results to one or less players left, then the entry will be refunded.</Typography>
                
                  <Divider
                  sx={{
                    width: "100%",
                    backgroundColor: "white",
                    margin: "2rem 0",
                    height: "1px",
                  }}
                />

                {/* Payouts Header */}
                <Typography
                  sx={{
                    fontSize: "1.2rem",
                    fontFamily: "monospace",
                    marginBottom: "0.5rem",
                    fontWeight: "bold",
                  }}
                >
                  Payouts
                </Typography>

                <Typography
                    sx={{
                      fontSize: "1rem",
                      fontFamily: "monospace",
                      marginBottom: "2rem",
                    }}
                  >
                    Payouts are determined by the entry type <strong>Power Play</strong> or <strong>Flex Play</strong>, and the number of picks (legs) in your entry. A list will be shown below of the standard payout multipliers for each entry type of
                    your entry amount:
                </Typography>
                
                {/* Payout Multipliers Container */} 
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 2,
                    textAlign: "left",
                  }}
                >
                  {/* Power Play Multipliers */}
                  <Typography sx={{fontFamily: "monospace", fontWeight: "bold", fontSize: "1.2rem"}}>Power Play</Typography>
                  <Typography sx={{fontFamily: "monospace"}}>• 6-Pick Win = <strong>37.5x</strong></Typography>
                  <Typography sx={{fontFamily: "monospace"}}>• 5-Pick Win = <strong>20x</strong></Typography>
                  <Typography sx={{fontFamily: "monospace"}}>• 4-Pick Win = <strong>10x</strong></Typography>
                  <Typography sx={{fontFamily: "monospace"}}>• 3-Pick Win = <strong>5x</strong></Typography>
                  <Typography sx={{fontFamily: "monospace", marginBottom: "2rem"}}>• 2-Pick Win = <strong>2x</strong></Typography>

                  {/* Flex Play Multipliers */}
                  <Typography sx={{fontFamily: "monospace", fontWeight: "bold", fontSize: "1.2rem"}}>Flex Play</Typography>
                  <Typography sx={{fontFamily: "monospace"}}>• 6 of 6-Pick Win = <strong>25x</strong></Typography>
                  <Typography sx={{fontFamily: "monospace"}}>• 5 of 6-Pick Win = <strong>2x</strong></Typography>
                  <Typography sx={{fontFamily: "monospace"}}>• 4 of 6-Pick Win = <strong>0.4x</strong></Typography>
                  <Typography sx={{fontFamily: "monospace"}}>• 5 of 5-Pick Win = <strong>10x</strong></Typography>
                  <Typography sx={{fontFamily: "monospace"}}>• 4 of 5-Pick Win = <strong>2x</strong></Typography>
                  <Typography sx={{fontFamily: "monospace"}}>• 3 of 5-Pick Win = <strong>0.4x</strong></Typography>
                  <Typography sx={{fontFamily: "monospace"}}>• 4 of 4-Pick Win = <strong>5x</strong></Typography>
                  <Typography sx={{fontFamily: "monospace"}}>• 3 of 4-Pick Win = <strong>1.5x</strong></Typography>
                  <Typography sx={{fontFamily: "monospace"}}>• 3 of 3-Pick Win = <strong>2.25x</strong></Typography>
                  <Typography sx={{fontFamily: "monospace"}}>• 2 of 3-Pick Win = <strong>1.25x</strong></Typography>
                </Box>


              </>
            )}

            {/* Promotions Section */}
            {activeSlide === 4 && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 2,
                    textAlign: "left",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "1rem",
                      fontFamily: "monospace",
                      textAlign: "middle",
                      marginBottom: "2rem",
                    }}
                  >
                    We love to give back to our users! Every now and then we will give out special offers, bonuses, and limited time events that can give you more ways to win money! Some of these promotions can 
                    include <strong>boosted payouts, free entries, payout boosts, and more</strong>. Make sure to check out the Promotions page often! Each promotion will give a quick description of what it offers, and how to claim or 
                    use it. Have fun!
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "1rem",
                      fontFamily: "monospace",
                      textAlign: "middle",
                    }}
                  >
                    Our permanent promotion deal is to <strong>"Refer a Friend"</strong>! If you refer a friend to PlayBook, and they sign up and deposit, you will both get a $25 bonus in promo funds! To do this, go to the Promotions page in the Navigation Bar, look for the promotion square, and copy your unique referral link.
                    With the "Copy Link" button. Send it to your friends, and once they sign up and deposit, you will both get a $25 promo fund bonus! Promo funds are not real currency, and cannot be withdrawn as they are in-game money that can be used to turn into real money if you win. If the user loses, then
                    no money will be deducted from their actual balance Enjoy!
                  </Typography>
                </Box>
              </>
            )}

            {/* FAQs Section */}
            {activeSlide === 5 && (
              <>
                {/* FAQs Header */}
                <Typography
                  sx={{
                    fontFamily: "monospace",
                    marginBottom: "2.5rem",
                  }}
                >
                  Below are some frequently asked questions <strong>(FAQS)</strong> that you might have questions about:
                </Typography>

                {/* FAQ Content Container */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 2,
                    textAlign: "left",
                  }}
                >
                  <Typography sx={{fontFamily: "monospace", fontSize: "1.1rem", fontWeight: "bold"}}>Q: How many players can I include in a lineup?</Typography>
                  <Typography sx={{fontFamily: "monospace", marginBottom: "1rem"}}>A: Each lineup must include between 2 to 6 players. They also cannot all be from the same team! This helps with increasing the competitive and diverse aspect of PlayBook.</Typography>
                  <Typography sx={{fontFamily: "monospace", fontSize: "1.1rem", fontWeight: "bold"}}>Q: What is the main difference between Flex Play and Power Play?</Typography>
                  <Typography sx={{fontFamily: "monospace", marginBottom: "1rem"}}>A: Essentially, Flex Play allows for some margin of error, meaning that you can still win with partial payouts even if you dont hit all of your lines. However, Power Play requires all of your picks
                    to hit, but offers a higher payout multiplier in return! Go big or go home!</Typography>
                  <Typography sx={{fontFamily: "monospace", fontSize: "1.1rem", fontWeight: "bold"}}>Q: Where can I find active promotions?</Typography>
                  <Typography sx={{fontFamily: "monospace", marginBottom: "1rem"}}>A: You can find active promotions under our Promotions Tab on the top right corner of the navigation menu. New promos are added every so often so remember to check frequently as they might expire!</Typography>
                  <Typography sx={{fontFamily: "monospace", fontSize: "1.1rem", fontWeight: "bold"}}>Q: What are promo funds and what can I do with them?</Typography>
                  <Typography sx={{fontFamily: "monospace", marginBottom: "1rem"}}>A: Promo funds are essentially an in-game currency that can be only used in the app. It cannot be withdrawn, but acts like your real balance in the app. If used and won, it will be translated into real
                    currency that you can withdrawl! If you use promo funds and lose an entry, don't worry! Nothing will actually be deducted from your balance. </Typography>
                  <Typography sx={{fontFamily: "monospace", fontSize: "1.1rem", fontWeight: "bold"}}>Q: How can I add more money to my balance?</Typography>
                  <Typography sx={{fontFamily: "monospace", marginBottom: "1rem"}}>A: To add more money to your balance, simply head to the Funds page located in the top right of the navigation board, click on the deposit option, select the amount of money you want to withdrawal, select a card 
                    (remember to add your card first!), enter the card's CVV, and click on the Confirm button to confirm the deposit. Good luck!</Typography>
                  </Box>
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HelpCenter;
