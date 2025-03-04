// ============= related to 新增訂單 =============
let variety = ['珍珠芭樂苗', '水晶芭樂苗', '翠玉芭樂苗', '翠蜜芭樂苗', '津翠芭樂苗', '水蜜芭樂苗', '香水芭樂苗', '黃金蜜芭樂苗', '天王星芭樂苗', '蘋果芭樂苗', '紅寶石芭樂苗', '紅鑽芭樂苗', '西瓜芭樂苗', '粉紅蜜芭樂苗', '粉紅超跑芭樂苗', '夏威夷芭樂苗'];
// 點擊[＋品種]產生新的一列
const addVarietyBtn = document.getElementById('addVarietyBtn');
addVarietyBtn.addEventListener('click', showVarRow);  // btn會一直跑掉耶 => 換成div就沒問題～
function showVarRow() {
  // 取得訂購內容的table
  const orderContent = document.getElementById('orderContent');
  // 找到tbody
  const orderBody = orderContent.children[1];
  
  // ＊＊辨識已經出現過的選項
  // 1) 找到已經出現的品種
  const selectedVarOpts = getSelectedVarOpts();
  // 2) 過濾可以選的options
  const availableVarOpts = variety.filter(v => !selectedVarOpts.includes(v));
  // 如果品種已被新增完，就不新增新的<select>
  if(availableVarOpts.length === 0) {
    alert('所有品種都已選擇！');
    return;
  }

  // 建立一個新的tr元素 (因為appendChild需要是DOM元素)
  let row = document.createElement('tr');
  row.setAttribute('class', 'var-row');

  let varHTML = availableVarOpts.map(variety => `<option>${variety}</option>`).join('');

  row.innerHTML = `
                <td>
                  <select class="rounded border-2 p-1">
                    ${varHTML}
                  </select>
                </td>
                <td><input type="number" style="width: 40px;" class="rounded"></td>
                <td><input type="number" style="width: 45px;" class="rounded"></td>
                <td>
                  <div class="btn btn-secondary btn-sm btn-delete-variety">✗</div>
                </td>
    `;

  orderBody.appendChild(row);

  // 新增監聽事件：當.var-row select中change時，會觸發！
  row.querySelector('select').addEventListener('change', updateVarSelects);
  // 每一個select也都要跟著updateVarSelects(這樣已經先新增的select也會跟著調整為正確的select～)
  updateVarSelects();

  setDelBtn();
  rowChange();
}
// 預設的第一列品種列～
showVarRow();

// 取得所有 已選 品種
function getSelectedVarOpts() {
  const selectedSet = new Set();  // 透過set來去除重複的elem

  document.querySelectorAll('.var-row select').forEach(select => {
    if (select.value) selectedSet.add(select.value);
  })
  return [...selectedSet];  // return為陣列 
}

// 更新所有.var-row 中的 <select>，確保不重複出現品種
function updateVarSelects() {
  const selectedVarOpts = getSelectedVarOpts();

  document.querySelectorAll('.var-row select').forEach(select => {
    const currenValue = select.value;
    select.innerHTML = DOMPurify.sanitize(
      variety
        .filter(v => !selectedVarOpts.includes(v) || v === currenValue)
        .map(v => `<option ${v === currenValue ? 'selected' : ''}>${v}</option>`)
        .join('')
    );
  });
}

const addVarietyOptBtn = document.getElementById('addVarietyOptBtn');
addVarietyOptBtn.addEventListener('click', showInput);
let isEdited = false;
function showInput() {
  isEdited = !isEdited;
  if (isEdited) {
    // 顯示[+選項]的品種輸入框
    addVarietyOptBtn.previousElementSibling.classList.remove('d-none');
    
    addVarietyOptBtn.innerText = '完成';
  } else {
    variety.unshift(addVarietyOptBtn.previousElementSibling.value);

    addVarietyOptBtn.previousElementSibling.classList.add('d-none');

    alert('已新增品種，請新增一列選取！');

    addVarietyOptBtn.innerText = '+ 選項';
  }
}

