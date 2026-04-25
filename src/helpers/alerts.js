import Swal from "sweetalert2";

export const redirectAlert = (title, message, url, icon, timer) => {
    let timerInterval;
    Swal.fire({
        title,
        html: message + "<p></p>",
        timer,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("p");
            timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
        },
        willClose: () => {
            clearInterval(timerInterval);
        }
    });
}

export const errorAlert = (message) => {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        confirmButtonText: 'Aceptar'
    });
};

export const successAlert = (title, timer) => {
    Swal.fire({
        position: "center",
        icon: "success",
        title,
        showConfirmButton: false,
        timer,
    });
}

export function alertaEliminarClase(mensaje, icono, url){
    return Swal.fire({
        title: "Estas seguro que deseas eliminar tu clase?",
        text: "Al cancelar tendras que agendar una nueva clase",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#472825",
        cancelButtonColor: "#96786f",
        background: "#fff4e2",
        color: "#472825",
        confirmButtonText: "Si, deseo eliminar mi clase!",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Eliminado!",
                text: "Tu clase ha sido eliminada correctamente.",
                icon: "success",
                confirmButtonColor: "#472825",
                background: "#fff4e2",
                color: "#472825"
            });
            return true;
        }
        return false;
    });
};