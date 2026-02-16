// Authentication state
let authState = {
    currentUser: null,
    users: [],
    accessRequests: [],
    otpCodes: new Map()
};

// Game state
let gameState = {
    chipsPerBuyin: 100,
    dollarPerBuyin: 20,
    players: [],
    endGameMode: false,
    sessionActive: false,
    sessionStartedAt: null,
    sessionCompleted: false
};

// Session management
let sessionState = {
    id: null,
    startedAt: null,
    isActive: false,
    completed: false,
    completedAt: null,
    completedBy: null
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadAuthState();
    loadGameState();
    loadSessionState();
    
    // Initialize admin user if first time
    if (authState.users.length === 0) {
        initializeAdmin();
    }
    
    // Check if user is already logged in
    const savedSession = localStorage.getItem('pokerSession');
    if (savedSession) {
        const session = JSON.parse(savedSession);
        if (session.expires > Date.now()) {
            authState.currentUser = session.user;
            showMainApp();
        } else {
            localStorage.removeItem('pokerSession');
        }
    }
    
    // Auto-save session periodically
    setInterval(() => {
        if (sessionState.isActive) {
            saveSessionState();
        }
    }, 30000); // Save every 30 seconds
    
    updateAuthDisplay();
});

// Initialize admin user
function initializeAdmin() {
    const adminEmail = prompt('Enter your SUPER ADMIN Gmail address to initialize the app:');
    if (adminEmail && adminEmail.includes('@gmail.com')) {
        authState.users.push({
            id: Date.now(),
            email: adminEmail,
            role: 'super_admin',
            status: 'approved',
            createdAt: new Date().toISOString(),
            addedBy: 'system'
        });
        saveAuthState();
        alert(`Super Admin account created: ${adminEmail}\n\nYou can now add other admins and manage the system.`);
    } else {
        alert('Valid Gmail address required for super admin setup');
        initializeAdmin();
    }
}

// Load authentication state
function loadAuthState() {
    const saved = localStorage.getItem('pokerAuthState');
    if (saved) {
        authState = JSON.parse(saved);
        // Convert otpCodes back to Map
        if (authState.otpCodes && Array.isArray(authState.otpCodes)) {
            authState.otpCodes = new Map(authState.otpCodes);
        } else {
            authState.otpCodes = new Map();
        }
    }
}

// Save authentication state
function saveAuthState() {
    // Convert Map to array for localStorage
    const stateToSave = {
        ...authState,
        otpCodes: Array.from(authState.otpCodes.entries())
    };
    localStorage.setItem('pokerAuthState', JSON.stringify(stateToSave));
}

// Load game state
function loadGameState() {
    const saved = localStorage.getItem('pokerGameState');
    if (saved) {
        gameState = JSON.parse(saved);
    }
}

// Load session state
function loadSessionState() {
    const saved = localStorage.getItem('pokerSessionState');
    if (saved) {
        sessionState = JSON.parse(saved);
        
        // Check if there's an active session that hasn't been properly completed
        if (sessionState.isActive && !sessionState.completed) {
            console.log('Active session detected from previous session');
            // Session will be restored when user logs in
        }
    }
}

// Save session state
function saveSessionState() {
    localStorage.setItem('pokerSessionState', JSON.stringify(sessionState));
}

// Save game state to localStorage
function saveGameState() {
    localStorage.setItem('pokerGameState', JSON.stringify(gameState));
}

// Request OTP
function requestOTP() {
    const email = document.getElementById('emailInput').value.trim();
    
    if (!email) {
        alert('Please enter your email address');
        return;
    }
    
    if (!email.includes('@gmail.com')) {
        alert('Only Gmail addresses are supported');
        return;
    }
    
    // Check if user exists
    const user = authState.users.find(u => u.email === email);
    
    if (!user) {
        // Show request access form
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('requestForm').classList.remove('hidden');
        return;
    }
    
    if (user.status !== 'approved') {
        alert('Your account is pending approval. Please contact the admin.');
        return;
    }
    
    // Generate and store OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    authState.otpCodes.set(email, {
        code: otp,
        expires: Date.now() + 300000 // 5 minutes
    });
    saveAuthState();
    
    // Show OTP form (in real app, this would be emailed)
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('otpForm').classList.remove('hidden');
    
    // For demo purposes, show the OTP in console
    console.log(`OTP for ${email}: ${otp}`);
    alert(`OTP sent to ${email}. Check console for demo OTP: ${otp}`);
}