// 點擊[刪除]可以刪掉一列
function setDelBtn() {
  document.querySelectorAll('.btn-delete-variety').forEach(btn => {
    btn.addEventListener('click', deleteVarRow);

    function deleteVarRow() {
      btn.parentElement.parentElement.remove();
      updateVarSelects();  // 刪除時也須更新<select>
    }
  })
}
// 初始設定[刪除]的btn
setDelBtn();

// 計算運費
const fee = document.getElementById('oFee');
// 當運費之價格/件數有變動時，1) 計算運費 2) 計算total
const feeNum = fee.previousElementSibling;
const feePrice = fee.previousElementSibling.previousElementSibling;
feeNum.addEventListener('change', calFee);
feeNum.addEventListener('change', calTotal);
feePrice.addEventListener('change', calFee);
feePrice.addEventListener('change', calTotal);
function calFee() {
  const num = parseInt(feeNum.value) || 0;
  const price = parseInt(feePrice.value) || 0;
  fee.innerText = num * price;
}
calFee();

// 計算訂單的總金額
function calTotal() {
  let total = 0;
  document.querySelectorAll('.var-row').forEach(row => {
    const oNum = parseInt(row.children[1].children[0].value, 10) || 0;
    const oPrice = parseInt(row.children[2].children[0].value, 10) || 0;

    total += oNum * oPrice;
  });

  total += parseInt(fee.innerText);

  // 將總金額display在畫面上
  document.getElementById('oTotal').innerText = total;
}
calTotal();

// 觸發計算金額的時機（當數量、價格有變動時）
function rowChange() {
  document.querySelectorAll('.var-row').forEach(row => {
    const numDOM = row.children[1].children[0];
    const priceDOM = row.children[2].children[0];
  
    numDOM.addEventListener('change', calTotal);
    priceDOM.addEventListener('change', calTotal);
  });
}
// 初始設定品種列的觸發
rowChange();


// 點擊[新增訂單]可以新增一筆訂單資料
const addOrderBtn = document.getElementById('addOrderBtn');
addOrderBtn.addEventListener('click', createOrder);
async function createOrder() {
  const details = validateInputs();
  if (!details) return;

  const cid = sessionStorage.getItem('cId') || '';
  const url = cid ? 'https://b.chfam.stellachy.online/api/o' : 'https://b.chfam.stellachy.online/api/c';
  const memoValue = document.getElementById('oMemo').value || null;
  const order = cid
    ? {cid, details, 
        date: document.getElementById('oDate').value, 
        fee: parseInt(fee.innerText), 
        memo: memoValue
      }
    : {
      name: document.getElementById('cName').value,
      tel: document.getElementById('cTel').value,
      addr: document.getElementById('cAddr').value,
      details,
      date: document.getElementById('oDate').value,
      fee: parseInt(fee.innerText),
      memo: memoValue
    };
  
    try {
      const response = await fetch(url, {
        method: 'post',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(order)
      });

      if (!response.ok) {
        throw new Error(`HTTP 錯誤！狀態碼：${response.status}`);
      } else {
        alert('新增訂單成功！');
        // 清除使用者輸入
        document.getElementById('orderForm').reset();
        // 讓運費、總金額的位置會是正確數字0（通常連續輸入可能會有問題）
        calFee();
        calTotal();
        // 收合新增訂單表
        document.getElementById('orderForm').parentElement.classList.add('d-none');
        // 重新觸發一次查詢，讓訂單表單 有變化後 立即呈現
        searchOrder();
      }

    } catch (error) {
      console.error('API請求失敗', error);
      alert("伺服器連線失敗，請稍後再試！");
    }
}

