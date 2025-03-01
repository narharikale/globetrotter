import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ClueCard } from '../components/ClueCard';
import { OptionButton } from '../components/OptionButton';
import { ResultCard } from '../components/ResultCard';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { ShareButton } from '../components/ShareButton';
import { UsernameForm } from '../components/UsernameForm';

export const GamePage: React.FC = () => {
  const {
    currentDestination,
    options,
    selectedOption,
    isCorrect,
    score,
    username,
    isGameStarted,
    showResult,
    factToShow,
    startGame,
    loadNewQuestion,
    selectOption,
    playAgain,
  } = useGameStore();

  useEffect(() => {
    // Check if there's an invite parameter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const inviteUsername = urlParams.get('invite');
    
    if (inviteUsername) {
      // In a real app, we would fetch the user's score from the backend
      console.log(`Invited by: ${inviteUsername}`);
    }
  }, []);

  if (!isGameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <UsernameForm onSubmit={startGame} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <ScoreDisplay correct={score.correct} incorrect={score.incorrect} username={username} />
          <ShareButton username={username} score={score} />
        </div>

        {currentDestination && !showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ClueCard clues={currentDestination.clues} />
            
            <h3 className="text-xl font-semibold mt-8 mb-4">Select the correct destination:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {options.map((option) => (
                <OptionButton
                  key={option.city}
                  city={option.city}
                  country={option.country}
                  selected={selectedOption === option.city}
                  onClick={() => selectOption(option.city)}
                  disabled={!!selectedOption}
                />
              ))}
            </div>
          </motion.div>
        )}

        {showResult && currentDestination && (
          <ResultCard
            isCorrect={isCorrect || false}
            factToShow={factToShow}
            destination={`${currentDestination.city}, ${currentDestination.country}`}
            onNext={playAgain}
          />
        )}
      </div>
    </div>
  );
};