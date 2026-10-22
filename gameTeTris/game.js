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
//danh sách màu
const DANH_SACH_MAU = [
    'mau_tim',
    'mau_xanh_nhat',
    'mau_vang',
    'mau_cam',
    'mau_xanh_dam',
    'mau_xanh_la',
    'mau_do'
];


// lấy randum 1 số với đó nhỏ hơn độ dài của mảng lớn ,để lấy ra một mảng con là khối cần tạo
let khoiHienTai = [];
let vitrihang = 0;
let vitricot = 3;
function taoKhoiMoi() {
    // random khối trong mảng
    const indexNgauNhien = Math.floor(Math.random() * DANH_SACH_KHOI.length);
    chiSoKhoiHienTai = indexNgauNhien;
    // truyền vào cho nó 1 khối
    khoiHienTai = DANH_SACH_KHOI[indexNgauNhien];
    mauHienTai = DANH_SACH_MAU[indexNgauNhien];
    // tạo vị trí mà khối xuất hiện
    vitrihang = 0;
    vitricot = Math.floor((soCot - khoiHienTai[0].length) / 2); //chia khoảng cách , căn đều hai bên.
    return true;
}

/// đọc vị trí mà khối sẽ đc tạo ở trong map


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
    xuLyChamVatBay();
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

// xoay khối áp dụng công thức xoay của ma trận 
// xét một số trường hợp đặc biệt cần phải di dời một số vị trí để xoay đc như ý muốn
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

//đã có các hàm có sẳn, áp dụng hình thức gọi lại hàm 
//kiểm tra va chạm để xem có thể tiếp tục tạo khối 
// cơ chế rơi xuống là xóa --> tạo --> xóa -->> tạo với vị trí mới

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
                dungGame();
                alert("Thất bại với số điểm: " + tongdiem);
                return;
            }
            veKhoi();
        }
    }

}
// tạo cho người chơi thêm cách thức chơi   
function roiThangXuong() {
    if (!dangChoi) return;

    xoaKhoi();

    // Thêm riêng cho level 4
    if (levelHienTai === 4 && vatBay !== null) {

        while (!kiemTraVaCham(1, 0) && !kiemTraChamVatBay()) {
            vitrihang++;
        }

        // Ghi nhận trước khi veKhoi() cố định và tạo khối mới
        let chamThanhBay = kiemTraChamVatBay();

        veKhoi();

        if (!chamThanhBay) {
            rotxuong();
        }

        return;
    }


    while (!kiemTraVaCham(1, 0)) {
        vitrihang++;
    }
    veKhoi();
    rotxuong();
}

// kiểm tra chạm 2 bên , chạm vật thể cố định , chạm đáy
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
//tạo lại map
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
    // Dừng hết timer của lượt trước
    dungGame();
    resetMap();

    if (taoKhoiMoi()) {
        veKhoi();
    }

    nutBatDau.disabled = true;
    nutKetThuc.disabled = false;

    // Hàm thông báo sẽ chờ 3 giây rồi mới chạy game
    apDungCoCheLevel();
}
nutBatDau.addEventListener('click', function () {
    batDauGame();
});

function dungGame() {
    dangChoi = false;

    clearInterval(timerID);
    timerID = null;

    clearInterval(timerThongBao);
    timerThongBao = null;

    clearInterval(timerDoiKhoi);
    timerDoiKhoi = null;

    dungXoayTheoTG();
    dungVatBay();

    document.getElementById('thongBaoBatDau').style.display = 'none';

    document.getElementById('thongBaoLevel').textContent =
        'Đã ngừng chơi';

    nutBatDau.disabled = false;
    nutKetThuc.disabled = true;
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
        case ' ':
            suKien.preventDefault();
            if (suKien.repeat) return;
            roiThangXuong();
            break;
    }
});
//lấy danh sách lv
const danhSachNutLevel = document.querySelectorAll('.level');
// bắt lấy cấp độ hiện tại
function chonLevel(level) {
    //trong lv đang có
    if (level < 1 || level > 7) return;
    //kết thuc game ngay
    dungGame();
    resetMap();
    //cập nhật lại lv
    levelHienTai = level;
    apDungCoCheLevel();
    batDauGame();
}


danhSachNutLevel.forEach(function (nut) {
    nut.addEventListener('click', function () {
        chonLevel(Number(nut.dataset.level));
    });
});


