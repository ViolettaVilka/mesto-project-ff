export function createCard(cardData, deleteCard, likeCard, openModal) {
    const template = document.getElementById('card-template');
    const cardElement = template.content.cloneNode(true);

    cardElement.querySelector('.card__title').textContent = cardData.name;
    cardElement.querySelector('.card__image').src = cardData.link;
    cardElement.querySelector('.card__image').alt = cardData.name;

    const deleteButton = cardElement.querySelector('.card__delete-button');
    deleteButton.addEventListener('click', deleteCard);

    const likeButton = cardElement.querySelector('.card__like-button');
    likeButton.addEventListener('click', () => {
        likeCard(likeButton);
    });

    const imageElement = cardElement.querySelector('.card__image');
    imageElement.addEventListener('click', () => {
        const imagePopup = document.querySelector('.popup_type_image');
        const popupImage = imagePopup.querySelector('.popup__image');
        const captionElement = imagePopup.querySelector('.popup__caption');

        popupImage.src = cardData.link;
        captionElement.textContent = cardData.name;
        openModal(imagePopup);
    });

    return cardElement;
}

export function deleteCard(evt) {
    evt.target.closest('.card').remove();
}

export function likeCard(likeButton) {
    likeButton.classList.toggle('card__like-button_is-active');
}