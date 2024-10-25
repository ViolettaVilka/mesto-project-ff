export function openModal(popup) {
  console.log('Opening popup:', popup);
  popup.style.visibility = 'visible';
  popup.style.opacity = '1';
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEsc);
}

export function closeModal(popup) {
  console.log('Closing popup:', popup);
  popup.style.opacity = '0';
  popup.addEventListener('transitionend', () => {
      popup.classList.remove('popup_is-opened');
      popup.style.visibility = 'hidden';
      popup.style.opacity = '';
      document.removeEventListener('keydown', handleEsc);
  }, { once: true });
}

function handleEsc(event) {
  if (event.key === 'Escape') {
      const openedPopup = document.querySelector('.popup_is-opened');
      if (openedPopup) {
          closeModal(openedPopup);
      }
  }
}