// 驗證使用者訂單之輸入
function validateInputs() {
  const name = document.getElementById('cName').value.trim();
  const tel = document.getElementById('cTel').value.trim();
  const addr = document.getElementById('cAddr').value.trim();
  const date = document.getElementById('oDate').value.trim();

  // 手機號碼格式驗證（09 開頭，共 10 碼）
  const phoneRegex = /^09\d{8}$/;

  if (!name) {
    alert("請輸入姓名！");
    return false;
  }
  if (!tel || !phoneRegex.test(tel)) {
    alert("請輸入有效的手機號碼（09 開頭，共 10 碼）！");
    return false;
  }
  if (!addr) {
    alert("請輸入地址！");
    return false;
  }
  if (!date) {
    alert("請選擇訂單日期！");
    return false;
  }

  const fNum = parseInt(feeNum.value) || 0;
  const fPrice = parseInt(feePrice.value) || 0;
  if (fNum < 0 || fPrice < 0 || (fNum === 0) !== (fPrice === 0)) {
    alert("請確認運費數量與價格！");
    return false;
  }

  // 檢查訂單內容
  const details = [];
  let isValid = true;

  document.querySelectorAll('.var-row').forEach(row => {
    const selectedIndex = row.children[0].children[0].selectedIndex;
    const oVar = row.children[0].children[0].children[selectedIndex].text.trim();
    const oNum = parseInt(row.children[1].children[0].value, 10);
    const oPrice = parseInt(row.children[2].children[0].value, 10);

    if (!oVar || isNaN(oNum) || oNum <= 0 || isNaN(oPrice) || oPrice <= 0) {
      alert("請輸入有效的訂單內容！");
      isValid = false;
    }

    details.push({ var: oVar, num: oNum, price: oPrice });
  });
  
  return isValid ? details : false;
}

// 點擊[新增會員/訂單]才會出現新增訂單的form
const addMemberBtn = document.getElementById('addMemberBtn');
addMemberBtn.addEventListener('click', async () => {
  // document.getElementById('orderForm').parentElement.classList.remove('d-none');

  // 使用toggle可以讓點擊[新增會員]時，可以開 or 合orderForm
  document.getElementById('orderForm').parentElement.classList.toggle('d-none');

  if (addMemberBtn.innerText == '新增訂單') {
    // 透過cId 取得該會員的資料
    let cId = sessionStorage.getItem('cId');
    const url = `https://b.chfam.stellachy.online/api/c/${cId}`;
    const response = await fetch(url);
    const resultObj = await response.json();

    const { name, tel, addr } = resultObj;

    document.getElementById('cName').value = name;
    document.getElementById('cName').setAttribute('disabled', true);

    document.getElementById('cTel').value = tel;
    document.getElementById('cTel').setAttribute('disabled', true);

    document.getElementById('cAddr').value = addr;
    document.getElementById('cAddr').setAttribute('disabled', true);
  } else {
    document.getElementById('cName').value = '';
    document.getElementById('cName').removeAttribute('disabled', true);

    const cTel = cOrderSearchBtn.previousElementSibling.value;
    document.getElementById('cTel').value = cTel;  // 將查詢的電話自動帶入輸入欄
    document.getElementById('cTel').removeAttribute('disabled', true);

    document.getElementById('cAddr').value = '';
    document.getElementById('cAddr').removeAttribute('disabled', true);
  }
});

// ============= related to 查詢訂單 =============
// 驗證電話號碼
function validateTel(tel) {
  const regex = /^09\d{8}$/;
  return regex.test(tel);
}

// 輸入電話號碼後，點擊[查詢]
const cOrderSearchBtn = document.getElementById('cOrderSearchBtn');
cOrderSearchBtn.addEventListener('click', searchOrder);
// 點擊 Enter 即可查詢
cOrderSearchBtn.previousElementSibling.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchOrder();
  } 
});

