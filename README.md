# Suresh's Poker Buy-in Manager

A user-friendly web application for managing poker game buy-ins, tracking player chips, and calculating end-game settlements. Created by Suresh with robust authentication and session management features.

## Features

- **Flexible Buy-in Configuration**: Set custom chip amounts and dollar values per buy-in
- **Dynamic Player Management**: Add or remove players anytime during the game
- **Real-time Buy-in Tracking**: Track multiple buy-ins per player with +/- buttons
- **Current Chip Tracking**: Manually update each player's current chip count
- **End-Game Settlement Calculator**: Automatically calculate who owes whom
- **Persistent Storage**: Game state is saved in browser localStorage
- **Responsive Design**: Works on desktop and mobile devices
- **Poker-themed UI**: Beautiful green felt design with intuitive controls
- **Robust Authentication**: Gmail-based OTP login with admin approval workflow
- **Multi-level Admin System**: Super Admin, Admin, and Viewer roles
- **Session Management**: Persistent sessions that survive browser closures
- **Double Confirmation**: Prevents accidental session completion

## How to Use

### 1. Set Up Game Settings
- Configure "Chips per Buy-in" (default: 100)
- Set "Dollar Value per Buy-in" (default: $20.00)
- Click "Update Settings" to save

### 2. Add Players
- Enter player name in the "Add Player" field
- Click "Add Player" or press Enter
- Players can be added anytime during the game

### 3. Track Buy-ins
- Use the + and - buttons next to each player to add/remove buy-ins
- Each buy-in adds chips to the player's total and current chips
- Total spent amount is automatically calculated

### 4. Update Current Chips
- Manually enter each player's current chip count as the game progresses
- This helps track who's winning or losing during the game

### 5. End Game Settlement
- Click "Start End Game" when the poker game is finished
- Enter each player's final chip count
- Click "Calculate Settlement" to see:
  - Total money in play
  - Each player's profit/loss
  - Suggested settlements between players

## Example Scenario

1. **Setup**: 100 chips = $20 per buy-in
2. **Players**: Alice, Bob, Charlie join
3. **Buy-ins**: 
   - Alice: 2 buy-ins (200 chips, $40)
   - Bob: 1 buy-in (100 chips, $20)
   - Charlie: 3 buy-ins (300 chips, $60)
4. **Final chips**: Alice 150, Bob 250, Charlie 200
5. **Settlement**: App calculates who owes whom based on final chip distribution

## Technical Details

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Storage**: Browser localStorage for game persistence
- **Design**: Responsive, mobile-friendly interface
- **Icons**: Font Awesome for UI icons
- **Animations**: Smooth transitions and micro-interactions

## File Structure

```
poker/
├── index.html      # Main application interface
├── script.js       # All application logic
└── README.md       # This documentation
```

## Getting Started

1. Open `index.html` in any modern web browser
2. No installation or server required - runs entirely in the browser
3. Game state is automatically saved and will persist between sessions

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Any modern browser with JavaScript enabled

## Tips for Best Use

- Update current chips regularly during the game
- Use the settlement calculator at the end to avoid manual math errors
- Game state saves automatically, so you won't lose data if you refresh
- The app works offline once loaded

Enjoy managing your poker games with ease! 🎰
