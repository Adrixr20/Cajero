const users = JSON.parse(localStorage.getItem('users')) || [
    { username: "user1", password: "password1", balance: 1000, transactions: [], pin: "1234" },
    { username: "user2", password: "password2", balance: 500, transactions: [], pin: "5678" },
];

let currentUser = null;

function updateLocalStorage() {
    localStorage.setItem('users', JSON.stringify(users));
}

function updateMessage(message, isError = false) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = isError ? 'message error' : 'message';
}

function updateBalance() {
    document.getElementById('balance').textContent = Saldo: $${currentUser.balance.toFixed(2)};
}

function populateRecipientList() {
    const recipientSelect = document.getElementById('recipient');
    recipientSelect.innerHTML = '<option value="">Seleccionar Destinatario</option>';

    users.forEach(user => {
        if (user.username !== currentUser.username) {
            const option = document.createElement('option');
            option.value = user.username;
            option.textContent = user.username;
            recipientSelect.appendChild(option);
        }
    });
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    currentUser = users.find(user => user.username === username && user.password === password);

    if (currentUser) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('atm-container').style.display = 'block';
        updateMessage(Bienvenido ${username});
        updateBalance();
    } else {
        document.getElementById('login-message').textContent = 'Usuario o contraseña incorrectos';
    }
}

function logout() {
    currentUser = null;
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('atm-container').style.display = 'none';
    document.getElementById('login-message').textContent = '';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('transfer-field').style.display = 'none';
}

function checkBalance() {
    updateMessage('Su saldo es:');
    updateBalance();
}

function deposit() {
    const amount = parseFloat(document.getElementById('amount').value);
    if (isNaN(amount) || amount <= 0) {
        updateMessage('Por favor ingrese un monto válido para depositar.', true);
        return;
    }
    currentUser.balance += amount;
    currentUser.transactions.push({ type: 'Depósito', amount, date: new Date().toLocaleString() });
    updateLocalStorage();
    updateMessage(Depósito exitoso de $${amount.toFixed(2)});
    updateBalance();
    document.getElementById('amount').value = '';
}

function withdraw() {
    const amount = parseFloat(document.getElementById('amount').value);
    if (isNaN(amount) || amount <= 0) {
        updateMessage('Por favor ingrese un monto válido para retirar.', true);
        return;
    }
    if (amount > currentUser.balance) {
        updateMessage('Saldo insuficiente.', true);
        return;
    }
    currentUser.balance -= amount;
    currentUser.transactions.push({ type: 'Retiro', amount, date: new Date().toLocaleString() });
    updateLocalStorage();
    updateMessage(Retiro exitoso de $${amount.toFixed(2)});
    updateBalance();
    document.getElementById('amount').value = '';
}

function showTransactions() {
    const transactionHistory = document.getElementById('transaction-history');
    const transactionsList = document.getElementById('transactions-list');
    transactionsList.innerHTML = '';

    currentUser.transactions.forEach(transaction => {
        const listItem = document.createElement('li');
        listItem.textContent = ${transaction.date}: ${transaction.type} de $${transaction.amount.toFixed(2)};
        transactionsList.appendChild(listItem);
    });

    transactionHistory.style.display = 'block';
}

function showTransfer() {
    const transferField = document.getElementById('transfer-field');
    transferField.style.display = 'block';
    populateRecipientList();
}

function transfer() {
    const amount = parseFloat(document.getElementById('amount').value);
    const recipientUsername = document.getElementById('recipient').value;
    const pin = document.getElementById('pin').value;

    if (isNaN(amount) || amount <= 0) {
        updateMessage('Por favor ingrese un monto válido para transferir.', true);
        return;
    }
    if (amount > currentUser.balance) {
        updateMessage('Saldo insuficiente.', true);
        return;
    }
    if (!recipientUsername) {
        updateMessage('Por favor seleccione un destinatario.', true);
        return;
    }
    if (pin !== currentUser.pin) {
        updateMessage('PIN incorrecto.', true);
        return;
    }

    const recipient = users.find(user => user.username === recipientUsername);

    currentUser.balance -= amount;
    recipient.balance += amount;

    const date = new Date().toLocaleString();
    currentUser.transactions.push({ type: 'Transferencia a', amount, date, recipient: recipientUsername });
    recipient.transactions.push({ type: 'Transferencia de', amount, date, sender: currentUser.username });

    updateLocalStorage();
    updateMessage(Transferencia exitosa de $${amount.toFixed(2)} a ${recipientUsername});
    updateBalance();
    document.getElementById('amount').value = '';
    document.getElementById('recipient').value = '';
    document.getElementById('pin').value = '';
}