async function searchOrder() {
  // 清除sessionStorage中的cid
  sessionStorage.removeItem('cId');
  // 取得使用者電話
  const cTel = cOrderSearchBtn.previousElementSibling.value;

  if (!validateTel(cTel)) {
    alert("請輸入有效的手機號碼（09 開頭，共 10 碼）");
    return;
  }

  // 將填資料的表格關上（避免重新查詢時會造成會員資料帶入錯誤～～）
  document.getElementById('orderForm').parentElement.classList.add('d-none');

  const url = `https://b.chfam.stellachy.online/api/c/check?tel=${cTel}`;

  // 串接api
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP 錯誤！狀態碼：${response.status}`);
    }  // fetch() 本身不會因為 HTTP 404、500 等錯誤而拋出異常，因此利用 if (!response.ok) 手動檢查

    const resultObj = await response.json();

    if (resultObj.exists) {  // 若DB中有此人，
      // 解構賦值拿該cId 的客戶資料、所有訂單資料
      const { id, name, tel, addr, orders } = resultObj.customer;

      const orderHTML = orders.map((order, index) => {
        // 產生品種的<tr></tr>
        const detailHTML = order.details.map(detail => `
            <tr>
              <td>
                ${detail.var}
              </td>
              <td>
                ${detail.num}
              </td>
              <td>
                ${detail.price}
              </td>
            </tr>
          `).join('');

        // 計算單筆訂單的總價格
        let total = order.details.reduce((sum, detail) => sum + detail.num * detail.price, 0);
        
        total += order.fee;
        return `
            <div class="my-2 p-2 border border-2 rounded">
              <div class="px-1 d-flex justify-content-between">
                <strong ># ${index + 1}  訂單內容</strong>
                <strong>日期：${order.date}</strong>
              </div>

              <div class="d-flex flex-column flex-md-row">
                <table class="table" style="max-width: 600px">
                  <thead>
                      <tr>
                        <th>品種</th>
                        <th>數量</th>
                        <th>價格</th>
                      </tr>
                  </thead>
                  <tbody>
                    ${detailHTML}
                  </tbody>
                </table>
                
                <div style="min-width: 280px" >
                    <div class="px-1 d-flex justify-content-between flex-row">
                      <strong>運費：NT$ ${order.fee}</strong>
                      <strong>總金額：NT$ ${total} </strong>
                    </div>
                    <div class="px-1">
                      <strong>備註：<input class="px-1 rounded" style="width: 238px" disabled 
                        value="${order.memo ?? '無' }">
                      </strong>
                    </div>
                </div>
                  
              </div>
            </div>
      `}).join('');

      // 將資料呈現在畫面上
      document.getElementById('cOrderResult').innerHTML = DOMPurify.sanitize(`
                <div class="border-bottom border-2 border-dark">
                
                  <div style="max-width: 500px" class="d-flex justify-content-between pe-1">
                    <h6>顧客姓名：${name}</h6>
                    <h6>電話：${tel}</h6>
                  </div>
                  
                  <div class="d-flex">
                    <h6>地址：</h6>
                    <h6 style="max-width: 260px; white-space: nowrap; overflow-x: auto;">
                      ${addr}
                    </h6>
                  </div>
                  
                </div>
  
                <!-- 訂單明細div -->                
                  ${orderHTML}
      `);

      // 出現cOrderResult的容器
      document.getElementById('cOrderResult').classList.remove('d-none');

      addMemberBtn.innerText = '新增訂單';
      // 將cId寫入sessionStorage
      sessionStorage.setItem('cId', id);

    } else {  // 若無DB中無此人，出現新增訂單的畫面
      document.getElementById('cOrderResult').innerText = '查無此會員，請新增會員及訂單！';

      addMemberBtn.innerText = '新增會員';

      document.getElementById('cOrderResult').classList.remove('d-none');
    }

    addMemberBtn.classList.remove('d-none');
  } catch (error) {
    console.error("API請求失敗", error);
    alert("伺服器連線失敗，請稍後再試！");
  }
}