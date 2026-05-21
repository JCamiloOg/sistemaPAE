import Swal from "sweetalert2";

export const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#f3fff8',
    color: '#3f3125',
    customClass: {
        popup: '!rounded-[1.75rem]',
        confirmButton: '!rounded-xl !px-5 !py-2 !font-medium',
        cancelButton: '!rounded-xl !px-5 !py-2 !font-medium'
    },
    showClass: {
        popup: 'swal2-show'
    },
    hideClass: {
        popup: 'swal2-hide'
    }
});
