const manHinhChinh = document.getElementById('manhinhchinh');
//kích thức màn hình
const soHang = 20;
const soCot = 10;
let timerID = null;
//tạo map
for (let i = 0; i < soHang; i++) {
    for (let j = 0; j < soCot; j++) {
        const oVuong = document.createElement('div');
        oVuong.classList.add('o_vuong');
        manHinhChinh.appendChild(oVuong);
    }
}

const danhSachOVuong = Array.from(document.querySelectorAll('.o_vuong'));
//tạo một danh sách chứa các vật thể
const DANH_SACH_KHOI = [
    // khối t
    [
        [0, 1, 0],
        [1, 1, 1]
    ],
    // khối I
    [
        [1, 1, 1, 1]
    ],
    // khối vuông
    [
        [1, 1],
        [1, 1]
    ],
    // khối L
    [
        [1, 0],
        [1, 0],
        [1, 1]
    ],
    // khối L
    [
        [0, 1],
        [0, 1],
        [1, 1]
    ],
    // khối Z
    [
        [1, 1, 0],
        [0, 1, 1]
    ],
    // khối Z
    [
        [0, 1, 1],
        [1, 1, 0]
    ]
];
const DANH_SACH_MAU = [
    'mau_tim',
    'mau_xanh_nhat',
    'mau_vang',
    'mau_cam',
    'mau_xanh_dam',
    'mau_xanh_la',
    'mau_do'
];
let khoiHienTai = [];
let vitrihang = 0;
let vitricot = 3;
function taoKhoiMoi() {
    // random khối trong mảng
    const indexNgauNhien = Math.floor(Math.random() * DANH_SACH_KHOI.length);
    // truyền vào cho nó 1 khối
    khoiHienTai = DANH_SACH_KHOI[indexNgauNhien];
    mauHienTai = DANH_SACH_MAU[indexNgauNhien];
    // tạo vị trí mà khối xuất hiện
    vitrihang = 0;
    vitricot = Math.floor((soCot - khoiHienTai[0].length) / 2); //chia khoảng cách , căn đều hai bên.
    return true;
}
function vitrikhoivuong(tuongtac) {
    //chạy vòng lặp trong khối
    for (let i = 0; i < khoiHienTai.length; i++) {
        for (let j = 0; j < khoiHienTai[i].length; j++) {
            // lấy ra chính sách các ô có chứa 1 trong khối vừa lấy ra
            if (khoiHienTai[i][j] === 1) {
                let indexThucTe = (vitrihang + i) * soCot + (vitricot + j); // vị trí ô 1 đc tô màu // hiểu là 1-200 ô của map trong đó lấy ra 1 ô để tô màu      
                // xử lí các ô có giá trị 1 trong khối 
                tuongtac(indexThucTe);
            }
        }
    }
}
//tạo màu cho khối vào hình
function veKhoi() {
    vitrikhoivuong((index) => {
        danhSachOVuong[index].classList.add('vat_the', mauHienTai);
    });
}
// mục đích của việc xóa là xóa vị trí hịnh tại của ô 1
function xoaKhoi() {
    vitrikhoivuong((index) => {
        danhSachOVuong[index].classList.remove('vat_the', mauHienTai);
    });
}
//in màu cố định lại
function codinhkhoi() {
    vitrikhoivuong((index) => {
        danhSachOVuong[index].classList.remove('vat_the');
        danhSachOVuong[index].classList.add('da_co_dinh');
    });
}
function xoayKhoi() {
    let khoiMoi = [];
    let soHangKhoi = khoiHienTai.length;
    let soCotKhoi = khoiHienTai[0].length;
    for (let j = 0; j < soCotKhoi; j++) {
        let hangMoi = [];

        for (let i = soHangKhoi - 1; i >= 0; i--) {
            hangMoi.push(khoiHienTai[i][j]);
        }
        khoiMoi.push(hangMoi);
    }
    let danhSachDichCot = [0, -1, 1, -2, 2, -3, 3];
    for (let k = 0; k < danhSachDichCot.length; k++) {
        let dichCot = danhSachDichCot[k];
        if (!kiemTraVaCham(0, dichCot, khoiMoi)) {
            xoaKhoi();

            khoiHienTai = khoiMoi;
            vitricot += dichCot;

            veKhoi();
            return;
        }
    }
}
function rotxuong() {
    if (!kiemTraVaCham(1, 0)) {
        xoaKhoi();
        vitrihang++;
        veKhoi();
    } else {
        codinhkhoi();
        anhang();
        if (taoKhoiMoi()) {
            if (kiemTraVaCham(0, 0)) {
                clearInterval(timerID);
                timerID = null;
                alert("Game Over! Điểm của bạn là: " + tongdiem);
                nutBatDau.disabled = false;
                nutKetThuc.disabled = true;
                return;
            }
            veKhoi();
        }
    }

}
function kiemTraVaCham(nhichHang, nhichCot, khoiKiemTra = khoiHienTai) {
    for (let i = 0; i < khoiKiemTra.length; i++) {
        for (let j = 0; j < khoiKiemTra[i].length; j++) {
            if (khoiKiemTra[i][j] === 1) {
                // dự đoán trước hàng và cột có vượt quá không
                let hangMoi = vitrihang + i + nhichHang;
                let cotMoi = vitricot + j + nhichCot;
                // kiểm tra có chạm hàng 
                if (hangMoi >= soHang) return true;
                // kiểm tra có chạm cột
                if (cotMoi < 0 || cotMoi >= soCot) return true;
                // dự đoán nó có bị chạm vào vật thể khác không
                let indexMoi = hangMoi * soCot + cotMoi;
                // kiểm tra có chạm vật thể 
                if (danhSachOVuong[indexMoi].classList.contains('da_co_dinh')) {
                    return true;
                }
            }
        }
    }
    return false;
}


