// 送信ボタンがクリックされたときの処理
function submitAddress() {
    // ユーザからの入力を取得
    const addressInput = document.getElementById('addressInput');
    const address = addressInput.value;

    // ローディングインジケータを表示
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = 'block';

    // 結果とエラーの領域をクリア
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    // バックエンドに送信
    fetch('/api/normalize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            address: address
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(response.body);
        }
        return response.json();
    })
    .then(data => {
        // 結果を表示
        resultsDiv.innerHTML = `
            県: ${data.県}<br>
            市区町村: ${data.市区町村}<br>
            町名: ${data.町名}<br>
            番地: ${data.番地}<br>
            建物名: ${data.建物名}<br>
            部屋番号: ${data.部屋番号}<br>
        `;
    })
    .catch(error => {
        // エラーメッセージを表示
        let errorMessage;
        switch(error.message) {
            case '400':
                errorMessage = '入力された住所が正しくないか、解析できませんでした。';
                break;
            case '500':
                errorMessage = 'サーバーエラーが発生しました。しばらくしてから再試行してください。';
                break;
            default:
                errorMessage = 'エラーが発生しました。';
        }
        resultsDiv.innerHTML = `<p style="color: red;">${errorMessage}</p>`;
    })
    .finally(() => {
        // ローディングインジケータを非表示
        loadingIndicator.style.display = 'none';
    });
}

