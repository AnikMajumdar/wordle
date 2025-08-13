# Wordle Game

A modern, interactive implementation of the popular Wordle word-guessing game built with React. This version features a clean interface, real-time word validation, and both keyboard and mouse input support.

## Features

- **6-letter word guessing game** with 6 attempts
- **Real-time word validation** using external dictionary APIs
- **Interactive virtual keyboard** with visual feedback
- **Physical keyboard support** for seamless gameplay
- **Color-coded feedback system**:
  - 🟢 Green: Correct letter in correct position
  - 🟡 Yellow: Correct letter in wrong position
  - ⚫ Gray: Letter not in the word
- **Automatic word generation** from online dictionary
- **Fallback word system** when APIs are unavailable
- **Responsive design** optimized for various screen sizes
- **Game state management** with win/lose detection
- **Reset functionality** to start new games

## How to Play

1. **Objective**: Guess the 6-letter word in 6 attempts or fewer
2. **Input**: Type letters using your keyboard or click the virtual keyboard
3. **Submit**: Press Enter or click "ENTER" to submit your guess
4. **Feedback**: Each letter will be colored based on its correctness:
   - Green: Right letter, right position
   - Yellow: Right letter, wrong position
   - Gray: Letter not in the word
5. **Win**: Guess the word correctly within 6 attempts
6. **New Game**: Click the refresh icon to start over

## Technical Details

### Built With
- **React 18+** with modern hooks (useState, useEffect, useCallback)
- **Tailwind CSS** for styling and responsive design
- **Lucide React** for icons
- **External APIs** for word generation and validation

### APIs Used
- **Datamuse API**: Primary source for random 6-letter words and word validation
- **Dictionary API**: Fallback validation service
- **Offline fallback**: Predefined word list when APIs are unavailable

### Key Components
- **WordleGame**: Main game component handling all game logic
- **Grid System**: Dynamic rendering of guess attempts
- **Virtual Keyboard**: Interactive on-screen keyboard with status indicators
- **Word Validation**: Dual-API validation system with intelligent fallbacks

## Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone or download** the project files
2. **Install dependencies**:
   ```bash
   npm install react react-dom lucide-react
   ```
3. **Install Tailwind CSS** (if not already configured):
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
4. **Configure Tailwind** in your `tailwind.config.js`:
   ```javascript
   module.exports = {
     content: ["./src/**/*.{js,jsx,ts,tsx}"],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```
5. **Add Tailwind directives** to your CSS file:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

### Running the Application

1. **Development mode**:
   ```bash
   npm start
   ```
2. **Build for production**:
   ```bash
   npm run build
   ```

## File Structure

```
worldeApp/
├── main.jsx          # Main Wordle game component
├── README.md         # This file
└── package.json      # Dependencies and scripts
```

## Game Configuration

The game includes several configurable constants:

- `WORD_LENGTH`: Set to 6 (can be modified for different word lengths)
- `MAX_ATTEMPTS`: Set to 6 (maximum number of guesses allowed)
- `fallbackWords`: Array of backup words when APIs fail

## Error Handling

The application includes robust error handling:

- **API failures**: Automatic fallback to predefined word list
- **Invalid words**: Real-time validation with user feedback
- **Network issues**: Graceful degradation with offline word validation
- **Input validation**: Prevents invalid characters and enforces word length

## Browser Compatibility

- Modern browsers supporting ES6+ features
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers with touch support

## Performance Features

- **Async word validation** to prevent UI blocking
- **Efficient re-rendering** using React hooks
- **Optimized keyboard event handling**
- **Minimal API calls** with intelligent caching

## Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Inspired by the original Wordle game by Josh Wardle
- Uses Datamuse API for word generation
- Built with React and Tailwind CSS
- Icons provided by Lucide React

---

**Enjoy playing Wordle!** 🎯📝