// xử lí ăn hàng
const diemso = document.getElementById('diemhientai');
let tongdiem = 0;
function anhang() {

    //đọc vị trí các ô đã được cố định trong map
    for (let hang = soHang - 1; hang >= 0; hang--) {
        let hangDaFull = true;
        for (let cot = 0; cot < soCot; cot++) {
            let index = hang * soCot + cot;
            if (!danhSachOVuong[index].classList.contains('da_co_dinh')) {
                hangDaFull = false;
                break;
            }
        }
        //đọc các ô xem có full hàng ko    
        if (hangDaFull) {
            for (let r = hang; r > 0; r--) {
                for (let c = 0; c < soCot; c++) {
                    let indexHienTai = r * soCot + c;
                    let indexTren = (r - 1) * soCot + c;
                    if (danhSachOVuong[indexTren].classList.contains('da_co_dinh')) {
                        danhSachOVuong[indexHienTai].className = danhSachOVuong[indexTren].className;
                    } else {
                        danhSachOVuong[indexHienTai].className = 'o_vuong';
                    }
                }
            }
            for (let c = 0; c < soCot; c++) {
                danhSachOVuong[c].className = 'o_vuong';
            }
            tongdiem += 10;
            diemso.innerText = tongdiem;
            hang++;
        }
    }
}
function resetMap() {
    danhSachOVuong.forEach(oVuong => {
        oVuong.className = 'o_vuong';
    });
    tongdiem = 0;
    diemso.innerText = tongdiem;
}
//bắt đầu màn chơi
const nutBatDau = document.getElementById('nutBatDau');
const nutKetThuc = document.getElementById('nutKetThuc');
//khai báo thêm 2 biến là lv và trang thái
let levelHienTai = 1;
let dangChoi = false;
function batDauGame() {
    //load lại map
    resetMap();
    //bắt đầu tạo khối
    if (taoKhoiMoi()) {
        veKhoi();
    }
    //xóa tg cũ
    if (timerID !== null) {
        clearInterval(timerID);
    }
    //chuyển trang thái
    dangChoi = true;
    timerID = setInterval(rotxuong, 500);
    //đóng nút bắt đầu và hiện nút kết thúc
    nutBatDau.disabled = true;
    nutKetThuc.disabled = false;
    // áp dụng lv
    apDungCoCheLevel();
}
nutBatDau.addEventListener('click', function () {
    batDauGame();
});