// Verify OTP
function verifyOTP() {
    const email = document.getElementById('emailInput').value.trim();
    const otp = document.getElementById('otpInput').value;
    
    const storedOTP = authState.otpCodes.get(email);
    
    if (!storedOTP || storedOTP.expires < Date.now()) {
        alert('OTP expired or invalid. Please request a new one.');
        backToLogin();
        return;
    }
    
    if (storedOTP.code !== otp) {
        alert('Invalid OTP. Please try again.');
        return;
    }
    
    // Login successful
    const user = authState.users.find(u => u.email === email);
    authState.currentUser = user;
    
    // Clear OTP
    authState.otpCodes.delete(email);
    saveAuthState();
    
    // Create session
    const session = {
        user: user,
        expires: Date.now() + 86400000 // 24 hours
    };
    localStorage.setItem('pokerSession', JSON.stringify(session));
    
    showMainApp();
}

// Request access
function requestAccess() {
    const email = document.getElementById('emailInput').value.trim();
    const message = document.getElementById('requestMessage').value.trim();
    
    // Check if request already exists
    const existingRequest = authState.accessRequests.find(r => r.email === email);
    if (existingRequest) {
        alert('Access request already sent. Please wait for admin approval.');
        return;
    }
    
    // Create access request
    authState.accessRequests.push({
        id: Date.now(),
        email: email,
        message: message,
        requestedAt: new Date().toISOString(),
        status: 'pending'
    });
    
    saveAuthState();
    
    alert('Access request sent to admin. You will be notified when approved.');
    backToLogin();
}

// Back to login
function backToLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('otpForm').classList.add('hidden');
    document.getElementById('requestForm').classList.add('hidden');
    document.getElementById('emailInput').value = '';
    document.getElementById('otpInput').value = '';
    document.getElementById('requestMessage').value = '';
}

// Show main app
function showMainApp() {
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    
    // Update user info display
    document.getElementById('userEmail').textContent = authState.currentUser.email;
    const roleDisplay = authState.currentUser.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    document.getElementById('userRole').textContent = roleDisplay;
    
    // Show admin panel if admin or super admin
    if (authState.currentUser.role === 'admin' || authState.currentUser.role === 'super_admin') {
        document.getElementById('adminPanel').classList.remove('hidden');
        updateAdminPanel();
    }
    
    // Restore session if exists
    if (sessionState.isActive && !sessionState.completed) {
        restoreSession();
    }
    
    // Disable editing for read-only users
    if (authState.currentUser.role === 'viewer') {
        disableEditing();
    }
    
    updateDisplay();
}

// Update admin panel
function updateAdminPanel() {
    updateUserList();
    updateAccessRequests();
    updateSessionInfo();
}

// Update session info
function updateSessionInfo() {
    const sessionInfo = document.getElementById('sessionInfo');
    if (!sessionInfo) {
        // Create session info section if it doesn't exist
        const adminPanel = document.getElementById('adminPanel');
        const sessionDiv = document.createElement('div');
        sessionDiv.className = 'mt-6 p-4 bg-yellow-500/20 rounded-lg';
        sessionDiv.id = 'sessionInfoSection';
        sessionDiv.innerHTML = `
            <h3 class="text-lg font-semibold mb-3">Session Management</h3>
            <div id="sessionInfo">
                <!-- Session info will be displayed here -->
            </div>
            <div class="mt-3 flex gap-2">
                <button onclick="startNewSession()" id="startSessionBtn"
                        class="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-sm transition-colors">
                    <i class="fas fa-play"></i> Start Session
                </button>
                <button onclick="completeSession()" id="completeSessionBtn"
                        class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm transition-colors" disabled>
                    <i class="fas fa-stop"></i> Complete Session
                </button>
            </div>
        `;
        adminPanel.appendChild(sessionDiv);
    }
    
    updateSessionDisplay();
}

