import { request } from '../utils/utils';
export const config = {
    headers: {
      authorization: '17dc75d2-a7cf-4cb7-9d17-088b6b2d91b2',
      'Content-Type': 'application/json',
    },
  };

// Удаление карточек
export const deleteCardApi = (cardId) => {
    return request(`/cards/${cardId}`, {
        method: 'DELETE',
        headers: config.headers,
    });
}

// Управление лайкками
export const toggleLikeApi = (cardId, isLiked) => {
    const method = isLiked ? 'DELETE' : 'PUT';
    return request(`/cards/likes/${cardId}`, {
        method: method,
        headers: config.headers,
    });
}


// Получение данных профиля
export const getUserInfo = () => {
    return request(`/users/me`, {
        headers: config.headers
    });
}

// Редактирование профиля
export const editUserInfo = (name, about) => {
    return request(`/users/me`, {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
            name: name,
            about: about
        })
        })

}

// Получение всех карточек
export const getCards = () => {
    return request(`/cards`, {
        headers: config.headers
    })
}

// Добавление новой карточки
export const addNewCardApi = (name, link) => {
    return request('/cards', {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify({ name, link })
    });
};

// Обновление аватара
export const updateAvatarApi = (url) => {
    return request('/users/me/avatar', {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({ avatar: url })
    });
};