function dungGame() {
    // cập nhật
    dangChoi = false;
    nutBatDau.disabled = false;
    nutKetThuc.disabled = true;
    clearInterval(timerID);
    clearInterval(timerXoay);
    timerID = null;
    timerXoay = null;

}

nutKetThuc.addEventListener('click', function () {
    dungGame();
});

// xử lí các nút bấm
document.addEventListener('keydown', function (suKien) {
    if (!dangChoi) return;
    switch (suKien.key) {
        //kiểm tra
        case 'ArrowLeft':
            if (!kiemTraVaCham(0, -1)) {
                xoaKhoi();
                vitricot--;
                veKhoi();
            }
            break;
        case 'ArrowRight':
            if (!kiemTraVaCham(0, 1)) {
                xoaKhoi();
                vitricot++;
                veKhoi();
            }
            break;
        case 'ArrowDown':
            rotxuong();
            break;
        case 'ArrowUp':
            xoayKhoi();
            break;
    }
});
//khai báo nút hướng dẫn
const khungHuongDan = document.getElementById('khungHuongDan');
const nutMoHuongDan = document.getElementById('nutMoHuongDan');
const nutDongHuongDan = document.getElementById('nutDongHuongDan');
//ifame trong trang hướng dẫn
const iframe = khungHuongDan.querySelector('iframe');
nutMoHuongDan.addEventListener('click', function () {
    iframe.src = 'huongdan.html';
    khungHuongDan.classList.add('hien_thi');
});
//xử lí nút
nutMoHuongDan.addEventListener('click', function () {
    khungHuongDan.classList.add('hien_thi');
});

nutDongHuongDan.addEventListener('click', function () {
    khungHuongDan.classList.remove('hien_thi');
});
//lấy danh sách lv
const danhSachNutLevel = document.querySelectorAll('.level');
// bắt lấy cấp độ hiện tại
function chonLevel(level) {
    //trong lv đang có
    if (level < 1 || level > 7) return;
    //kết thuc game ngay
    dungGame();
    //cập nhật lại lv
    levelHienTai = level;
    //hiện thị
    iframe.src = 'huongdan.html#level' + level;
    khungHuongDan.classList.add('hien_thi');
}


danhSachNutLevel.forEach(function (nut) {
    nut.addEventListener('click', function () {
        chonLevel(Number(nut.dataset.level));
    });
});


// logic lv 2
let timerXoay = null;  //thoi gian khối xoay
let timerChuKy = null; //bao nhiêu lần xoay trong 1 khoang thoi gian
let trangThaiXoay = false; // trang thái 
//dùng xoay
function dungXoayTheoTG() {
    //dừng
    clearInterval(timerXoay);
    // hủy thời gian
    clearTimeout(timerChuKy);
    //cập nhật lại
    timerXoay = null;
    timerChuKy = null;
    trangThaiXoay = false;
}
function xoaytheotg() {

    let thoigianxoay = 7000; // xét thời gian xoay trong khoảng bao nhiêu s
    let thoigiannghi = 15000; // xét thời gian nghỉ
    let vantocxoay = 250; // xét giời gian xoay
    // logic
    function batDauXoay() {
        // xét lv hiện tại có phải lv 2 ko
        if (!dangChoi || levelHienTai !== 2) return;
        // cập nhật
        trangThaiXoay = true;
        timerXoay = setInterval(function () {
            // kiểm tra trạng thái
            if (dangChoi && trangThaiXoay && levelHienTai === 2) {
                xoayKhoi();
            }
        }, vantocxoay);

        // sau 7s thì dừng
        timerChuKy = setTimeout(function () {
            //cật nhật
            clearInterval(timerXoay);
            timerXoay = null;
            trangThaiXoay = false;
            timerChuKy = setTimeout(function () {
                batDauXoay();
            }, thoigiannghi);

        }, thoigianxoay);
    }
    batDauXoay();
}
// chuyển cấp độ 
function apDungCoCheLevel() {
    //kết thúc hàm xoay theo thời gian 
    dungXoayTheoTG();
    switch (levelHienTai) {

        case 1:
            break;

        case 2:
            xoaytheotg();
            break;
        case 3:
            break;

        case 4:
            break;

        case 5:
            break;

        case 6:
            break;

        case 7:
            break;
    }
}