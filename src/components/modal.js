export function openModal(popup) {
  console.log('Opening popup:', popup);
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEsc);
}

export function closeModal(popup) {
  console.log('Closing popup:', popup);
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEsc);
}

function handleEsc(event) {
  if (event.key === 'Escape') {
      const openedPopup = document.querySelector('.popup_is-opened');
      if (openedPopup) {
          closeModal(openedPopup);
      }
  }
}
