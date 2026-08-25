let transactions = [];
let nextId = 1;

// อ้างอิง Elements
const balanceEl = document.getElementById('balance');
const moneyPlusEl = document.getElementById('money-plus');
const moneyMinusEl = document.getElementById('money-minus');

const form = document.getElementById('form');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');

const searchInput = document.getElementById('search-input');
const listEl = document.getElementById('list');

// 1. ฟังก์ชันคำนวณยอดเงิน
function updateSummary() {
  const income = transactions
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);

  const expense = transactions
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

  const balance = income - expense;

  if (balanceEl) balanceEl.textContent = `฿${balance.toFixed(2)}`;
  if (moneyPlusEl) moneyPlusEl.textContent = `+฿${income.toFixed(2)}`;
  if (moneyMinusEl) moneyMinusEl.textContent = `-฿${expense.toFixed(2)}`;
}

// 2. ฟังก์ชันแสดงผลรายการ
function renderList() {
  if (!listEl) return;
  listEl.innerHTML = '';

  const keyword = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const filtered = transactions.filter(item =>
    item.name.toLowerCase().includes(keyword)
  );

  filtered.forEach(item => {
    const li = document.createElement('li');
    li.classList.add(item.type);

    const typeText = item.type === 'income' ? 'รายรับ' : 'รายจ่าย';
    const amountSign = item.type === 'income' ? '+' : '-';

    li.innerHTML = `
      <div>
        <strong>#${item.id}</strong> [${typeText}] ${item.category} <strong>${item.name}</strong>
      </div>
      <div>
        <strong>${amountSign}฿${item.amount.toFixed(2)}</strong>
      </div>
    `;

    listEl.appendChild(li);
  });
}

function updateUI() {
  renderList();
  updateSummary();
}

// 3. ฟังก์ชันเพิ่มรายการ
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const newTransaction = {
      id: nextId++,
      type: typeInput.value,
      category: categoryInput.value,
      name: textInput.value.trim(),
      amount: parseFloat(amountInput.value)
    };

    transactions.push(newTransaction);
    textInput.value = '';
    amountInput.value = '';

    updateUI();
  });
}

// 4. ฟังก์ชันค้นหา Real-time
if (searchInput) {
  searchInput.addEventListener('input', renderList);
}

// 5. ฟังก์ชันล้างข้อมูล (ผูกตรงกับ onclick ใน HTML)
function clearAllData() {
  const isConfirmed = confirm('คุณต้องการล้างข้อมูลประวัติทั้งหมดใช่หรือไม่?');
  if (isConfirmed) {
    transactions = [];
    nextId = 1;
    if (searchInput) searchInput.value = '';
    updateUI();
  }
}