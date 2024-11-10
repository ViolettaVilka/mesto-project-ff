import './index.css';
import { initialCards } from './cards';
import { createCard } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';
import { config, getUserInfo, getCards, editUserInfo, deleteCardApi, toggleLikeApi, addNewCardApi, updateAvatarApi } from './components/api.js';
import { validationConfig } from './utils/constants.js';
import { handleSubmit } from './utils/utils.js';

const cardList = document.querySelector('.places__list');

let userId;

// Переменные картинки \\
const imagePopup = document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const captionElement = imagePopup.querySelector('.popup__caption');

// Переменные профиля \\
const nameElement = document.querySelector('.profile__title');
const avatarElement = document.querySelector('.profile__image');
const aboutElement = document.querySelector('.profile__description');
const editButton = document.querySelector('.profile__edit-button');
const profileEditForm = document.querySelector('form[name="edit-profile"]');
const nameInput = profileEditForm.querySelector('.popup__input_type_name');
const jobInput = profileEditForm.querySelector('.popup__input_type_description');
const jobElement = document.querySelector('.profile__description');
const profileEditPopup = profileEditForm.closest('.popup');

// Переменные карточки \\
const addButton = document.querySelector('.profile__add-button');
const addCardPopup = document.querySelector('.popup_type_new-card');
const addFormElement = addCardPopup.querySelector('.popup__form');
const cardNameInput = addFormElement.querySelector('.popup__input_type_card-name');
const cardLinkInput = addFormElement.querySelector('.popup__input_type_url');

// Переменные аватара \\
const editAvatarButton = document.querySelector('.profile__edit-avatar-button');
const avatarPopup = document.querySelector('.popup_type_new-avatar');
const avatarInput = avatarPopup.querySelector('#link');
const avatarForm = avatarPopup.querySelector('.popup__form');


// Вызов каждой карточки \\
initialCards.forEach(cardData => {
    if (cardData._id) {
        const cardElement = createCard({cardData, deleteCard, likeCard, handleImageClick, config});
        cardList.appendChild(cardElement);
    }
});


// Функции \\
function handleProfileEditFormSubmit(evt) {
    function makeRequest() {
      const nameValue = nameInput.value;
      const jobValue = jobInput.value;
  
      return editUserInfo(nameValue, jobValue, nameElement, aboutElement)
        .then(() => {
          nameElement.textContent = nameValue;
          jobElement.textContent = jobValue;
          closeModal(profileEditPopup);
        });
    }
    handleSubmit(makeRequest, evt);
}

function handleAddCardFormSubmit(evt) {
    function makeRequest() {
      const cardName = cardNameInput.value;
      const cardLink = cardLinkInput.value;
  
      return addNewCardApi(cardName, cardLink)
            .then(newCardData => {
                const cardElement = createCard({
                    cardData: newCardData,
                    deleteCard,
                    likeCard,
                    handleImageClick,
                    userId
                });
                cardList.prepend(cardElement);
                closeModal(addCardPopup);
            });
    }

    handleSubmit(makeRequest, evt);
  }

function handleAvatarFormSubmit(evt) {
    function makeRequest() {
      const avatarUrl = avatarInput.value;
  
      return updateAvatarApi(avatarUrl)
        .then(() => {
          avatarElement.style.backgroundImage = `url(${avatarUrl})`;
          closeModal(avatarPopup);
        });
    }
    handleSubmit(makeRequest, evt);
  }


function deleteCard(evt, cardId) {
    deleteCardApi(cardId)
        .then(() => {
            const cardElement = evt.target.closest('.card');
            cardElement.remove();
        })
        .catch((err) => {
            console.error('Ошибка при удалении карточки:', err);
        });
}


function likeCard(likeButton, cardData, likeCountElement) {
    const isLiked = likeButton.classList.contains('card__like-button_is-active');
    toggleLikeApi(cardData._id, isLiked)
        .then((updatedCard) => {
            likeButton.classList.toggle('card__like-button_is-active');
            likeCountElement.textContent = updatedCard.likes.length;
        })
        .catch((err) => {
            console.error('Ошибка при нажатии на лайк:', err);
        });
}


function handleImageClick(cardData) {
    popupImage.src = cardData.link;
    popupImage.alt = cardData.name;
    captionElement.textContent = cardData.name;
    openModal(imagePopup);
}

// Закрытие попапов \\
const closeButtons = document.querySelectorAll('.popup__close');
const popups = document.querySelectorAll('.popup');

function setupPopupCloseListeners() {
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const popup = button.closest('.popup');
            closeModal(popup);
        });
    });

    popups.forEach(popup => {
        popup.addEventListener('click', (event) => {
            if (event.target === popup) {
                closeModal(popup);
            }
        });
    });
}


// Добавление обработчиков \\
editButton.addEventListener('click', () => {
    nameInput.value = nameElement.textContent;
    jobInput.value = jobElement.textContent;
    clearValidation(profileEditForm, validationConfig);
    openModal(profileEditPopup);
});
profileEditForm.addEventListener('submit', handleProfileEditFormSubmit);


addButton.addEventListener('click', () => {
    clearValidation(addFormElement, validationConfig);
    openModal(addCardPopup);
});
addFormElement.addEventListener('submit', handleAddCardFormSubmit);


editAvatarButton.addEventListener('click', () => {
    clearValidation(avatarForm, validationConfig);
    openModal(avatarPopup);
});
avatarForm.addEventListener('submit', handleAvatarFormSubmit);

enableValidation(validationConfig);
setupPopupCloseListeners();


Promise.all([getUserInfo(nameElement, aboutElement, avatarElement), getCards()])
    .then(([userData, cards]) => {

        userId = userData._id;
        nameElement.textContent = userData.name;
        aboutElement.textContent = userData.about;
        avatarElement.style.backgroundImage = `url(${userData.avatar})`;

        cards.forEach(cardData => {
            const cardElement = createCard({
                cardData, 
                deleteCard, 
                likeCard, 
                handleImageClick, 
                userId,
                config
        });
            cardList.appendChild(cardElement);
        });
    })
    .catch(err => {
        console.error("Ошибка при загрузке данных:", err);
    });