const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzFs6r1UVHsWkoxFaim9gB1cPRy_BFWeRnoPuUUVfUQaZGY-rK61CCQjw-yvwBetv0P/exec';

// DOM 요소 가져오기
const form = document.getElementById('ideaForm');
const submitBtn = document.getElementById('submitBtn');

// 1. 실시간 미리보기 (Real-time Preview) 기능
// 입력창의 ID와 미리보기 카드의 ID를 매핑합니다.
const previewMap = [
    { inputId: 'userName', previewId: 'prevUserName', defaultText: '제안자 이름' },
    { inputId: 'itemName', previewId: 'prevItemName', defaultText: '아이템명' },
    { inputId: 'content', previewId: 'prevContent', defaultText: '내용을 입력하세요' }
];

// 각 입력창에 이벤트 리스너를 달아 실시간으로 내용을 반영합니다.
previewMap.forEach(mapping => {
    const inputElement = document.getElementById(mapping.inputId);
    const previewElement = document.getElementById(mapping.previewId);

    if (inputElement && previewElement) {
        inputElement.addEventListener('input', (e) => {
            // 입력값이 있으면 그 값을, 없으면 기본 문구를 보여줍니다.
            previewElement.innerText = e.target.value || mapping.defaultText;
        });
    }
});


// 2. 구글 시트로 데이터 전송 (Data Submission)
// 'FormData' 방식을 사용하여 CORS 에러를 방지합니다.
form.addEventListener('submit', (e) => {
    e.preventDefault(); // 화면 새로고침 방지

    // 버튼 상태 변경 (중복 클릭 방지)
    submitBtn.disabled = true;
    submitBtn.innerText = '기록 중...';

    // 폼 데이터를 가져옵니다 (HTML의 name 속성 기준)
    const formData = new FormData(form);

    // fetch API로 데이터 전송
    fetch(SCRIPT_URL, {
        method: 'POST',
        body: formData 
        // 주의: header에 'Content-Type'을 수동으로 설정하지 마세요. 
        // FormData가 알아서 브라우저에 맞는 설정을 해줍니다.
    })
    .then(response => {
        // 구글 스크립트에서 성공적으로 응답이 오면 실행
        alert('성공! 당신의 아이디어가 역사 창업 리스트에 등록되었습니다.');
        
        // 폼 및 미리보기 초기화
        form.reset();
        resetPreview();
    })
    .catch(error => {
        // 에러 발생 시
        console.error('Error!', error.message);
        // CORS 문제로 브라우저가 응답을 차단해도 실제 데이터는 저장되었을 수 있습니다.
        alert('전송 완료! (혹시 에러창이 떠도 시트에는 저장되었을 수 있으니 확인해보세요)');
    })
    .finally(() => {
        // 성공하든 실패하든 버튼은 다시 원래대로 돌려놓습니다.
        submitBtn.disabled = false;
        submitBtn.innerText = '데이터베이스에 기록하기';
    });
});

// 미리보기 화면을 초기 상태로 되돌리는 함수
function resetPreview() {
    previewMap.forEach(mapping => {
        const previewElement = document.getElementById(mapping.previewId);
        if (previewElement) {
            previewElement.innerText = mapping.defaultText;
        }
    });
}
