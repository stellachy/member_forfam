// ============= related to 新增訂單 =============
// 點擊[＋品種]產生新的一列
const addVarietyBtn = document.getElementById('addVarietyBtn');
addVarietyBtn.addEventListener('click', showVarRow);  // btn會一直跑掉耶 => 換成div就沒問題～
function showVarRow() {
  // 取得訂購內容的table
  const orderContent = document.getElementById('orderContent');
  // 找到tbody
  const orderBody = orderContent.children[1];
  // 建立一個新的tr元素 (因為appendChild需要是DOM元素)
  let row = document.createElement('tr');
  row.setAttribute('class', 'var-row');

  row.innerHTML = `
                <td>
                  <!-- 品種總共有哪些？可以再跟mom check -->
                  <select class="rounded border-2 p-1">
                    <option value="1">紅寶石芭樂苗</option>
                    <option value="2">黃金蜜芭樂苗</option>
                    <option value="3">紅鑽芭樂苗</option>
                    <option value="4" selected>珍珠芭樂苗</option>
                  </select>
                </td>
                <td>
                  <input type="number" style="width: 60px;" class="rounded">
                </td>
                <td>
                  <input type="number" style="width: 90px;" class="rounded">
                </td>
                <td>
                  <div class="btn btn-secondary btn-sm btn-delete-variety">刪除</div>
                </td>
    `;

  orderBody.appendChild(row);
  setDelBtn();

  // 辨識已經出現過的選項？
}

// 點擊[刪除]可以刪掉一列
function setDelBtn() {
  document.querySelectorAll('.btn-delete-variety').forEach(btn => {
    btn.addEventListener('click', deleteVarRow);

    function deleteVarRow() {
      btn.parentElement.parentElement.remove();
    }
  })
}
// 初始設定[刪除]的btn
setDelBtn();

// 計算訂單的總金額
function calTotal() {
  let total = 0;
  document.querySelectorAll('.var-row').forEach(row => {
    const oNum = row.children[1].children[0].value;
    const oPrice = row.children[2].children[0].value;

    total += oNum * oPrice;
  });

  // 將總金額display在畫面上
  document.getElementById('oTotal').innerText = total;
}

// 觸發計算金額的時機（當數量、價格有變動時）
document.querySelectorAll('.var-row').forEach(row => {
  const numDOM = row.children[1].children[0];
  const priceDOM = row.children[2].children[0];

  numDOM.addEventListener('change', calTotal);
  priceDOM.addEventListener('change', calTotal);
});

// 點擊[新增訂單]可以新增一筆訂單資料
const addOrderBtn = document.getElementById('addOrderBtn');
addOrderBtn.addEventListener('click', createOrder);
function createOrder() {
  // 取得使用者輸入資料
  // 會員資料
  const cName = document.getElementById('cName').value;
  const cTel = document.getElementById('cTel').value;  // 也許可以比對資料庫，不讓重複新增（later）
  const cAddr = document.getElementById('cAddr').value;

  // 訂單內容
  const orderDetails = [];
  document.querySelectorAll('.var-row').forEach(row => {
    const selectedIndex = row.children[0].children[0].selectedIndex;
    const oVar = row.children[0].children[0].children[selectedIndex].text;
    const oNum = row.children[1].children[0].value;
    const oPrice = row.children[2].children[0].value;

    orderDetails.push({
      oVar,
      oNum,
      oPrice
    });
  });

  // 訂單日期
  const oDate = document.getElementById('oDate').value;
  
  // 一筆訂單的data要長這樣：
  const cId = 1;  // 這邊先fake cId，實際需要從資料庫端拿到
  const order = {
    cId,
    orderDetails,
    oDate
  };
  console.log(order);  // okie

  // 處理required的input

  // 傳送至後端（later）

  // 清除使用者輸入
  document.getElementById('orderForm').reset();
}

// 點擊[新增會員]才會出現新增訂單的form
const addMemberBtn = document.getElementById('addMemberBtn');
addMemberBtn.addEventListener('click', () => {
  // document.getElementById('orderForm').parentElement.classList.remove('d-none');
  
  // 使用toggle可以讓點擊[新增會員]時，可以開 or 合orderForm
  document.getElementById('orderForm').parentElement.classList.toggle('d-none');
});

// ============= related to 查詢訂單 =============
// 點擊[查詢]，
const cOrderSearchBtn = document.getElementById('cOrderSearchBtn');
cOrderSearchBtn.addEventListener('click', () => {
  // 取得使用者電話
  const cTel = cOrderSearchBtn.previousElementSibling.value; 

  // 到DB中透過cTel取到cId

  let cId = 1;  // 之後串接資料庫取值！
  if (cId) {  // 若DB中有此人，
    // 拿該cId 的所有訂單資料 from DB

    // 將資料呈現在畫面上（到時候拿cOrderResult寫好的html做修改會更清楚）

    // 出現cOrderResult的容器
    document.getElementById('cOrderResult').classList.remove('d-none');
  } else {  // 若無，出現新增訂單的畫面
    document.getElementById('cOrderResult').innerText = '查無此會員，請新增會員及訂單！';

    document.getElementById('cOrderResult').classList.remove('d-none');
    
  }

  addMemberBtn.classList.remove('d-none');  // 之後可能要調整新增會員／新增訂單要是不一樣的？
})
