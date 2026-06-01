import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCcw, Hand, Trophy, Spade, Heart, Club, Diamond, EyeOff, Eye, Flame } from 'lucide-react';

export type Suit = 'H' | 'C' | 'D' | 'S' | 'NT';
export type Rank = 'J' | '9' | 'A' | '10' | 'K' | 'Q' | '8' | '7';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  points: number;
  value: number; // For determining trick winner (J highest, 7 lowest)
}

const SUITS: Suit[] = ['H', 'S', 'D', 'C'];
const RANKS: { rank: Rank; points: number; value: number }[] = [
  { rank: 'J', points: 3, value: 8 },
  { rank: '9', points: 2, value: 7 },
  { rank: 'A', points: 1, value: 6 },
  { rank: '10', points: 1, value: 5 },
  { rank: 'K', points: 0, value: 4 },
  { rank: 'Q', points: 0, value: 3 },
  { rank: '8', points: 0, value: 2 },
  { rank: '7', points: 0, value: 1 },
];

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const r of RANKS) {
      deck.push({ ...r, suit, id: `${suit}${r.rank}` });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
};

interface TrickPlay {
  playerId: number;
  card: Card;
  isTrumpRevealedAtPlay: boolean;
}

export const CardGame29 = ({ soundEnabled, playSound }: { soundEnabled: boolean, playSound?: any }) => {
  // Game states
  const [gameState, setGameState] = useState<'IDLE' | 'BIDDING' | 'DOUBLING' | 'TRUMP_SELECTION' | 'PLAYING' | 'ROUND_OVER' | 'MATCH_OVER'>('IDLE');
  
  const [deck, setDeck] = useState<Card[]>([]);
  const [hands, setHands] = useState<Card[][]>([[], [], [], []]);
  
  // Bidding & Multipliers
  const [currentBid, setCurrentBid] = useState<number>(15);
  const [highestBidder, setHighestBidder] = useState<number | null>(null);
  const [activeBidders, setActiveBidders] = useState<boolean[]>([true, true, true, true]);
  const [turn, setTurn] = useState<number>(1); 
  const [gameMultiplier, setGameMultiplier] = useState<number>(1); // 1 = Normal, 2 = Double, 4 = Redouble
  const [bidderTeam, setBidderTeam] = useState<number>(1);
  
  // Trump, Pairs & Tricks
  const [trumpSuit, setTrumpSuit] = useState<Suit | null>(null);
  const [isTrumpRevealed, setIsTrumpRevealed] = useState<boolean>(false);
  const [leadSuit, setLeadSuit] = useState<Suit | null>(null);
  const [currentTrick, setCurrentTrick] = useState<TrickPlay[]>([]);
  
  // Pair/Marriage Rules (King & Queen of Trump)
  const [pairDeclaredBy, setPairDeclaredBy] = useState<number | null>(null);
  const [pairPoints, setPairPoints] = useState<{ 1: number, 2: number }>({ 1: 0, 2: 0 });

  // Scoring
  const [teamPoints, setTeamPoints] = useState<{ 1: number, 2: number }>({ 1: 0, 2: 0 }); 
  const [matchScore, setMatchScore] = useState<{ 1: number, 2: number }>({ 1: 0, 2: 0 });
  const [message, setMessage] = useState<string>('');

  const [playedCards, setPlayedCards] = useState<Card[]>([]);

  const [isSingleHand, setIsSingleHand] = useState<boolean>(false);
  const [seventhCardTrumpMode, setSeventhCardTrumpMode] = useState<boolean>(false);
  const [doublingStatus, setDoublingStatus] = useState<'IDLE' | 'P0_CAN_DOUBLE' | 'P0_CAN_REDOUBLE' | 'AI_THINKING'>('IDLE');

  const pSound = (type: string) => {
    if (playSound && soundEnabled) playSound(type, soundEnabled);
  };

  const startRound = () => {
    const newDeck = createDeck();
    const newHands: Card[][] = [[], [], [], []];
    // Deal 4 cards initially for bidding
    for (let i = 0; i < 4; i++) {
       newHands[i] = newDeck.splice(0, 4);
       newHands[i].sort((a, b) => {
          if (a.suit !== b.suit) return a.suit.localeCompare(b.suit);
          return b.value - a.value;
       });
    }
    setDeck(newDeck);
    setHands(newHands);
    setGameState('BIDDING');
    setCurrentBid(14); 
    setHighestBidder(null);
    setActiveBidders([true, true, true, true]);
    setTurn(1); 
    setTrumpSuit(null);
    setIsTrumpRevealed(false);
    setLeadSuit(null);
    setCurrentTrick([]);
    setTeamPoints({ 1: 0, 2: 0 });
    setPairDeclaredBy(null);
    setPairPoints({ 1: 0, 2: 0 });
    setGameMultiplier(1);
    setIsSingleHand(false);
    setSeventhCardTrumpMode(false);
    setDoublingStatus('IDLE');
    setPlayedCards([]);
    setMessage('Bidding Phase...');
    pSound('start');
  };

  const nextTurnAscending = () => setTurn(prev => (prev + 1) % 4);

  // AI Bidding Logic
  useEffect(() => {
    if (gameState === 'BIDDING' && turn !== 0 && turn !== -1) {
       const timer = setTimeout(() => {
          if (!activeBidders[turn]) {
             nextTurnAscending();
             return;
          }
          const aiHand = hands[turn];
          const jacks = aiHand.filter(c => c.rank === 'J').length;
          const nines = aiHand.filter(c => c.rank === '9').length;
          const maxBidAI = 15 + jacks * 3 + nines * 2 + Math.floor(Math.random() * 2);
          
          if (currentBid < maxBidAI && currentBid < 28) {
             const newBid = Math.max(16, currentBid + 1);
             setCurrentBid(newBid);
             setHighestBidder(turn);
             setMessage(`Player ${turn} bid ${newBid}`);
             pSound('click');
          } else {
             const newActive = [...activeBidders];
             newActive[turn] = false;
             setActiveBidders(newActive);
             setMessage(`Player ${turn} passed`);
             pSound('click');
          }
          nextTurnAscending();
       }, 900);
       return () => clearTimeout(timer);
    }
  }, [gameState, turn, activeBidders, currentBid, hands]);

  // Check end of bidding
  useEffect(() => {
     if (gameState === 'BIDDING') {
        const activeCount = activeBidders.filter(b => b).length;
        if (activeCount === 1) {
           handleBiddingWon();
        } else if (activeCount === 0) {
           // Everyone passed at 15
           setHighestBidder(1); 
           setCurrentBid(16);
           handleBiddingWon(1);
        }
     }
  }, [activeBidders, gameState]);

  const handleBiddingWon = (forcedWinner?: number) => {
     let winner = forcedWinner ?? highestBidder ?? 1;
     setHighestBidder(winner);
     const bTeam = (winner === 0 || winner === 2) ? 1 : 2;
     setBidderTeam(bTeam);
     const finalBid = Math.max(16, currentBid);
     
     if (finalBid >= 28) {
         setIsSingleHand(true);
         setMessage(`Player ${winner === 0 ? 'You' : winner} won the bid at ${finalBid} (SINGLE HAND!).`);
     } else {
         setMessage(`Player ${winner === 0 ? 'You' : winner} won the bid at ${finalBid}.`);
     }
     
     setGameState('DOUBLING');
     
     if (bTeam === 1) {
         setDoublingStatus('AI_THINKING');
         setTimeout(() => handleAIDoubleDecision(bTeam, finalBid, false), 1500);
     } else {
         setDoublingStatus('P0_CAN_DOUBLE');
     }
  };

  const handleAIDoubleDecision = (bTeam: number, bid: number, isRedoubleDecision: boolean) => {
     if (isRedoubleDecision) {
         if (Math.random() > 0.8 && bid < 20) {
             setGameMultiplier(4);
             setMessage(`Team 2 REDOUBLED!`);
             pSound('start');
         } else {
             setMessage(`Team 2 passed on redouble.`);
         }
         setTimeout(() => startTrumpSelection(), 1500);
     } else {
         const opTeam = bTeam === 1 ? 2 : 1;
         if (opTeam === 2 && bid >= 20) {
            if (Math.random() > 0.6) {
               setGameMultiplier(2);
               setMessage(`Team 2 DOUBLED the bid!`);
               pSound('start');
               setTimeout(() => setDoublingStatus('P0_CAN_REDOUBLE'), 1500);
               return;
            } else {
               setMessage(`Team 2 passed on double.`);
            }
         }
         setTimeout(() => startTrumpSelection(), 1500);
     }
  };

  const handleHumanDoubleAction = (action: 'DOUBLE' | 'REDOUBLE' | 'PASS') => {
      pSound('click');
      if (action === 'PASS') {
          if (doublingStatus === 'P0_CAN_DOUBLE') {
             setMessage('You passed on double.');
             setTimeout(() => startTrumpSelection(), 1000);
          } else {
             setMessage('You passed on redouble.');
             setTimeout(() => startTrumpSelection(), 1000);
          }
      } else if (action === 'DOUBLE') {
          setGameMultiplier(2);
          setMessage('You DOUBLED the bid!');
          setDoublingStatus('AI_THINKING');
          setTimeout(() => handleAIDoubleDecision(bidderTeam, Math.max(16, currentBid), true), 1500);
      } else if (action === 'REDOUBLE') {
          setGameMultiplier(4);
          setMessage('You REDOUBLED the bid!');
          setTimeout(() => startTrumpSelection(), 1500);
      }
      setDoublingStatus('IDLE');
  };
  
  const startTrumpSelection = () => {
      setGameState('TRUMP_SELECTION');
      setTurn(highestBidder!);
      setDoublingStatus('IDLE');
      setMessage(`Player ${highestBidder === 0 ? 'You' : highestBidder} selects Trump.`);
  };

  // AI Trump Selection
  useEffect(() => {
     if (gameState === 'TRUMP_SELECTION' && turn !== 0 && turn !== -1) {
        const timer = setTimeout(() => {
           const hand = hands[turn];
           const counts: Record<Suit, number> = { H: 0, S: 0, D: 0, C: 0, NT: 0 };
           hand.forEach(c => counts[c.suit] += 1 + c.points);
           
           let bestSuit: Suit = 'H';
           let maxCount = -1;
           Object.keys(counts).forEach(s => {
              if (counts[s as Suit] > maxCount) {
                 maxCount = counts[s as Suit];
                 bestSuit = s as Suit;
              }
           });
           setTrumpSuit(bestSuit);
           dealRemainingCards(false);
        }, 1200);
        return () => clearTimeout(timer);
     }
  }, [gameState, turn, hands]);

  const handleHumanBid = (amt: number | 'PASS') => {
     if (amt === 'PASS') {
        const newActive = [...activeBidders];
        newActive[0] = false;
        setActiveBidders(newActive);
        setMessage('You passed.');
     } else {
        setCurrentBid(amt);
        setHighestBidder(0);
        setMessage(`You bid ${amt}.`);
     }
     pSound('click');
     nextTurnAscending();
  };

  const handleHumanTrumpSet = (suit: Suit) => {
     setTrumpSuit(suit);
     pSound('click');
     dealRemainingCards(false);
  };

  const handleSeventhCardSet = () => {
     pSound('click');
     setSeventhCardTrumpMode(true);
     dealRemainingCards(true);
  };

  const dealRemainingCards = (isSeventhCard: boolean) => {
     const remDeck = [...deck];
     const newHands = [...hands];
     let seventhSuit: Suit | null = null;
     
     for (let i = 0; i < 4; i++) {
        const dealt = remDeck.splice(0, 4);
        if (isSeventhCard && i === (highestBidder ?? 0)) {
           seventhSuit = dealt[2].suit;
        }
        newHands[i] = [...newHands[i], ...dealt];
        // Sort for convenience
        newHands[i].sort((a, b) => {
           if (a.suit !== b.suit) return a.suit.localeCompare(b.suit);
           return b.value - a.value;
        });
     }
     if (isSeventhCard && seventhSuit) {
         setTrumpSuit(seventhSuit);
     }
     setDeck(remDeck);
     setHands(newHands);
     setGameState('PLAYING');
     setMessage('Game On! ' + (highestBidder === 0 ? 'You lead.' : `Player ${highestBidder} leads.`));
     // highest bidder leads first trick
  };

  const checkAndDeclarePair = (playerHand: Card[], tSuit: Suit, pId: number) => {
     if (pairDeclaredBy !== null) return; // already declared
     const hasKing = playerHand.some(c => c.suit === tSuit && c.rank === 'K');
     const hasQueen = playerHand.some(c => c.suit === tSuit && c.rank === 'Q');
     
     if (hasKing && hasQueen) {
        setPairDeclaredBy(pId);
        const team = (pId === 0 || pId === 2) ? 1 : 2;
        setPairPoints(prev => ({ ...prev, [team]: 4 }));
        setMessage(`Player ${pId === 0 ? 'You' : pId} declared a Royal PAIR (+4 pts)!`);
        pSound('win');
     }
  };

  // AI Playing Trick logic (Smart AI)
  useEffect(() => {
     if (gameState === 'PLAYING' && turn !== 0 && turn !== -1) {
        const timer = setTimeout(() => {
           const hand = hands[turn];
           let validMoves = [...hand];
           
           const isCardUnbeatableInSuit = (card: Card) => {
               const superiorRanks = RANKS.filter(r => r.value > card.value);
               for (let r of superiorRanks) {
                  const superiorId = `${card.suit}${r.rank}`;
                  const isPlayed = playedCards.some(pc => pc.id === superiorId);
                  const isCurrentTrick = currentTrick.some(tc => tc.card.id === superiorId);
                  const isInHand = hand.some(hc => hc.id === superiorId);
                  if (!isPlayed && !isCurrentTrick && !isInHand) return false; 
               }
               return true;
           };

           if (leadSuit) {
              const followers = hand.filter(c => c.suit === leadSuit);
              if (followers.length > 0) {
                 validMoves = followers;
              } else {
                 const currentTestWinner = getTrickWinner(currentTrick, trumpSuit);
                 const isPartnerWinning = currentTestWinner?.playerId === (turn + 2) % 4;
                 const partnerUnbeatable = isPartnerWinning && isCardUnbeatableInSuit(currentTestWinner!.card);

                 if (!isTrumpRevealed && turn !== highestBidder) {
                    if (!partnerUnbeatable) {
                       setIsTrumpRevealed(true);
                       setMessage(`Player ${turn} revealed the Trump!`);
                       pSound('click');
                       if (trumpSuit && trumpSuit !== 'NT') checkAndDeclarePair(hands[highestBidder!], trumpSuit, highestBidder!);
                       return; 
                    }
                 }
                 if (isTrumpRevealed && trumpSuit && trumpSuit !== 'NT') {
                    const trumps = hand.filter(c => c.suit === trumpSuit);
                    if (trumps.length > 0) {
                       if (!partnerUnbeatable) validMoves = trumps;
                    }
                 }
              }
           }
           
           validMoves.sort((a, b) => b.value - a.value);
           
           if (currentTrick.length === 0) {
              playCard(validMoves[0]);
           } else {
              const currentWinner = getTrickWinner(currentTrick, trumpSuit);
              const isPartnerWinning = currentWinner?.playerId === (turn + 2) % 4;
              const partnerUnbeatable = isPartnerWinning && isCardUnbeatableInSuit(currentWinner!.card);
              
              if (partnerUnbeatable) {
                 // Partner is winning securely. Give max points (exclude trumps if possible).
                 if (isTrumpRevealed && trumpSuit && trumpSuit !== 'NT') {
                     const nonTrumps = validMoves.filter(c => c.suit !== trumpSuit);
                     if (nonTrumps.length > 0) validMoves = nonTrumps;
                 }
                 validMoves.sort((a, b) => b.points - a.points || b.value - a.value);
                 playCard(validMoves[0]);
              } else {
                 let winningCard = null;
                 for (let i = validMoves.length - 1; i >= 0; i--) {
                    const testTrick = [...currentTrick, { playerId: turn, card: validMoves[i], isTrumpRevealedAtPlay: isTrumpRevealed }];
                    const testWinner = getTrickWinner(testTrick, trumpSuit);
                    if (testWinner?.playerId === turn) {
                       winningCard = validMoves[i];
                       break;
                    }
                 }
                 if (winningCard) {
                    playCard(winningCard);
                 } else {
                    validMoves.sort((a, b) => a.points - b.points || a.value - b.value);
                    playCard(validMoves[0]);
                 }
              }
           }
        }, 1100);
        return () => clearTimeout(timer);
     }
  }, [gameState, turn, currentTrick, hands, leadSuit, isTrumpRevealed, trumpSuit, highestBidder, playedCards]);

  const getTrickWinner = (trick: TrickPlay[], tSuit: Suit | null): TrickPlay | null => {
      if (trick.length === 0) return null;
      let winner = trick[0];
      const lSuit = trick[0].card.suit;

      for (let i = 1; i < trick.length; i++) {
          const tPlay = trick[i];
          const isTrumpSuit = tPlay.card.suit === tSuit && tSuit !== 'NT';
          const winnerIsTrump = winner.card.suit === tSuit && winner.isTrumpRevealedAtPlay && tSuit !== 'NT';
          const isCurrentPlayTrump = isTrumpSuit && (tPlay.isTrumpRevealedAtPlay || isTrumpRevealed);

          if (isCurrentPlayTrump && !winnerIsTrump) {
             winner = tPlay;
          } else if (isCurrentPlayTrump && winnerIsTrump) {
             if (tPlay.card.value > winner.card.value) winner = tPlay;
          } else if (!isCurrentPlayTrump && !winnerIsTrump && tPlay.card.suit === lSuit) {
             if (tPlay.card.value > winner.card.value) winner = tPlay;
          }
      }
      return winner;
  };

  const playCard = (card: Card) => {
      if (currentTrick.length === 0) setLeadSuit(card.suit);

      const newHands = [...hands];
      newHands[turn] = newHands[turn].filter(c => c.id !== card.id);
      setHands(newHands);

      const currentlyRevealed = isTrumpRevealed || (turn === highestBidder);
      
      const newTrick = [...currentTrick, { playerId: turn, card, isTrumpRevealedAtPlay: currentlyRevealed }];
      setCurrentTrick(newTrick);
      pSound('click');

      // Check Pair when human plays after reveal
      if (turn === 0 && currentlyRevealed && trumpSuit) {
          checkAndDeclarePair(hands[highestBidder!], trumpSuit, highestBidder!);
      }

      if (newTrick.length === (isSingleHand ? 3 : 4)) {
          setTurn(-1); 
          setTimeout(() => {
              const winner = getTrickWinner(newTrick, trumpSuit);
              if (winner) {
                 const pointsEarned = newTrick.reduce((acc, curr) => acc + curr.card.points, 0);
                 const team = (winner.playerId === 0 || winner.playerId === 2) ? 1 : 2;
                 
                 const newPoints = { ...teamPoints };
                 newPoints[team] += pointsEarned;
                 
                 // Last trick extra point (if human has 0 cards, round over)
                 if (newHands[highestBidder!].length === 0) {
                    newPoints[team] += 1;
                 }
                 
                 setTeamPoints(newPoints);
                 setPlayedCards(prev => [...prev, ...newTrick.map(tp => tp.card)]);
                 setMessage(`Player ${winner.playerId === 0 ? 'You' : winner.playerId} claimed trick (${pointsEarned} pts).`);
                 
                 setCurrentTrick([]);
                 setLeadSuit(null);
                 setTurn(winner.playerId);

                 if (newHands[highestBidder!].length === 0) {
                    evaluateRound(newPoints);
                 }
              }
          }, 1800);
      } else {
          let nextTurn = (turn + 1) % 4;
          if (isSingleHand && nextTurn === (highestBidder! + 2) % 4) {
              nextTurn = (nextTurn + 1) % 4; // Skip partner
          }
          setTurn(nextTurn);
      }
  };

  const evaluateRound = (finalPoints: { 1: number, 2: number }) => {
     setGameState('ROUND_OVER');
     const bidTeam = bidderTeam;
     const target = Math.max(15, currentBid);
     
     // Apply Pairing points
     const t1Total = finalPoints[1] + pairPoints[1];
     const t2Total = finalPoints[2] + pairPoints[2];

     let t1MatchDelta = 0;
     let t2MatchDelta = 0;

     // Calculate match points with multiplier
     if (bidTeam === 1) {
        if (t1Total >= target) t1MatchDelta = gameMultiplier;
        else t1MatchDelta = -gameMultiplier;
     } else {
        if (t2Total >= target) t2MatchDelta = gameMultiplier;
        else t2MatchDelta = -gameMultiplier;
     }

     setMatchScore(prev => {
        const newScore = { 1: prev[1] + t1MatchDelta, 2: prev[2] + t2MatchDelta };
        
        let msg = `Scores - T1: ${t1Total} | T2: ${t2Total}. `;
        if ((bidTeam === 1 && t1Total >= target) || (bidTeam === 2 && t2Total >= target)) {
           msg += `Team ${bidTeam} WON the bid of ${target}!`;
           pSound('win');
        } else {
           msg += `Team ${bidTeam} FAILED the bid of ${target}.`;
        }
        
        if (newScore[1] >= 6 || newScore[2] <= -6) {
           setMessage(msg + ' TEAM 1 WINS THE SET!');
           setTimeout(() => setGameState('MATCH_OVER'), 2500);
        } else if (newScore[2] >= 6 || newScore[1] <= -6) {
           setMessage(msg + ' TEAM 2 WINS THE SET!');
           setTimeout(() => setGameState('MATCH_OVER'), 2500);
        } else {
           setMessage(msg);
        }
        return newScore;
     });
  };

  const handleHumanPlay = (card: Card) => {
     if (turn !== 0 || gameState !== 'PLAYING') return;

     if (leadSuit) {
        const hasFollowers = hands[0].some(c => c.suit === leadSuit);
        if (hasFollowers && card.suit !== leadSuit) {
           setMessage(`Must follow suit (${leadSuit})!`);
           return;
        }
        if (!hasFollowers && !isTrumpRevealed && highestBidder !== 0) {
           setIsTrumpRevealed(true);
           setMessage(`You revealed the Trump!`);
           pSound('click');
           if (trumpSuit) checkAndDeclarePair(hands[highestBidder!], trumpSuit, highestBidder!);
        }
     }
     
     playCard(card);
  };

  const SuitIcon = ({ suit, hidden, className }: { suit: Suit | null, hidden?: boolean, className?: string }) => {
     if (hidden || !suit) return <EyeOff className={`w-5 h-5 text-slate-500 ${className || ''}`} />;
     if (suit === 'NT') return <div className={`font-black tracking-tighter ${className || ''}`} style={{ fontSize: '1.2rem' }}>🃏</div>;
     if (suit === 'H') return <Heart className={`w-5 h-5 fill-red-500 text-red-500 ${className || ''}`} />;
     if (suit === 'D') return <Diamond className={`w-5 h-5 fill-red-500 text-red-500 ${className || ''}`} />;
     if (suit === 'C') return <Club className={`w-5 h-5 fill-slate-900 text-slate-900 ${className || ''}`} />;
     return <Spade className={`w-5 h-5 fill-slate-900 text-slate-900 ${className || ''}`} />;
  };

      if (gameState === 'IDLE') {
         return (
            <div className="flex flex-col items-center w-full max-w-lg mx-auto py-12 px-6 bg-[#0E3524] border-4 border-[#071A11] rounded-2xl shadow-[inset_0_4px_30px_rgba(0,0,0,0.5)] text-center text-white relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                <Spade className="w-16 h-16 text-yellow-500 mb-4 drop-shadow-lg" />
                <h3 className="text-3xl font-black text-white mb-8 font-display uppercase tracking-widest text-shadow">29 card</h3>
                <button onClick={startRound} className="bg-yellow-500 text-[#071A11] px-10 py-4 rounded-full font-black text-lg shadow-xl hover:scale-105 hover:bg-yellow-400 transition-all flex items-center gap-2 uppercase tracking-wide">
                   Deal Cards
                </button>
            </div>
         );
      }

  const renderCardFront = (card: Card, isPlayable: boolean, onClick?: () => void) => {
      const isRed = card.suit === 'H' || card.suit === 'D';
      return (
         <motion.div 
            layoutId={card.id}
            whileHover={isPlayable ? { scale: 1.05, y: -8, rotate: Math.random() * 4 - 2 } : {}}
            whileTap={isPlayable ? { scale: 0.95 } : {}}
            onClick={isPlayable ? onClick : undefined}
            className={`
               w-[60px] h-[85px] sm:w-[75px] sm:h-[105px] flex flex-col justify-between p-1.5 sm:p-2 rounded-lg shadow-xl bg-white border border-slate-200 select-none
               ${isPlayable ? 'cursor-pointer hover:shadow-2xl hover:border-yellow-400 ring-2 ring-transparent transition-all' : ''}
            `}
         >
            <div className={`text-sm sm:text-lg font-black ${isRed ? 'text-red-600' : 'text-slate-900'} flex items-start flex-col leading-none`}>
               <span>{card.rank}</span>
               <SuitIcon suit={card.suit} className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5" />
            </div>
            <div className={`text-xs sm:text-sm self-end font-bold opacity-30 ${isRed ? 'text-red-500' : 'text-slate-800'}`}>
               {card.points > 0 ? `${card.points}p` : ''}
            </div>
         </motion.div>
      );
  };

  const renderCardBack = (index: number) => (
      <motion.div 
         initial={{ opacity: 0, scale: 0.8 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ delay: index * 0.05 }}
         className="w-[45px] h-[65px] sm:w-[50px] sm:h-[70px] bg-red-800 rounded-md shadow-lg border-2 border-white/20 relative overflow-hidden" 
      >
         <div className="absolute inset-1 border border-white/10 rounded-sm bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)]" />
      </motion.div>
  );

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto rounded-3xl overflow-hidden bg-[#0A2E1D] dark:bg-[#071A11] border-4 border-[#164830] dark:border-white/10 p-2 sm:p-6 min-h-[550px] sm:min-h-[700px] relative shadow-2xl pb-10">
      
      {/* Decorative Felt Table edge */}
      <div className="absolute inset-0 border-8 border-black/20 rounded-2xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex justify-between w-full mb-6 px-4 items-center bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl py-3 shadow-inner">
        <div className="text-sm font-semibold text-white/90">
           Team 1 <span className="text-yellow-400 font-bold block sm:inline">(You & P2)</span>
           <div className="font-mono text-xl">{teamPoints[1] + pairPoints[1]} <span className="text-xs text-white/50">pts</span> | MT: {matchScore[1]}</div>
        </div>
        
        {/* Multipiler / Match Status Badge */}
        {gameMultiplier > 1 && (
           <div className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
              <Flame className="w-3 h-3" /> {gameMultiplier === 2 ? 'Doubled (x2)' : 'Redoubled (x4)'}
           </div>
        )}

        <div className="text-sm font-semibold text-white/90 text-right">
           Team 2 <span className="text-white/50 block sm:inline">(P1 & P3)</span>
           <div className="font-mono text-xl">{teamPoints[2] + pairPoints[2]} <span className="text-xs text-white/50">pts</span> | MT: {matchScore[2]}</div>
        </div>
      </div>

      <div className="text-center font-bold text-sm bg-yellow-400/90 text-yellow-950 px-6 py-2 rounded-full mb-6 shadow-xl backdrop-blur max-w-md w-full">
        {message}
      </div>
      
      {/* Trump Indicator */}
      {trumpSuit && (
          <div className="absolute top-24 right-6 flex flex-col items-center gap-1 bg-[#122A1E] px-4 py-3 rounded-xl shadow-xl border border-white/10 z-20">
             <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">Trump</span>
             <motion.div 
               animate={isTrumpRevealed ? { scale: [1, 1.5, 1], rotate: [0, -10, 10, 0] } : {}}
               transition={{ duration: 0.6, ease: "easeInOut" }}
               className="bg-white rounded-full p-1 border border-white/20"
             >
               <SuitIcon suit={trumpSuit} hidden={!isTrumpRevealed && highestBidder !== 0} className={(!isTrumpRevealed && highestBidder !== 0) ? 'text-black/20' : ''} />
             </motion.div>
             {!isTrumpRevealed && highestBidder !== 0 && (
                <span className="text-[10px] text-white/40 font-mono mt-1">Hidden</span>
             )}
          </div>
      )}

      {/* Main Play Area */}
      <div className="relative flex-1 w-full flex flex-col items-center justify-between pb-8">
         
         {/* Top (Player 2 - Partner) */}
         <div className="flex justify-center items-end gap-[-10px] sm:gap-2 h-20 mb-12 sm:mb-8 relative w-full pt-4">
            <span className="text-xs font-bold text-green-300/60 absolute top-[-10px] uppercase tracking-widest bg-[#0A2E1D] px-2">Partner {turn === 2 && <span className="text-yellow-400">●</span>}</span>
            <div className="flex gap-[-15px] sm:gap-1">
               {hands[2].map((_, i) => (
                   <React.Fragment key={i}>{renderCardBack(i)}</React.Fragment>
               ))}
            </div>
         </div>

         {/* Middle trick area + Left/Right players */}
         <div className="flex justify-between w-full items-center px-0 sm:px-10 flex-1">
            {/* Left (Player 3) */}
            <div className="flex flex-col items-center gap-1 sm:gap-2 relative w-16 sm:w-24">
               <span className="text-xs font-bold text-green-300/60 uppercase tracking-widest mb-2 bg-[#0A2E1D] px-1 rounded">P3 {turn === 3 && <span className="text-yellow-400">●</span>}</span>
               <div className="relative w-[50px] h-[120px] sm:w-[60px]">
                  {hands[3].map((_, i) => (
                     <div className="absolute left-0" style={{ top: i * 20 }} key={i}>
                        {renderCardBack(i)}
                     </div>
                  ))}
               </div>
            </div>

            {/* The Trick Table (Center) */}
            <div className="relative w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] flex items-center justify-center rounded-full bg-[#113C26]/50 border-4 border-[#164830]/80 shadow-[inset_0_10px_30px_rgba(0,0,0,0.5)]">
               {/* Center Decal */}
               <div className="absolute opacity-10 flex flex-col items-center">
                  <Spade className="w-16 h-16" />
                  <span className="font-display uppercase tracking-widest text-xs mt-2">29 Card Game</span>
               </div>
               
                <AnimatePresence>
                   {currentTrick.map((tr) => (
                      <motion.div 
                        key={tr.card.id} 
                        initial={{ scale: 0.5, opacity: 0, rotate: tr.playerId * 90 - 45 + (Math.random() * 20 - 10) }}
                        animate={{ scale: 1, opacity: 1, rotate: tr.playerId * 90 + (Math.random() * 10 - 5) }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="absolute shadow-2xl drop-shadow-2xl"
                        style={{
                           top: tr.playerId === 2 ? '5%' : tr.playerId === 0 ? '55%' : '30%',
                           left: tr.playerId === 3 ? '10%' : tr.playerId === 1 ? '50%' : '30%',
                           zIndex: tr.playerId
                        }}
                      >
                         {renderCardFront(tr.card, false)}
                      </motion.div>
                   ))}
                </AnimatePresence>
            </div>

            {/* Right (Player 1) */}
            <div className="flex flex-col items-center gap-1 sm:gap-2 relative w-16 sm:w-24">
               <span className="text-xs font-bold text-green-300/60 uppercase tracking-widest mb-2 bg-[#0A2E1D] px-1 rounded">P1 {turn === 1 && <span className="text-yellow-400">●</span>}</span>
               <div className="relative w-[50px] h-[120px] sm:w-[60px]">
                  {hands[1].map((_, i) => (
                     <div className="absolute right-0" style={{ top: i * 20 }} key={i}>
                        {renderCardBack(i)}
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Bottom (Human - Player 0) */}
         <div className="flex flex-col items-center mt-12 w-full pt-4 relative z-[45]">
            <span className="text-sm font-black text-white mb-4 uppercase tracking-widest bg-black/50 px-4 py-1 rounded-full drop-shadow">You {turn === 0 && <span className="text-yellow-400 ml-2 animate-pulse">● PLAY</span>}</span>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 z-10 w-full px-2 max-w-2xl">
               <AnimatePresence>
                  {hands[0].map((card) => (
                     <React.Fragment key={card.id}>
                        {renderCardFront(card, turn === 0 && gameState === 'PLAYING', () => handleHumanPlay(card))}
                     </React.Fragment>
                  ))}
               </AnimatePresence>
            </div>
         </div>
      </div>

      {/* Popups & Overlays */}
      {doublingStatus !== 'IDLE' && (
         <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-40">
            <div className="bg-[#113C26] p-8 rounded-3xl shadow-2xl flex flex-col items-center border border-white/20">
               {doublingStatus === 'AI_THINKING' && (
                  <h4 className="text-xl font-bold text-white uppercase tracking-widest animate-pulse">Opponents Thinking...</h4>
               )}
               {doublingStatus === 'P0_CAN_DOUBLE' && (
                  <>
                     <h4 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">DOUBLE THE BID?</h4>
                     <p className="text-sm text-green-200 mb-6">Opponents bid {Math.max(16, currentBid)}.</p>
                     <div className="flex gap-4">
                        <button onClick={() => handleHumanDoubleAction('DOUBLE')} className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold uppercase tracking-wider shadow-lg">Double (x2)</button>
                        <button onClick={() => handleHumanDoubleAction('PASS')} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold uppercase tracking-wider">Pass</button>
                     </div>
                  </>
               )}
               {doublingStatus === 'P0_CAN_REDOUBLE' && (
                  <>
                     <h4 className="text-2xl font-black text-white mb-2 uppercase tracking-wide text-red-400">THEY DOUBLED!</h4>
                     <p className="text-sm text-green-200 mb-6">Do you want to REDOUBLE?</p>
                     <div className="flex gap-4">
                        <button onClick={() => handleHumanDoubleAction('REDOUBLE')} className="px-6 py-3 bg-red-800 hover:bg-red-700 text-white border border-red-500 rounded-xl font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.5)]">Redouble (x4)</button>
                        <button onClick={() => handleHumanDoubleAction('PASS')} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold uppercase tracking-wider">Pass</button>
                     </div>
                  </>
               )}
            </div>
         </div>
      )}

      {gameState === 'BIDDING' && turn === 0 && activeBidders[0] && doublingStatus === 'IDLE' && (
         <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
            <div className="bg-[#113C26] p-8 rounded-3xl shadow-2xl flex flex-col items-center border border-white/20 max-w-sm w-full">
               <h4 className="text-2xl font-black text-white mb-1 uppercase tracking-wider text-shadow">Make Your Bid</h4>
               <p className="text-sm text-green-200 mb-8 font-medium">
                  Highest Bid: <span className="text-yellow-400 font-mono text-lg">{Math.max(14, currentBid)}</span>
                  {highestBidder !== null && (
                     <span className="block mt-1 text-white/70">
                        by {highestBidder === 2 ? 'Player 2 (Partner)' : `Player ${highestBidder} (Opponent)`}
                     </span>
                  )}
               </p>
               
               <div className="grid grid-cols-3 gap-3 w-full mb-6">
                  {Array.from({ length: 6 }).map((_, i) => {
                     const bidVal = Math.max(16, currentBid + 1) + i; // Min bid is 16 now per strict rules
                     if (bidVal > 28) return null;
                     return (
                        <button key={bidVal} onClick={() => handleHumanBid(bidVal)} className="py-3 bg-white/10 hover:bg-yellow-500 hover:text-black text-white rounded-xl font-bold transition-all border border-white/10 shadow-lg text-lg">
                           {bidVal}
                        </button>
                     );
                  })}
               </div>
               <button onClick={() => handleHumanBid('PASS')} className="w-full py-4 bg-black/40 text-white rounded-xl font-bold hover:bg-black/60 transition-colors uppercase tracking-widest text-sm border border-white/5">
                  Pass
               </button>
            </div>
         </div>
      )}

      {gameState === 'TRUMP_SELECTION' && turn === 0 && doublingStatus === 'IDLE' && (
         <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30 p-2">
            <div className="bg-[#113C26] p-4 sm:p-8 rounded-3xl shadow-2xl flex flex-col items-center border border-white/20 max-h-full overflow-y-auto w-full max-w-sm">
               <h4 className="text-xl sm:text-2xl font-black text-white mb-1 uppercase tracking-wide text-center">Select Trump Suit</h4>
               <p className="text-green-200 text-xs sm:text-sm mb-6 text-center">It will remain hidden until revealed.</p>
               <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
                  {(['H', 'S', 'D', 'C', 'NT'] as Suit[]).map(suit => (
                     <button key={suit} onClick={() => handleHumanTrumpSet(suit)} className="w-[18%] sm:w-20 aspect-[2/3] shrink-0 bg-white hover:bg-slate-200 hover:-translate-y-2 rounded-xl shadow-xl flex items-center justify-center transition-all flex-col gap-1 sm:gap-2">
                        <SuitIcon className="w-6 h-6 sm:w-10 sm:h-10" suit={suit} />
                        {suit === 'NT' && <span className="text-[8px] sm:text-[10px] font-black text-black">JOKER</span>}
                     </button>
                  ))}
               </div>
               <button onClick={handleSeventhCardSet} className="w-full sm:w-auto px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest rounded-full shadow-lg transition-transform hover:scale-105 text-xs sm:text-sm">
                  Or Pick 7th Card
               </button>
            </div>
         </div>
      )}

      {gameState === 'ROUND_OVER' && (
         <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-[#113C26] p-10 rounded-3xl shadow-2xl flex flex-col items-center border border-white/20 max-w-sm w-full text-center relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
               <Trophy className="w-16 h-16 text-yellow-500 mb-6 drop-shadow-xl" />
               <h4 className="text-3xl font-black text-white mb-4 uppercase tracking-widest shadow-black drop-shadow-md">Round Over</h4>
               <p className="text-green-200 text-lg mb-8 leading-relaxed font-medium">{message}</p>
               <button onClick={startRound} className="bg-yellow-500 text-[#071A11] px-10 py-4 rounded-full font-black text-lg shadow-xl hover:scale-105 hover:bg-yellow-400 transition-all flex items-center gap-3 uppercase tracking-wide w-full justify-center">
                  <RefreshCcw className="w-5 h-5" /> Next Round
               </button>
            </motion.div>
         </div>
      )}

      {gameState === 'MATCH_OVER' && (
         <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50">
            <motion.div 
               initial={{ scale: 0.8, opacity: 0, y: 50 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               className="bg-yellow-500 p-10 rounded-3xl shadow-[0_0_50px_rgba(234,179,8,0.5)] flex flex-col items-center border-4 border-yellow-300 max-w-md w-full text-center relative overflow-hidden"
            >
               <Trophy className="w-24 h-24 text-black mb-6 drop-shadow-lg" />
               <h4 className="text-4xl font-black text-black mb-2 uppercase tracking-widest text-shadow">Set OVER</h4>
               <p className="text-black/80 text-xl mb-8 font-bold leading-relaxed">{matchScore[1] >= 6 || matchScore[2] <= -6 ? 'Team 1 (You) WON!' : 'Team 2 WON!'}</p>
               <button onClick={() => { setMatchScore({1: 0, 2: 0}); startRound(); }} className="bg-black text-yellow-500 px-10 py-4 rounded-full font-black text-xl shadow-2xl hover:scale-105 transition-all w-full uppercase tracking-widest">
                  New Match
               </button>
            </motion.div>
         </div>
      )}

    </div>
  );
};
