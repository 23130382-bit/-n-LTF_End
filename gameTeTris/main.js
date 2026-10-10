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
    // khối Z
    [
        [1, 1, 0],
        [0, 1, 1]
    ]
];
let khoiHienTai = [];
let vitrihang = 0;
let vitricot = 3;
function taoKhoiMoi() {
    // random khối trong mảng
    const indexNgauNhien = Math.floor(Math.random() * DANH_SACH_KHOI.length);
    // truyền vào cho nó 1 khối
    khoiHienTai = DANH_SACH_KHOI[indexNgauNhien];
    // tạo vị trí mà khối xuất hiện
    vitrihang = 0;
    vitricot = Math.floor((soCot - khoiHienTai[0].length) / 2); //chia khoảng cách , căn đều hai bên.
    if (kiemTraVaCham(0, 0)) {
        alert('Game Over!');
        clearInterval(timerID);
        return false;
    }
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
        danhSachOVuong[index].classList.add('vat_the');
    });
}

// mục đích của việc xóa là xóa vị trí hịnh tại của ô 1
function xoaKhoi() {
    vitrikhoivuong((index) => {
        danhSachOVuong[index].classList.remove('vat_the');
    });
}
//in màu cố định lại
function codinhkhoi() {
    vitrikhoivuong((index) => {
        danhSachOVuong[index].classList.remove('vat_the');
        danhSachOVuong[index].classList.add('da_co_dinh');
    });
}
function resetMap() {
    danhSachOVuong.forEach(oVuong => {
        oVuong.classList.remove('vat_the', 'da_co_dinh');
    });
}
function xoayKhoi() {
    const khoiMoi = khoiHienTai[0].map((_, colIndex) =>
        khoiHienTai.map(row => row[colIndex]).reverse()
    );

    if (!kiemTraVaCham(0, 0, khoiMoi)) {
        xoaKhoi();
        khoiHienTai = khoiMoi;
        veKhoi();
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
function anhang() {
    for (let hang = soHang - 1; hang >= 0; hang--) {
        let hangDaFull = true;
        for (let cot = 0; cot < soCot; cot++) {
            let index = hang * soCot + cot;
            if (!danhSachOVuong[index].classList.contains('da_co_dinh')) {
                hangDaFull = false;
                break;
            }
        }
        if (hangDaFull) {
            for (let r = hang; r > 0; r--) {
                for (let c = 0; c < soCot; c++) {
                    let indexHienTai = r * soCot + c;
                    let indexTren = (r - 1) * soCot + c;
                    if (danhSachOVuong[indexTren].classList.contains('da_co_dinh')) {
                        danhSachOVuong[indexHienTai].classList.add('da_co_dinh');
                    } else {
                        danhSachOVuong[indexHienTai].classList.remove('da_co_dinh');
                    }
                }
            }
            for (let c = 0; c < soCot; c++) {
                danhSachOVuong[c].classList.remove('da_co_dinh');
            }
            hang++;
        }
    }
}


document.addEventListener('keydown', function (suKien) {
    switch (suKien.key) {
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
taoKhoiMoi();
veKhoi();
setInterval(rotxuong, 500);