function sendBarcode() {
    const barcode = document.getElementById('barcode').value;

    fetch('서버 URL', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            barcode: barcode
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('studentName').innerText = data.name;
        document.getElementById('studentBirth').innerText = data.birth;
        document.getElementById('studentInfo').style.display = 'block';
    })
    .catch(error => {
        console.error('서버와 통신할 수 없습니다.', error);
        alert('서버와 통신할 수 없습니다.');
    });
}

function checkIn(type) {
    const barcode = document.getElementById('barcode').value;

    fetch('서버 URL', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            barcode: barcode,
            type: type
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('서버와 통신할 수 없습니다.', error);
        alert('서버와 통신할 수 없습니다.');
    });
}