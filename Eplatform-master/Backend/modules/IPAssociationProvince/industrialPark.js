const collectionConst = require("../../utils/system.const").COLLECTION;
module.exports = {
    "collection": collectionConst.INDUSTRIALPARKS,
    "moduleName": "Industrial Park",
    "fields": [
        {
            "label": "Name",
            "attr": "name",
            "inputType": "text",
            "slug" : true
        }, {
            "label": "Industrial Park url",
            "attr": "url",
            "inputType": "url"
        }, {
            "label": "Owner",
            "attr": "owner",
            "inputType": "texteditor"
        }, {
            "label": "Phone Number",
            "attr": "phoneNumber",
            "inputType": "tel",
            "required": false
        }, {
            "label": "Email",
            "attr": "email",
            "inputType": "email",
            "required": false
        }, {
            "label": "Website",
            "attr": "website",
            "inputType": "text",
            "multi": false,
            "required": false
        }, {
            "label": "Area",
            "attr": "area",
            "inputType": "decimal"
        }, {
            "label": "Address",
            "attr": "address",
            "inputType": "map"
        }, {
            "label": "Association",
            "attr": "associationId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.ASSOCIATIONS,
            "required": false
        }, {
            "label": "Chinh sach uu dai",
            "attr": "chinhSachUuDai",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Nganh nghe tiep nhan",
            "attr": "nganhNgheTiepNhan",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Tong so lao dong",
            "attr": "employee",
            "inputType": "textarea",
            "required": false
        }, {
            "label": "Ti le thue",
            "attr": "tiLeThue",
            "inputType": "textarea",
            "required": false
        }, {
            "label": "Special Zone",
            "attr": "specialZoneId",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.SPECIALZONES,
            "required": false
        }, {
            "label": "Danh sach khach hang",
            "attr": "danhSachKhachHang",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Dien Tich",
            "attr": "dienTich",
            "inputType": "decimal",
            "required": false
        }, {
            "label": "Ha tang ky thuat",
            "attr": "haTangKyThuat",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Co cau su dung dat",
            "attr": "coCauSuDungDat",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Phan Khu Chuc Nang",
            "attr": "phanKhuChucNang",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Khi hau",
            "attr": "khiHau",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Dia hinh va Dia Chat",
            "attr": "diaHinhDiaChat",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "He thong giao thong",
            "attr": "heThongGiaoThong",
            "inputType": "textarea",
            "required": false
        }, {
            "label": "He thong dien",
            "attr": "heThongDien",
            "inputType": "textarea",
            "required": false
        }, {
            "label": "He thong nuoc",
            "attr": "heThongNuoc",
            "inputType": "textarea",
            "required": false
        }, {
            "label": "He thong xu ly nuoc thai",
            "attr": "heThongXuLyNuocThai",
            "inputType": "textarea",
            "required": false
        }, {
            "label": "He thong vien thong",
            "attr": "heThongVienThong",
            "inputType": "textarea",
            "required": false
        }, {
            "label": "Gia thue",
            "attr": "giaThue",
            "inputType": "number",
            "required": false
        }, {
            "label": "Phuong thuc thanh toan",
            "attr": "phuongThucThanhToan",
            "inputType": "text",
            "required": false
        }, {
            "label": "Gia thue nha xuong",
            "attr": "giaThueNhaXuong",
            "inputType": "number",
            "required": false
        }, {
            "label": "Phi quan ly ha tang ky thuat",
            "attr": "phiQuanLyHaTangKyThuat",
            "inputType": "number",
            "required": false
        }, {
            "label": "Gia dien",
            "attr": "giaDien",
            "inputType": "number",
            "required": false
        }, {
            "label": "Gia nuoc",
            "attr": "giaNuoc",
            "inputType": "number",
            "required": false
        }, {
            "label": "Phi xu ly nuoc thai",
            "attr": "phiXuLyNuocThai",
            "inputType": "number",
            "required": false
        }, {
            "label": "Tien ich cong cong",
            "attr": "tienIchCongCong",
            "inputType": "texteditor",
            "required": false
        }, {
            "label": "Dia diem quan trong",
            "attr": "diaDiemQuanTrong",
            "inputType": "select_lookup",
            "lookupFrom": collectionConst.MAPPLACES,
            "multi": true,
            "required": false
        }, {
            "label": "Logo",
            "attr": "logoImageId",
            "inputType": "file",
            "required": false,
            "setFeature": true
        }, {
            "label": "Gallery Image",
            "attr": "imageIds",
            "multi": true,
            "inputType": "file",
            "required": false
        }
    ],
    "lookupField": "name",
    "queryField": ["name"]
}