// logic lv 2
// vật thể sẽ tự động xoay trong qua trình rơi
// đầu tiên thiết lập cho nó tự động xoay
// vì qua trình xoay liên túc gây khó chịu, cần có thời gian xoay và ngừng  
// xét tốc độ xoay để người chơi kịp phản ứng 

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
// logic lv 3
// vật thể thay đổi trong quá trình rơi
// đầu tiên thay đổi khối hiện tại bằng khổi mới 
// một số trường hợp vì khồi không thể hay đổi vì map không đủ khoảng trống , chọn hình thức bỏ qua , khối cũ sẽ ko bị thay
// thiết lập thêm thời gian để người chơi kịp phản ứng
let timerDoiKhoi = null;
let chiSoKhoiHienTai = -1;
let mauHienTai = '';
function doiKhoiHienTai() {
    let indexNgauNhien = Math.floor(Math.random() * DANH_SACH_KHOI.length);
    while (indexNgauNhien === chiSoKhoiHienTai) {
        indexNgauNhien = Math.floor(Math.random() * DANH_SACH_KHOI.length);
    }
    let khoiMoi = DANH_SACH_KHOI[indexNgauNhien];
    if (kiemTraVaCham(0, 0, khoiMoi)) {
        return;
    }
    xoaKhoi();
    khoiHienTai = khoiMoi;
    mauHienTai = DANH_SACH_MAU[indexNgauNhien];
    chiSoKhoiHienTai = indexNgauNhien;
    veKhoi();
}
function doiKhoiTheoTG() {
    let thoiGianDoi = 3000;
    clearInterval(timerDoiKhoi);
    timerDoiKhoi = setInterval(function () {
        if (dangChoi && levelHienTai === 3) {
            doiKhoiHienTai();
        }
    }, thoiGianDoi);
}
// logic lv 4
let timerSinhVatBay = null;
let timerDiChuyenVatBay = null;
let vatBay = null;

function duyetOVatBay(xuLy) {
    if (vatBay === null) return;

    for (let i = 0; i < 3; i++) {
        let cot = vatBay.cot + i;

        if (cot >= 0 && cot < soCot) {
            let index = vatBay.hang * soCot + cot;
            xuLy(index);
        }
    }
}

function veVatBay() {
    duyetOVatBay(function (index) {
        danhSachOVuong[index].classList.add('vat_the_bay');
    });
}

function xoaVatBay() {
    duyetOVatBay(function (index) {
        danhSachOVuong[index].classList.remove('vat_the_bay');
    });
}

function timHangBay() {
    for (let hang = 0; hang < soHang; hang++) {
        for (let cot = 0; cot < soCot; cot++) {
            let index = hang * soCot + cot;

            if (danhSachOVuong[index].classList.contains('da_co_dinh')) {
                return hang - 4;
            }
        }
    }

    return soHang - 4;
}

function taoVatBay() {
    if (!dangChoi || levelHienTai !== 4) return;
    if (vatBay !== null) return;

    let hangBay = timHangBay();

    if (hangBay < 0 || hangBay >= soHang) return;

    vatBay = {
        hang: hangBay,
        cot: -3
    };
}

function kiemTraChamVatBay() {
    if (!dangChoi || levelHienTai !== 4 || vatBay === null) {
        return false;
    }

    let daCham = false;

    vitrikhoivuong(function (indexKhoi) {
        let hangKhoi = Math.floor(indexKhoi / soCot);
        let cotKhoi = indexKhoi % soCot;

        duyetOVatBay(function (indexBay) {
            let hangBay = Math.floor(indexBay / soCot);
            let cotBay = indexBay % soCot;

            let khoangCach =
                Math.abs(hangKhoi - hangBay) +
                Math.abs(cotKhoi - cotBay);

            if (khoangCach <= 1) {
                daCham = true;
            }
        });
    });

    return daCham;
}

function xuLyChamVatBay() {
    if (!kiemTraChamVatBay()) return;

    xoaVatBay();
    codinhkhoi();

    duyetOVatBay(function (index) {
        let oVuong = danhSachOVuong[index];

        if (!oVuong.classList.contains('da_co_dinh')) {
            oVuong.classList.add('da_co_dinh', 'mau_xanh_nhat');
        }
    });

    vatBay = null;

    anhang();

    if (taoKhoiMoi()) {
        if (kiemTraVaCham(0, 0)) {
            dungGame();
            alert('Thất bại với số điểm: ' + tongdiem);
            return;
        }

        veKhoi();
    }
}

function diChuyenVatBay() {
    if (!dangChoi || levelHienTai !== 4 || vatBay === null) {
        return;
    }

    xoaVatBay();

    vatBay.cot = vatBay.cot + 1;

    if (vatBay.cot >= soCot) {
        vatBay = null;
        return;
    }

    veVatBay();
    xuLyChamVatBay();
}

