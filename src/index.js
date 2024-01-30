
const popupBox = document.querySelector('.popup_box');
const cancelButton = document.querySelector('.cancel_button');
const popupOnline = document.querySelector('.online');
const popupOffline = document.querySelector('.offline');
const refreshButton = document.querySelector('.refresh');
const scrollEvent = document.querySelector('.container');
const bodyScroll = document.querySelector('.body_scroll');
const wrapper = document.querySelector('.wrapper');
const buttonInstall = document.querySelector('.install_text');
const loadingInstall = document.querySelector('.loading_install');

const executeCodes = () => {
  popupBox.classList.add("show");
}

window.addEventListener('load', () => {
  setTimeout(executeCodes, 2000);
});

cancelButton.addEventListener('click', () => {
  popupBox.classList.remove("show");
});

loadingInstall.classList.add("hidden")
buttonInstall.classList.remove("hidden")


let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();

  deferredPrompt = e;

  buttonInstall.removeAttribute('hidden');
});

buttonInstall.addEventListener('click', async () => {

  buttonInstall.classList.add('hidden');
  loadingInstall.classList.remove('hidden');

  if (deferredPrompt) {
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    deferredPrompt = null;

    if (outcome !== 'accepted') {
      buttonInstall.classList.remove('hidden');
      loadingInstall.classList.add('hidden');
    }
  }
});


window.ononline = (event) => {
  popupOnline.classList.add("show");
  popupOffline.classList.remove("show");
  scrollEvent.classList.add("disable");
  wrapper.classList.add("disable");
  bodyScroll.classList.add("disable");
};

window.addEventListener("offline", (event) => {
  popupOnline.classList.remove("show");
  popupOffline.classList.add("show");
  scrollEvent.classList.remove("disable");
  wrapper.classList.remove("disable");
  bodyScroll.classList.remove("disable");
});

refreshButton.addEventListener("click", async () => {
  scrollEvent.classList.remove("disable");
  wrapper.classList.remove("disable");
  bodyScroll.classList.remove("disable");
  await window.location.reload();
});
