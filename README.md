# Poker Buy-in Manager

A comprehensive web application for managing poker game buy-ins, tracking player chips, and calculating accurate end-game settlements. Features robust authentication, session management, and detailed transaction tracking.

## 🎯 Key Features

### Core Game Management
- **Flexible Buy-in Configuration**: Set custom chip amounts and dollar values per buy-in
- **Dynamic Player Management**: Add or remove players anytime during the game
- **Real-time Buy-in Tracking**: Track multiple buy-ins per player with +/- buttons
- **Optimized Settlement Calculator**: Automatically calculates minimum transactions between players
- **Zero Chip Support**: Handles players who end with 0 chips correctly
- **Accurate Payment Calculations**: Players only pay what they actually lost

### Authentication & Security
- **Gmail-based OTP Login**: Secure 6-digit one-time passcodes
- **Multi-level Admin System**: Super Admin, Admin, and Viewer roles
- **User Invitation System**: Admin-controlled user access
- **Read-only Default**: Invited users automatically get viewer access
- **Session Persistence**: 24-hour login sessions

### Data Management
- **Buy-in History Tracking**: Complete audit trail with exact timestamps
- **Historical Sessions**: Archive and review past games with detailed results
- **Persistent Storage**: All data saved in browser localStorage
- **Clean State Reset**: Fresh start after each game ends
- **Proof System**: Timestamped records for dispute resolution

### User Experience
- **Compact Interface**: Clean, space-efficient design
- **Responsive Layout**: Works on desktop and mobile devices
- **Real-time Updates**: Live session indicators and notifications
- **Intuitive Workflow**: Clear button states and progression

## 🚀 Quick Start

### 1. Authentication
- **Super Admin**: First user sets up the app with Gmail address
- **User Access**: Super Admin invites others (viewers by default)
- **Login**: Enter Gmail → Receive OTP → Login

### 2. Game Setup
- **Configure Settings**: Chips per buy-in (default: 100)
- **Set Value**: Dollar per buy-in (default: $20.00)
- **Start Session**: Begin tracking game

### 3. Player Management
- **Add Players**: Enter names and add to game
- **Track Buy-ins**: Use +/- buttons for each buy-in
- **Monitor Progress**: Update current chip counts

### 4. Settlement Process
- **Start Settlement**: Opens input fields for final chips
- **Enter Final Chips**: Include 0 chips for busted players
- **Calculate Settlement**: Shows optimized payment plan
- **Verify Payments**: Built-in verification ensures accuracy
- **End Session**: Complete and archive the game

## 📊 Settlement Algorithm

The settlement system uses an optimized algorithm that:

1. **Calculates Exact Profit/Loss**: Based on fixed chip value ($20 ÷ 100 chips = $0.20 per chip)
2. **Minimizes Transactions**: Payers pay winners directly with minimum transfers
3. **Prevents Overpayment**: Mathematical verification ensures accuracy
4. **Handles Zero Chips**: Properly processes players with no remaining chips

### Example Settlement
```
Players: Alice (-$100), Bob (+$60), Charlie (+$40)
Optimized Payments:
- Alice pays Bob $60
- Alice pays Charlie $40
Total Transactions: 2 (instead of 4+ in old system)
```

## 🔧 Technical Standards

### Code Quality
- **Vanilla JavaScript**: No frameworks, pure JS implementation
- **Modular Functions**: Clean, reusable function structure
- **Error Handling**: Comprehensive validation and user feedback
- **Performance**: Optimized for smooth user experience

### Security Standards
- **Input Validation**: All user inputs sanitized and validated
- **Role-based Access**: Strict permission controls
- **Session Management**: Secure OTP system with expiration
- **Data Integrity**: Prevents data corruption and loss

### Storage Standards
- **localStorage**: Persistent browser storage
- **Data Separation**: Auth, game, session, and historical data
- **Auto-save**: Periodic saving during active sessions
- **Clean Recovery**: Proper state restoration after closures

## 📁 File Structure

```
poker/
├── index.html          # Main application interface
├── script.js           # All application logic (1300+ lines)
├── README.md           # This documentation
└── .nojekyll           # GitHub Pages configuration
```

## 🌐 Deployment

### GitHub Pages
1. **Push to GitHub**: Code automatically deploys
2. **Access URL**: `https://username.github.io/poker/`
3. **Multi-user Access**: Share link for remote players
4. **No Server Required**: Static site hosting

### Local Development
1. **Open index.html**: Works directly in browser
2. **No Dependencies**: Runs offline once loaded
3. **Development Server**: Optional `python -m http.server` for testing

## 🎮 Game Rules & Standards

### Buy-in Standards
- **Fixed Chip Value**: Always based on buy-in rate (e.g., $20/100 chips)
- **Multiple Buy-ins**: Players can buy-in multiple times
- **Timestamp Tracking**: Every buy-in recorded with exact time
- **Proof System**: Complete audit trail for disputes

### Settlement Standards
- **Zero Chip Handling**: Players can end with 0 chips
- **Exact Calculations**: No rounding errors or approximations
- **Optimized Payments**: Minimum number of transactions
- **Verification System**: Built-in accuracy checks

### Session Standards
- **Persistent Sessions**: Survive browser closures
- **Clean Reset**: Fresh start after game ends
- **Historical Archive**: Complete game records preserved
- **Admin Control**: Only admins can complete sessions

## 🔍 Troubleshooting

### Common Issues
- **0 Chips Not Working**: Ensure input field contains "0" (not empty)
- **Overpayment Concerns**: Check verification section for accuracy
- **Session Not Saving**: Verify browser localStorage is enabled
- **Login Issues**: Check Gmail address format and OTP entry

### Debug Features
- **Payment Verification**: Shows exact amounts paid vs lost
- **Buy-in History**: Complete timestamped transaction log
- **Session Indicators**: Real-time status displays
- **Error Messages**: Clear user guidance for issues

## 📱 Browser Compatibility

- **Chrome/Chromium**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile**: Responsive design works on all modern browsers

## 🎯 Best Practices

### For Game Hosts
- **Regular Updates**: Update chip counts during gameplay
- **Clear Communication**: Explain settlement process to players
- **Use Verification**: Show payment verification to build trust
- **Archive Sessions**: Keep historical records for reference

### For Players
- **Check Buy-ins**: Verify your buy-in history if questions arise
- **Understand Settlement**: Review how payments are calculated
- **Trust the System**: Built-in verification prevents errors

## 🚀 Future Enhancements

### Planned Features
- **Mobile App**: Native mobile application
- **Advanced Analytics**: Player statistics and trends
- **Multi-table Support**: Manage multiple poker tables
- **Integration**: Payment processor integration

### Technical Improvements
- **Database Backend**: Optional cloud storage
- **Real-time Sync**: Multi-device synchronization
- **Advanced Security**: Two-factor authentication
- **API Access**: Third-party integrations

---

## 📞 Support

For issues, questions, or feature requests:
1. **Check Buy-in History**: Verify transaction timestamps
2. **Review Settlement**: Use built-in verification system
3. **Clear Cache**: Refresh browser if issues persist
4. **Contact Admin**: Reach out to your game administrator

Enjoy accurate, fair, and transparent poker game management! 🎰♠️