// Update session display
function updateSessionDisplay() {
    const sessionInfo = document.getElementById('sessionInfo');
    const startBtn = document.getElementById('startSessionBtn');
    const completeBtn = document.getElementById('completeSessionBtn');
    const sessionIndicator = document.getElementById('sessionIndicator');
    const sessionStatus = document.getElementById('sessionStatus');
    
    if (!sessionState.isActive) {
        if (sessionInfo) sessionInfo.innerHTML = '<p class="text-sm text-green-200">No active session</p>';
        if (startBtn) startBtn.disabled = false;
        if (completeBtn) completeBtn.disabled = true;
        if (sessionIndicator) {
            sessionIndicator.classList.add('hidden');
        }
    } else {
        const startTime = new Date(sessionState.startedAt).toLocaleString();
        const duration = Math.floor((Date.now() - sessionState.startedAt) / 60000);
        if (sessionInfo) {
            sessionInfo.innerHTML = `
                <p class="text-sm"><strong>Session ID:</strong> ${sessionState.id}</p>
                <p class="text-sm"><strong>Started:</strong> ${startTime}</p>
                <p class="text-sm"><strong>Duration:</strong> ${duration} minutes</p>
                <p class="text-sm text-yellow-300">Session is active and will persist across browser closures</p>
            `;
        }
        if (startBtn) startBtn.disabled = true;
        if (completeBtn) completeBtn.disabled = false;
        if (sessionIndicator && sessionStatus) {
            sessionIndicator.classList.remove('hidden');
            sessionStatus.textContent = `Session Active (${duration} min)`;
        }
    }
}

// Update user list
function updateUserList() {
    const userList = document.getElementById('userList');
    userList.innerHTML = authState.users.map(user => {
        const roleDisplay = user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        const canManage = authState.currentUser.role === 'super_admin' || 
                        (authState.currentUser.role === 'admin' && user.role === 'viewer');
        
        return `
        <div class="flex justify-between items-center p-2 bg-white/10 rounded">
            <div>
                <div class="font-medium">${user.email}</div>
                <div class="text-xs text-green-200">${roleDisplay} • ${user.status}</div>
                ${user.addedBy ? `<div class="text-xs text-yellow-200">Added by: ${user.addedBy}</div>` : ''}
            </div>
            ${canManage && user.role !== 'super_admin' ? `
                <button onclick="removeUser(${user.id})" class="text-red-400 hover:text-red-300">
                    <i class="fas fa-trash"></i>
                </button>
            ` : ''}
        </div>
    `;
    }).join('');
}

// Update access requests
function updateAccessRequests() {
    const requestsContainer = document.getElementById('accessRequests');
    
    if (authState.accessRequests.length === 0) {
        requestsContainer.innerHTML = '<p class="text-sm text-green-200">No pending requests</p>';
        return;
    }
    
    requestsContainer.innerHTML = authState.accessRequests.map(request => `
        <div class="p-3 bg-white/10 rounded">
            <div class="font-medium">${request.email}</div>
            ${request.message ? `<div class="text-sm text-green-200 mb-2">${request.message}</div>` : ''}
            <div class="flex gap-2">
                <button onclick="approveRequest(${request.id})" class="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm">
                    Approve
                </button>
                <button onclick="rejectRequest(${request.id})" class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm">
                    Reject
                </button>
            </div>
        </div>
    `).join('');
}

// Invite user
function inviteUser() {
    const email = document.getElementById('inviteEmail').value.trim();
    
    if (!email || !email.includes('@gmail.com')) {
        alert('Please enter a valid Gmail address');
        return;
    }
    
    // Check if user already exists
    if (authState.users.find(u => u.email === email)) {
        alert('User already exists');
        return;
    }
    
    // Determine available roles based on current user's role
    let availableRoles = ['viewer'];
    if (authState.currentUser.role === 'super_admin') {
        availableRoles = ['viewer', 'admin'];
    }
    
    const roleOptions = availableRoles.map((role, index) => 
        `${index + 1}. ${role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`
    ).join('\n');
    
    const roleChoice = prompt(`Select role for ${email}:\n${roleOptions}\n\nEnter number (1-${availableRoles.length}):`);
    
    if (!roleChoice || !availableRoles[parseInt(roleChoice) - 1]) {
        alert('Invalid role selection');
        return;
    }
    
    const selectedRole = availableRoles[parseInt(roleChoice) - 1];
    
    // Add user
    authState.users.push({
        id: Date.now(),
        email: email,
        role: selectedRole,
        status: 'approved',
        createdAt: new Date().toISOString(),
        addedBy: authState.currentUser.email
    });
    
    saveAuthState();
    updateAdminPanel();
    
    document.getElementById('inviteEmail').value = '';
    const roleDisplay = selectedRole.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    alert(`User ${email} added with ${roleDisplay} access`);
}

