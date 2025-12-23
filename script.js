const scriptURL = 'https://script.google.com/macros/s/AKfycbx7RzhG7sN76znLTcbdDo7yCuAAExGOdDX6-6WR_OCmvvmQtxfCrjyRps9ldYCMCxCP/exec';
const form = document.getElementById('ideaForm');
const submitBtn = document.getElementById('submitBtn');

// 1. 실시간 미리보기 기능
const inputs = [
    { id: 'userName', target: 'prevUserName' },
    { id: 'itemName', target: 'prevItemName' },
    { id: 'content', target: 'prevContent' }
];

inputs.forEach(item => {
    const inputEl = document.getElementById(item.id);
    const targetEl = document.getElementById(item.target);

    inputEl.addEventListener('input', () => {
        targetEl.innerText = inputEl.value || (item.id === 'userName' ? '제안자 이름' : item.id === 'itemName' ? '아이템 명' : '내용을 입력하세요');
    });
});

// 2. 구글 시트로 데이터 전송
form.addEventListener('submit', e => {
    e.preventDefault();
    
    submitBtn.disabled = true;
    submitBtn.innerText = '기록 중...';

    const data = {
        name: document.getElementById('userName').value,
        item: document.getElementById('itemName').value,
        content: document.getElementById('content').value
    };

    // Google Apps Script는 보안상 fetch 기본 방식보다 JSON.stringify 전송이 안정적일 수 있음
    fetch(scriptURL, { 
        method: 'POST', 
        body: JSON.stringify(data)
    })
    .then(response => {
        alert('성공적으로 기록되었습니다! 당신의 아이디어가 MJT 시트에 담겼습니다.');
        form.reset();
        resetPreview();
    })
    .catch(error => {
        console.error('Error!', error.message);
        alert('저장에 실패했습니다. 네트워크를 확인해주세요.');
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerText = '데이터베이스에 기록하기';
    });
});

function resetPreview() {
    document.getElementById('prevUserName').innerText = '제안자 이름';
    document.getElementById('prevItemName').innerText = '아이템 명';
    document.getElementById('prevContent').innerText = '내용을 입력하세요';
}
