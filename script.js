const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

const localStorageTransactionHistory = JSON.parse(localStorage.getItem('transaction'));
let transaction = localStorage.getItem('transaction') !== null ? localStorageTransactionHistory : [];

// Add new transaction 
function addNewTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please enter amount and text to add transaction ');
    } else {
        const transactionx = {
            id: getRandomID(),
            text: text.value,
            amount: +amount.value
        };

        transaction.push(transactionx);
        addTransactionDOM(transactionx);
        updateValues();
        updateLocalStorage();
        text.value = '';
        amount.value = '';
    }
}

// Add/Edit Transaction to DOM
// Add/Edit Transaction to DOM
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.innerHTML = `
        ${transaction.text} <span>${sign} ${Math.abs(transaction.amount)}</span> 
        <button class="edit-btn" onclick="editTransaction(${transaction.id})">Edit</button>
        <button class="delete-btn" onclick="removeTransactionHistory(${transaction.id})">&#10006;</button>
    `;
    list.appendChild(item);
}


// Edit Transaction
function editTransaction(id) {
    const index = transaction.findIndex(item => item.id === id);
    const editedText = prompt('Enter the edited text:', transaction[index].text);
    const editedAmount = parseFloat(prompt('Enter the edited amount:', transaction[index].amount));

    if (editedText !== null && !isNaN(editedAmount)) {
        transaction[index].text = editedText;
        transaction[index].amount = editedAmount;
        updateLocalStorage();
        init();
    }
}

// Initialize
function init() {
    list.innerHTML = '';
    transaction.forEach(addTransactionDOM);
    updateValues();
}

// Event Listeners
form.addEventListener('submit', addNewTransaction);

// Call init function on page load
init();

// Helper functions
function getRandomID() {
    return Math.floor(Math.random() * 10000000000);
}

function updateValues() {
    const amounts = transaction.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, amount) => acc + amount, 0);
    const income = amounts.filter(amount => amount > 0).reduce((acc, amount) => acc + amount, 0);
    const expense = amounts.filter(amount => amount < 0).reduce((acc, amount) => acc + amount, 0) * -1;

    balance.innerText = `INR(₹): ${total}`;
    money_plus.innerText = `₹${income}`;
    money_minus.innerText = `₹${expense}`;
}

function updateLocalStorage() {
    localStorage.setItem('transaction', JSON.stringify(transaction));
}

function removeTransactionHistory(id) {
    transaction = transaction.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}
