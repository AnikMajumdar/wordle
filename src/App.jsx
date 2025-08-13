import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

const WORD_LENGTH = 6;
const MAX_ATTEMPTS = 6;

const WordleGame = () => {
  const [targetWord, setTargetWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [currentRow, setCurrentRow] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invalidWord, setInvalidWord] = useState(false);

  // Fallback words in case API fails
  const fallbackWords = ['PYTHON', 'PUZZLE', 'GALAXY', 'JUNGLE', 'WIZARD', 'FROZEN', 'CASTLE', 'BRIDGE'];

  const getRandomWord = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Try to get a random 6-letter word from dictionary API
      const response = await fetch('https://api.datamuse.com/words?sp=??????&max=100');
      const data = await response.json();
      
      if (data && data.length > 0) {
        const randomIndex = Math.floor(Math.random() * Math.min(data.length, 50));
        const word = data[randomIndex].word.toUpperCase();
        if (word.length === WORD_LENGTH && /^[A-Z]+$/.test(word)) {
          setTargetWord(word);
        } else {
          // Fallback to predefined words
          const fallbackWord = fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
          setTargetWord(fallbackWord);
        }
      } else {
        throw new Error('No words found');
      }
    } catch (err) {
      console.error('Error fetching word:', err);
      // Use fallback word
      const fallbackWord = fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
      setTargetWord(fallbackWord);
    } finally {
      setLoading(false);
    }
  };

  const validateWord = async (word) => {
    try {
      // First check with exact spelling
      const exactResponse = await fetch(`https://api.datamuse.com/words?sp=${word.toLowerCase()}&max=1`);
      const exactData = await exactResponse.json();
      
      if (exactData && exactData.length > 0 && exactData[0].word.toUpperCase() === word.toUpperCase()) {
        return true;
      }
      
      // If exact match fails, try the dictionary API as fallback
      const dictResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
      const dictData = await dictResponse.json();
      
      return dictData && !dictData.title; // title exists when word is not found
    } catch (err) {
      console.error('Validation error:', err);
      // If both APIs fail, reject obviously invalid words like repeated letters
      const hasRepeatedPattern = /(.)\1{2,}/.test(word); // 3+ consecutive same letters
      const isAllSameLetter = new Set(word).size === 1; // all letters are the same
      
      if (hasRepeatedPattern || isAllSameLetter) {
        return false;
      }
      
      // For other cases when APIs are down, allow reasonable looking words
      return word.length === WORD_LENGTH && /^[A-Z]+$/.test(word);
    }
  };

  useEffect(() => {
    getRandomWord();
  }, []);

  const getLetterStatus = (letter, position, word) => {
    if (word[position] === targetWord[position]) {
      return 'correct';
    } else if (targetWord.includes(letter)) {
      return 'present';
    } else {
      return 'absent';
    }
  };

  const handleKeyPress = useCallback((event) => {
    if (gameStatus !== 'playing') return;

    const key = event.key.toUpperCase();
    
    if (key === 'ENTER') {
      handleSubmitGuess();
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + key);
      setInvalidWord(false);
    }
  }, [currentGuess, gameStatus]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const handleSubmitGuess = async () => {
    if (currentGuess.length !== WORD_LENGTH) return;
    
    setInvalidWord(false);
    
    // Show loading state during validation
    const isValid = await validateWord(currentGuess);
    
    if (!isValid) {
      setInvalidWord(true);
      setTimeout(() => setInvalidWord(false), 2000);
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentRow(prev => prev + 1);

    if (currentGuess === targetWord) {
      setGameStatus('won');
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameStatus('lost');
    }

    setCurrentGuess('');
  };

  const resetGame = () => {
    setCurrentGuess('');
    setGuesses([]);
    setGameStatus('playing');
    setCurrentRow(0);
    setError('');
    setInvalidWord(false);
    getRandomWord();
  };

  const renderGrid = () => {
    const rows = [];
    
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const guess = guesses[i] || '';
      const isCurrentRow = i === currentRow && gameStatus === 'playing';
      const currentRowGuess = isCurrentRow ? currentGuess : '';
      
      const row = [];
      for (let j = 0; j < WORD_LENGTH; j++) {
        const letter = guess[j] || currentRowGuess[j] || '';
        const status = guess[j] ? getLetterStatus(guess[j], j, guess) : '';
        
        row.push(
          <div
            key={`${i}-${j}`}
            className={`
              w-14 h-14 border-2 flex items-center justify-center text-xl font-bold
              ${letter ? 'border-gray-400' : 'border-gray-300'}
              ${status === 'correct' ? 'bg-green-500 text-white border-green-500' : ''}
              ${status === 'present' ? 'bg-yellow-500 text-white border-yellow-500' : ''}
              ${status === 'absent' ? 'bg-gray-500 text-white border-gray-500' : ''}
              ${isCurrentRow && invalidWord ? 'animate-pulse border-red-500' : ''}
              transition-all duration-200
            `}
          >
            {letter}
          </div>
        );
      }
      
      rows.push(
        <div key={i} className="flex gap-2 justify-center">
          {row}
        </div>
      );
    }
    
    return rows;
  };

  const renderKeyboard = () => {
    const rows = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
    ];

    const getKeyStatus = (key) => {
      let status = '';
      for (const guess of guesses) {
        if (guess.includes(key)) {
          const positions = guess.split('').map((letter, index) => 
            letter === key ? index : -1
          ).filter(pos => pos !== -1);
          
          for (const pos of positions) {
            const letterStatus = getLetterStatus(key, pos, guess);
            if (letterStatus === 'correct') {
              status = 'correct';
              break;
            } else if (letterStatus === 'present' && status !== 'correct') {
              status = 'present';
            } else if (letterStatus === 'absent' && !status) {
              status = 'absent';
            }
          }
        }
      }
      return status;
    };

    return rows.map((row, rowIndex) => (
      <div key={rowIndex} className="flex gap-1 justify-center">
        {row.map((key) => {
          const status = getKeyStatus(key);
          const isSpecial = key === 'ENTER' || key === '⌫';
          
          return (
            <button
              key={key}
              onClick={() => {
                if (key === 'ENTER') {
                  handleSubmitGuess();
                } else if (key === '⌫') {
                  setCurrentGuess(prev => prev.slice(0, -1));
                } else if (currentGuess.length < WORD_LENGTH && /^[A-Z]$/.test(key)) {
                  setCurrentGuess(prev => prev + key);
                  setInvalidWord(false);
                }
              }}
              className={`
                px-2 py-3 rounded text-sm font-semibold min-w-10 h-12
                ${isSpecial ? 'px-4 text-xs' : ''}
                ${status === 'correct' ? 'bg-green-500 text-white' : ''}
                ${status === 'present' ? 'bg-yellow-500 text-white' : ''}
                ${status === 'absent' ? 'bg-gray-500 text-white' : ''}
                ${!status ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : ''}
                transition-colors duration-200 active:scale-95
              `}
              disabled={gameStatus !== 'playing'}
            >
              {key}
            </button>
          );
        })}
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading word...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Wordle</h1>
          <button
            onClick={resetGame}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="New Game"
          >
            <RotateCcw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Game Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-md w-full space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Invalid Word Message */}
          {invalidWord && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded text-center">
              Not a valid word!
            </div>
          )}

          {/* Game Status */}
          {gameStatus === 'won' && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center">
              🎉 Congratulations! You guessed the word!
            </div>
          )}
          
          {gameStatus === 'lost' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
              Game over! The word was: <strong>{targetWord}</strong>
            </div>
          )}

          {/* Game Grid */}
          <div className="space-y-2">
            {renderGrid()}
          </div>

          {/* Virtual Keyboard */}
          <div className="space-y-2 mt-8">
            {renderKeyboard()}
          </div>

          {/* Instructions */}
          <div className="text-center text-sm text-gray-600 space-y-1">
            <p>Guess the 6-letter word in {MAX_ATTEMPTS} tries!</p>
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Correct</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Wrong position</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-500 rounded"></div>
                <span>Not in word</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WordleGame;