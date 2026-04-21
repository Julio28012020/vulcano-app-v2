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