function dungVatBay() {
    clearInterval(timerSinhVatBay);
    clearInterval(timerDiChuyenVatBay);

    timerSinhVatBay = null;
    timerDiChuyenVatBay = null;

    xoaVatBay();
    vatBay = null;
}

function batDauVatBay() {
    dungVatBay();

    timerSinhVatBay = setInterval(taoVatBay, 5000);
    timerDiChuyenVatBay = setInterval(diChuyenVatBay, 200);
}
// logic lv 5 

// logic lv 6

// logic lv 7



// chuyển cấp độ 
function apDungCoCheLevel() {
    thongBaoLevel(levelHienTai);
    //kết thúc hàm xoay theo thời gian 
    dungXoayTheoTG();
    clearInterval(timerDoiKhoi);
    timerDoiKhoi = null;
    dungVatBay();

    switch (levelHienTai) {
        case 1:
            thongBaoLevel(1)
            break;
        case 2:
            thongBaoLevel(2)
            xoaytheotg();
            break;
        case 3:
            thongBaoLevel(3)
            doiKhoiTheoTG();
            break;

        case 4:
            thongBaoLevel(4)
            batDauVatBay();
            break;

        case 5:
            break;

        case 6:
            break;

        case 7:
            break;
    }
}
let timerThongBao = null;

function thongBaoLevel(level) {
    clearInterval(timerThongBao);

    const thongBao = document.getElementById('thongBaoLevel');
    const manThongBao = document.getElementById('thongBaoBatDau');
    const tenCheDo = document.getElementById('tenCheDo');
    const demNguoc = document.getElementById('demNguocBatDau');

    let dangXoay = true;
    let dangCho = true;
    let giayCho = 3;
    let giay;

    switch (level) {
        case 1:
            tenCheDo.textContent = 'Level 1: Bình thường';
            break;

        case 2:
            tenCheDo.textContent = 'Level 2: Tự động xoay';
            giay = 7;
            break;

        case 3:
            tenCheDo.textContent = 'Level 3: Đổi hình khối';
            giay = 3;
            break;

        case 4:
            tenCheDo.textContent = 'Level 4: Vật thể bay ngang';
            giay = 5;
            break;

        default:
            tenCheDo.textContent = 'Level ' + level;
            break;
    }

    // Hiện màn thông báo trước khi chơi
    manThongBao.style.display = 'flex';
    demNguoc.textContent = 'Bắt đầu sau ' + giayCho + ' giây';
    thongBao.textContent = 'Đang chuẩn bị...';

    function hienThongBao() {
        switch (level) {
            case 1:
                thongBao.textContent = 'Level 1: Bình thường';
                break;

            case 2:
                if (dangXoay === true) {
                    thongBao.textContent = 'Đang xoay: ' + giay + ' giây';
                } else {
                    thongBao.textContent = 'Ngừng xoay: ' + giay + ' giây';
                }
                break;

            case 3:
                thongBao.textContent = 'Đổi khối sau: ' + giay + ' giây';
                break;

            case 4:
                thongBao.textContent = 'Sinh vật thể sau: ' + giay + ' giây';
                break;

            default:
                thongBao.textContent = 'Level ' + level;
                break;
        }
    }

    timerThongBao = setInterval(function () {
        // Giai đoạn chờ trước khi bắt đầu
        if (dangCho === true) {
            giayCho = giayCho - 1;

            demNguoc.textContent =
                'Bắt đầu sau ' + giayCho + ' giây';

            if (giayCho === 0) {
                dangCho = false;
                manThongBao.style.display = 'none';

                // Hết thời gian chờ mới bắt đầu game
                dangChoi = true;
                timerID = setInterval(rotxuong, 500);

                switch (level) {
                    case 2:
                        xoaytheotg();
                        break;

                    case 3:
                        doiKhoiTheoTG();
                        break;

                    case 4:
                        batDauVatBay();
                        break;
                }

                hienThongBao();

                // Các level này không cần đồng hồ đếm tiếp
                if (level < 2 || level > 4) {
                    clearInterval(timerThongBao);
                    timerThongBao = null;
                }
            }

            return;
        }

        // Giai đoạn đang chơi
        giay = giay - 1;

        if (giay === 0) {
            switch (level) {
                case 2:
                    if (dangXoay === true) {
                        dangXoay = false;
                        giay = 15;
                    } else {
                        dangXoay = true;
                        giay = 7;
                    }
                    break;

                case 3:
                    giay = 3;
                    break;

                case 4:
                    giay = 5;
                    break;
            }
        }

        hienThongBao();
    }, 1000);
}