const balanceEl = document.getElementById('net-balance');
const incomeEl = document.getElementById('total-income');
const expenseEl = document.getElementById('total-expense');
const listEl = document.getElementById('transaction-list');
const formEl = document.getElementById('transaction-form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const deleteBalanceBtn = document.getElementById('delete-balance');

// LocalStorage से data load करना (ताकि page refresh करने पर data डिलीट न हो)
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorageTransactions !== null ? localStorageTransactions : [];

// Transaction Add करने का function
function addTransaction(e) {
    e.preventDefault();

    if (textInput.value.trim() === '' || amountInput.value.trim() === '') {
        alert('Please add a text and amount');
        return;
    }

    const transaction = {
        id: generateID(),
        text: textInput.value,
        amount: +amountInput.value // string को number में बदलना
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    textInput.value = '';
    amountInput.value = '';
}

// Unique ID Generate करना
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// DOM में Transaction दिखाना
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');

    // Class add करना (plus या minus)
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transaction.text} <span>${sign}₹${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})"><i class="fa-solid fa-xmark"></i></button>
    `;

    listEl.appendChild(item);
}

// Balance, Income और Expense Update करना
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balanceEl.innerText = `₹${total}`;
    incomeEl.innerText = `₹${income}`;
    expenseEl.innerText = `₹${expense}`;
}

// ID के हिसाब से Transaction डिलीट करना
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}

// LocalStorage update करना
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// App Initialize करना
function init() {
    listEl.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();

// Event Listener
formEl.addEventListener('submit', addTransaction);





// Delete Total Balance without deleting History
function deleteBalance() {
    balanceEl.innerText = '₹0.00';
    incomeEl.innerText = '₹0.00';
    expenseEl.innerText = '₹0.00';
}

// Event Listener for Delete Balance Button
deleteBalanceBtn.addEventListener('click', deleteBalance);