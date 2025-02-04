// 點擊[＋品種]產生新的一列
const addVarietyBtn = document.getElementById('addVarietyBtn');

addVarietyBtn.addEventListener('click', showVarRow);  // btn會一直跑掉耶 為什麼？
function showVarRow() {
  // 取得訂購內容的table
  const orderContent = document.getElementById('orderContent');
  // 找到tbody
  const orderBody = orderContent.children[1];
  // 建立一個新的tr元素 (因為appendChild需要是DOM元素)
  let row = document.createElement('tr');
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
    `;
  
  orderBody.appendChild(row);

  // 辨識已經出現過的選項？
}