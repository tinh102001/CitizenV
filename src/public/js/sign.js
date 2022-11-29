/**
 * Đăng nhập
 * 
 */
function log() {
    // Lấy giá trị các trường
    var id = document.getElementById('id').value;
    var psw = document.getElementById('psw').value;

    fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "id": id,
            "password": psw
        })
    }).then(response => response.json()).then(res => {
        if (res.status == 'succes') {
            localStorage.setItem("token", res.token);
            localStorage.setItem("id", res.id);
            if ([2, 3, 4].includes(res.id.length))
                document.location.pathname = "/list" // tài khoản truy cập vai trò A1,A2,A3 sẽ ưu tiên vào trang Danh sách
            else
                document.location.pathname = "/form" // B1 B2 ưu tiên việc nhập liệu nên chuyển sang trang Nhập liệu
        } else {
            // Báo lỗi
            alert(res.status)
            localStorage.setItem("token", ''); // Đăng nhập thất bại: token sẽ rỗng.
        }
    });
}