// Approve request
function approveRequest(requestId) {
    const request = authState.accessRequests.find(r => r.id === requestId);
    if (!request) return;
    
    // Add user with viewer role
    authState.users.push({
        id: Date.now(),
        email: request.email,
        role: 'viewer',
        status: 'approved',
        createdAt: new Date().toISOString()
    });
    
    // Remove request
    authState.accessRequests = authState.accessRequests.filter(r => r.id !== requestId);
    
    saveAuthState();
    updateAdminPanel();
    
    alert(`Access approved for ${request.email}`);
}

// Reject request
function rejectRequest(requestId) {
    const request = authState.accessRequests.find(r => r.id === requestId);
    if (!request) return;
    
    // Remove request
    authState.accessRequests = authState.accessRequests.filter(r => r.id !== requestId);
    
    saveAuthState();
    updateAdminPanel();
    
    alert(`Access rejected for ${request.email}`);
}

// Remove user
function removeUser(userId) {
    if (!confirm('Are you sure you want to remove this user?')) return;
    
    const user = authState.users.find(u => u.id === userId);
    if (user && user.role === 'super_admin') {
        alert('Cannot remove super admin');
        return;
    }
    
    authState.users = authState.users.filter(u => u.id !== userId);
    saveAuthState();
    updateAdminPanel();
}

// Start new session
function startNewSession() {
    if (sessionState.isActive) {
        alert('Session is already active');
        return;
    }
    
    if (!confirm('Start a new poker session? This will enable tracking and persist across browser closures.')) {
        return;
    }
    
    sessionState = {
        id: 'SESSION_' + Date.now(),
        startedAt: Date.now(),
        isActive: true,
        completed: false,
        completedAt: null,
        completedBy: null
    };
    
    gameState.sessionActive = true;
    gameState.sessionStartedAt = sessionState.startedAt;
    gameState.sessionCompleted = false;
    
    saveSessionState();
    saveGameState();
    updateSessionDisplay();
    
    // Show success notification
    showNotification('Session started successfully! All data will be preserved even if browser is closed.', 'success');
}

