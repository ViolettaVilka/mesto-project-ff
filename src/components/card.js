export function createCard(cardData, deleteCard, likeCard, handleImageClick) {
    const template = document.getElementById('card-template');
    const cardElement = template.content.cloneNode(true);

    cardElement.querySelector('.card__title').textContent = cardData.name;
    const imageElement = cardElement.querySelector('.card__image');
    imageElement.src = cardData.link;
    imageElement.alt = cardData.name;

    const deleteButton = cardElement.querySelector('.card__delete-button');
    deleteButton.addEventListener('click', deleteCard);

    const likeButton = cardElement.querySelector('.card__like-button');
    likeButton.addEventListener('click', () => {
        likeCard(likeButton);
    });

    imageElement.addEventListener('click', () => {
        handleImageClick(cardData);
    });

    return cardElement;
}

export function deleteCard(evt) {
    evt.target.closest('.card').remove();
}

export function likeCard(likeButton) {
    likeButton.classList.toggle('card__like-button_is-active');
}
