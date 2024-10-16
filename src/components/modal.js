export function openModal(popup) {
  popup.classList.add('popup_is-opened');
}

export function closeModal(popup) {
  popup.style.opacity = '0';
  popup.addEventListener('transitionend', () => {
      popup.classList.remove('popup_is-opened');
      popup.style.visibility = 'hidden';
  },);
}