// Complete session
function completeSession() {
    if (!sessionState.isActive) {
        alert('No active session to complete');
        return;
    }
    
    // First confirmation
    const firstConfirm = confirm('Are you sure you want to complete the session?\n\nThis will finalize all buy-ins and settlements.');
    if (!firstConfirm) return;
    
    // Second confirmation with more details
    const duration = Math.floor((Date.now() - sessionState.startedAt) / 60000);
    const secondConfirm = confirm(`FINAL CONFIRMATION:\n\nComplete session ${sessionState.id}?\nDuration: ${duration} minutes\nPlayers: ${gameState.players.length}\n\nThis action cannot be undone!`);
    
    if (!secondConfirm) return;
    
    sessionState.completed = true;
    sessionState.completedAt = Date.now();
    sessionState.completedBy = authState.currentUser.email;
    
    gameState.sessionCompleted = true;
    gameState.sessionActive = false;
    
    saveSessionState();
    saveGameState();
    updateSessionDisplay();
    
    showNotification(`Session ${sessionState.id} completed by ${authState.currentUser.email}`, 'info');
    
    // Optionally show settlement if there are players
    if (gameState.players.length > 0) {
        setTimeout(() => {
            if (confirm('Would you like to calculate final settlements?')) {
                toggleEndGameMode();
            }
        }, 1000);
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };
    
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${colors[type]} text-white p-4 rounded-lg shadow-lg z-50 max-w-sm notification`;
    notification.innerHTML = `
        <div class="font-semibold">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
        <div class="text-sm">${message}</div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Restore session
function restoreSession() {
    if (!sessionState.isActive || sessionState.completed) return;
    
    console.log('Restoring active session:', sessionState.id);
    
    // Show notification to user
    const duration = Math.floor((Date.now() - sessionState.startedAt) / 60000);
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-yellow-500 text-gray-900 p-4 rounded-lg shadow-lg z-50 max-w-sm';
    notification.innerHTML = `
        <div class="font-semibold">Session Restored</div>
        <div class="text-sm">Session ${sessionState.id} resumed (${duration} min active)</div>
        <div class="text-xs mt-1">All data has been preserved</div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
    
    updateSessionDisplay();
}

// Logout
function logout() {
    authState.currentUser = null;
    localStorage.removeItem('pokerSession');
    
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('authScreen').classList.remove('hidden');
    document.getElementById('adminPanel').classList.add('hidden');
    
    backToLogin();
}

// Disable editing for read-only users
function disableEditing() {
    // Disable game settings
    document.getElementById('chipsPerBuyin').disabled = true;
    document.getElementById('dollarPerBuyin').disabled = true;
    document.querySelectorAll('button[onclick*="updateGameSettings"]').forEach(btn => {
        btn.disabled = true;
        btn.classList.add('opacity-50');
    });
    
    // Disable add player
    document.getElementById('playerName').disabled = true;
    document.querySelectorAll('button[onclick*="addPlayer"]').forEach(btn => {
        btn.disabled = true;
        btn.classList.add('opacity-50');
    });
    
    // Disable player actions
    document.querySelectorAll('button[onclick*="removePlayer"], button[onclick*="addBuyin"], button[onclick*="removeBuyin"]').forEach(btn => {
        btn.disabled = true;
        btn.classList.add('opacity-50');
    });
    
    // Disable chip input editing
    document.querySelectorAll('input[onchange*="updateCurrentChips"]').forEach(input => {
        input.disabled = true;
    });
    
    // Disable session management for viewers
    if (document.getElementById('startSessionBtn')) {
        document.getElementById('startSessionBtn').disabled = true;
    }
    if (document.getElementById('completeSessionBtn')) {
        document.getElementById('completeSessionBtn').disabled = true;
    }
}

// Update game settings (admin only)
function updateGameSettings() {
    if (authState.currentUser.role !== 'admin' && authState.currentUser.role !== 'super_admin') {
        alert('Only admins can update game settings');
        return;
    }
    
    const chipsInput = document.getElementById('chipsPerBuyin');
    const dollarInput = document.getElementById('dollarPerBuyin');
    
    gameState.chipsPerBuyin = parseInt(chipsInput.value);
    gameState.dollarPerBuyin = parseFloat(dollarInput.value);
    
    updateSettingsDisplay();
    saveGameState();
    
    // Show success feedback
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Updated!';
    btn.classList.add('bg-green-500');
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('bg-green-500');
    }, 1500);
}

// Update settings display
function updateSettingsDisplay() {
    const info = document.getElementById('settingsInfo');
    info.textContent = `1 Buy-in = ${gameState.chipsPerBuyin} chips = $${gameState.dollarPerBuyin.toFixed(2)}`;
}

// Add a new player (admin only)
function addPlayer() {
    if (authState.currentUser.role !== 'admin' && authState.currentUser.role !== 'super_admin') {
        alert('Only admins can add players');
        return;
    }
    const nameInput = document.getElementById('playerName');
    const name = nameInput.value.trim();
    
    if (!name) {
        nameInput.classList.add('border-red-500');
        setTimeout(() => nameInput.classList.remove('border-red-500'), 2000);
        return;
    }
    
    // Check for duplicate names
    if (gameState.players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
        nameInput.classList.add('border-red-500');
        nameInput.placeholder = 'Player name already exists!';
        setTimeout(() => {
            nameInput.classList.remove('border-red-500');
            nameInput.placeholder = 'Enter player name';
        }, 2000);
        return;
    }
    
    const player = {
        id: Date.now(),
        name: name,
        buyins: 0,
        totalChips: 0,
        totalSpent: 0,
        currentChips: 0
    };
    
    gameState.players.push(player);
    nameInput.value = '';
    saveGameState();
    updateDisplay();
}

// Remove a player (admin only)
function removePlayer(playerId) {
    if (authState.currentUser.role !== 'admin' && authState.currentUser.role !== 'super_admin') {
        alert('Only admins can remove players');
        return;
    }
    if (confirm(`Are you sure you want to remove this player?`)) {
        gameState.players = gameState.players.filter(p => p.id !== playerId);
        saveGameState();
        updateDisplay();
    }
}

// Add buy-in for a player (admin only)
function addBuyin(playerId) {
    if (authState.currentUser.role !== 'admin' && authState.currentUser.role !== 'super_admin') {
        alert('Only admins can add buy-ins');
        return;
    }
    const player = gameState.players.find(p => p.id === playerId);
    if (player) {
        player.buyins++;
        player.totalChips += gameState.chipsPerBuyin;
        player.totalSpent += gameState.dollarPerBuyin;
        player.currentChips += gameState.chipsPerBuyin;
        saveGameState();
        updateDisplay();
    }
}

// Remove buy-in for a player (admin only)
function removeBuyin(playerId) {
    if (authState.currentUser.role !== 'admin' && authState.currentUser.role !== 'super_admin') {
        alert('Only admins can remove buy-ins');
        return;
    }
    const player = gameState.players.find(p => p.id === playerId);
    if (player && player.buyins > 0) {
        player.buyins--;
        player.totalChips -= gameState.chipsPerBuyin;
        player.totalSpent -= gameState.dollarPerBuyin;
        player.currentChips = Math.max(0, player.currentChips - gameState.chipsPerBuyin);
        saveGameState();
        updateDisplay();
    }
}

// Update current chips for a player (admin only)
function updateCurrentChips(playerId, chips) {
    if (authState.currentUser.role !== 'admin' && authState.currentUser.role !== 'super_admin') {
        return;
    }
    const player = gameState.players.find(p => p.id === playerId);
    if (player) {
        player.currentChips = Math.max(0, parseInt(chips) || 0);
        saveGameState();
    }
}

// Toggle end game mode
function toggleEndGameMode() {
    gameState.endGameMode = !gameState.endGameMode;
    const section = document.getElementById('settlementSection');
    const btn = document.getElementById('endGameBtn');
    
    if (gameState.endGameMode) {
        section.classList.remove('hidden');
        btn.innerHTML = '<i class="fas fa-times"></i> Cancel End Game';
        btn.classList.remove('bg-red-500', 'hover:bg-red-600');
        btn.classList.add('bg-gray-500', 'hover:bg-gray-600');
        generateFinalChipsInputs();
    } else {
        section.classList.add('hidden');
        btn.innerHTML = '<i class="fas fa-flag-checkered"></i> Start End Game';
        btn.classList.remove('bg-gray-500', 'hover:bg-gray-600');
        btn.classList.add('bg-red-500', 'hover:bg-red-600');
    }
}

// Generate final chips input fields
function generateFinalChipsInputs() {
    const container = document.getElementById('finalChipsInputs');
    container.innerHTML = '';
    
    gameState.players.forEach(player => {
        const div = document.createElement('div');
        div.className = 'flex items-center gap-4 bg-white/10 p-3 rounded-lg';
        div.innerHTML = `
            <label class="flex-1 font-medium">${player.name}:</label>
            <input type="number" 
                   id="final-${player.id}" 
                   value="${player.currentChips}" 
                   min="0"
                   class="w-32 px-3 py-1 bg-white/20 border border-white/30 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400">
            <span class="text-sm text-green-200">chips</span>
        `;
        container.appendChild(div);
    });
}

// Calculate settlement
function calculateSettlement() {
    const results = document.getElementById('settlementResults');
    
    // Collect final chip counts
    const finalChips = {};
    gameState.players.forEach(player => {
        const input = document.getElementById(`final-${player.id}`);
        finalChips[player.id] = parseInt(input.value) || 0;
    });
    
    // Calculate totals
    const totalBuyins = gameState.players.reduce((sum, p) => sum + p.buyins, 0);
    const totalChipsInPlay = totalBuyins * gameState.chipsPerBuyin;
    const totalDollarsInPlay = totalBuyins * gameState.dollarPerBuyin;
    
    // Calculate player results
    const playerResults = gameState.players.map(player => {
        const finalChipCount = finalChips[player.id];
        const chipValue = totalDollarsInPlay / totalChipsInPlay;
        const finalValue = finalChipCount * chipValue;
        const profit = finalValue - player.totalSpent;
        
        return {
            name: player.name,
            buyins: player.buyins,
            totalSpent: player.totalSpent,
            finalChips: finalChipCount,
            finalValue: finalValue,
            profit: profit
        };
    });
    
    // Generate settlement HTML
    let html = `
        <div class="bg-white/10 rounded-xl p-6">
            <h3 class="text-xl font-semibold mb-4">Settlement Summary</h3>
            <div class="mb-4 p-4 bg-white/10 rounded-lg">
                <p><strong>Total Buy-ins:</strong> ${totalBuyins}</p>
                <p><strong>Total Chips in Play:</strong> ${totalChipsInPlay}</p>
                <p><strong>Total Dollars in Play:</strong> $${totalDollarsInPlay.toFixed(2)}</p>
                <p><strong>Value per Chip:</strong> $${(totalDollarsInPlay / totalChipsInPlay).toFixed(4)}</p>
            </div>
            <div class="space-y-3">
    `;
    
    playerResults.forEach(result => {
        const profitClass = result.profit >= 0 ? 'text-green-400' : 'text-red-400';
        const profitSign = result.profit >= 0 ? '+' : '';
        
        html += `
            <div class="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                <div>
                    <strong>${result.name}</strong>
                    <span class="text-sm text-green-200 ml-2">(${result.buyins} buy-ins)</span>
                </div>
                <div class="text-right">
                    <div class="text-sm">Spent: $${result.totalSpent.toFixed(2)}</div>
                    <div class="text-sm">Final: $${result.finalValue.toFixed(2)}</div>
                    <div class="font-semibold ${profitClass}">${profitSign}$${result.profit.toFixed(2)}</div>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
            <div class="mt-6 p-4 bg-yellow-500/20 rounded-lg">
                <h4 class="font-semibold mb-2">Settlement Suggestions:</h4>
                <div class="text-sm space-y-1">
    `;
    
    // Generate settlement suggestions
    const winners = playerResults.filter(r => r.profit > 0).sort((a, b) => b.profit - a.profit);
    const losers = playerResults.filter(r => r.profit < 0).sort((a, b) => a.profit - b.profit);
    
    if (winners.length > 0 && losers.length > 0) {
        winners.forEach(winner => {
            losers.forEach(loser => {
                const amount = Math.min(winner.profit, Math.abs(loser.profit));
                if (amount > 0.01) {
                    html += `<p>• ${loser.name} pays ${winner.name} $${amount.toFixed(2)}</p>`;
                }
            });
        });
    } else {
        html += '<p>No settlements needed - all players broke even!</p>';
    }
    
    html += `
                </div>
            </div>
        </div>
    `;
    
    results.innerHTML = html;
}

// Update the entire display
function updateDisplay() {
    if (!authState.currentUser) return;
    
    updateSettingsDisplay();
    updatePlayersTable();
}

// Update players table
function updatePlayersTable() {
    const tbody = document.getElementById('playersTableBody');
    const noPlayersMsg = document.getElementById('noPlayersMessage');
    
    if (gameState.players.length === 0) {
        tbody.innerHTML = '';
        noPlayersMsg.style.display = 'block';
        return;
    }
    
    noPlayersMsg.style.display = 'none';
        tbody.innerHTML = gameState.players.map(player => `
        <tr class="border-b border-white/10 hover:bg-white/5 transition-colors fade-in">
            <td class="py-3 px-4 font-medium">${player.name}</td>
            <td class="py-3 px-4 text-center">
                <div class="flex items-center justify-center gap-2">
                    <button onclick="removeBuyin(${player.id})" 
                            class="w-6 h-6 bg-red-500 hover:bg-red-600 rounded text-xs font-bold transition-colors"
                            ${player.buyins === 0 || authState.currentUser.role === 'viewer' ? 'disabled style="opacity:0.5"' : ''}>-</button>
                    <span class="font-semibold">${player.buyins}</span>
                    <button onclick="addBuyin(${player.id})" 
                            class="w-6 h-6 bg-green-500 hover:bg-green-600 rounded text-xs font-bold transition-colors"
                            ${authState.currentUser.role === 'viewer' ? 'disabled style="opacity:0.5"' : ''}>+</button>
                </div>
            </td>
            <td class="py-3 px-4 text-center">${player.totalChips}</td>
            <td class="py-3 px-4 text-center">$${player.totalSpent.toFixed(2)}</td>
            <td class="py-3 px-4 text-center">
                <input type="number" 
                       value="${player.currentChips}" 
                       min="0"
                       onchange="updateCurrentChips(${player.id}, this.value)"
                       ${authState.currentUser.role === 'viewer' ? 'disabled' : ''}
                       class="w-20 px-2 py-1 bg-white/20 border border-white/30 rounded text-center focus:outline-none focus:ring-2 focus:ring-yellow-400">
            </td>
            <td class="py-3 px-4 text-center">
                <button onclick="removePlayer(${player.id})" 
                        class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors"
                        ${authState.currentUser.role === 'viewer' ? 'disabled style="opacity:0.5"' : ''}>
                    <i class="fas fa-trash"></i> Remove
                </button>
            </td>
        </tr>
    `).join('');
}

// Update auth display
function updateAuthDisplay() {
    // This function can be used to update any auth-related UI elements
}
