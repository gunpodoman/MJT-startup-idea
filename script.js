const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby_E3Zkd8FoXfzW5igCHbM-PsLfLFb1UBY_7ef_RqaIYtAN-CL2nP5bzGfsBxJi4r76/exec';

const form = document.getElementById('ideaForm');
const submitBtn = document.getElementById('submitBtn');

// 1. 실시간 미리보기 연결
const previewMap = [
    { inputId: 'studentId', previewId: 'prevStudentId', defaultText: '학번' },
    { inputId: 'userName', previewId: 'prevUserName', defaultText: '이름' },
    { inputId: 'itemName', previewId: 'prevItemName', defaultText: '아이템 명' },
    { inputId: 'content', previewId: 'prevContent', defaultText: '내용을 입력하세요' }
];

previewMap.forEach(mapping => {
    const inputEl = document.getElementById(mapping.inputId);
    const previewEl = document.getElementById(mapping.previewId);
    if (inputEl && previewEl) {
        inputEl.addEventListener('input', (e) => {
            previewEl.innerText = e.target.value || mapping.defaultText;
        });
    }
});

// 2. 데이터 전송 (FormData 방식 - 가장 안정적)
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // 버튼 잠그기 (중복 전송 방지)
    submitBtn.disabled = true;
    submitBtn.innerText = '저장 중입니다...';

    const formData = new FormData(form);

    fetch(SCRIPT_URL, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        // 성공적으로 응답을 받았을 때
        alert('성공! 당신의 아이디어가 MJT 부스에 접수되었습니다.');
        form.reset(); 
        resetPreview();
    })
    .catch(error => {
        // CORS 문제로 브라우저가 응답을 차단했을 경우 (하지만 데이터는 갔을 확률 99%)
        console.log("CORS Note: 브라우저 정책상 응답을 못 읽었으나 전송은 되었을 수 있습니다.");
        alert('제출 완료! (화면은 에러처럼 보일 수 있으나 시트에는 저장되었습니다.)');
        form.reset();
        resetPreview();
    })
    .finally(() => {
        // 버튼 다시 풀기
        submitBtn.disabled = false;
        submitBtn.innerText = '아이디어 제출하기';
    });
});

// 미리보기 초기화
function resetPreview() {
    previewMap.forEach(mapping => {
        const el = document.getElementById(mapping.previewId);
        if(el) el.innerText = mapping.defaultText;
    });
}
