export const cohortId = 'wff-cohort-25';
export const token = '17dc75d2-a7cf-4cb7-9d17-088b6b2d91b2';

const userUrl = `https://nomoreparties.co/v1/${cohortId}/users/me`;
const cardsUrl = `https://nomoreparties.co/v1/${cohortId}/cards`;


export const getUserInfo = (nameElement, aboutElement, avatarElement) => {
    return fetch(userUrl, {
        headers: {
            authorization: token
        }
    })
    .then(res => {
    if (res.ok) {
        return res.json()
        }
    })
    .then((userData) => {
        nameElement.textContent = userData.name;
        aboutElement.textContent = userData.about;
        avatarElement.style.backgroundImage = `url(${userData.avatar})`;
        return userData;
    })
    .catch((err) => {
        console.error('Ошибка при загрузке информации о пользователе:', err)
    })
}


export const getCards = () => {
    return fetch(cardsUrl, {
        headers: {
            authorization: token
        } 
    })
    .then(res => {
        if (res.ok) {
            return res.json()
            }
        })
    .catch((err) => {
        console.log('Ошибка при загрузке карточек:', err);
    })
}


export const editUserInfo = (name, about, nameElement, aboutElement) => {
    return fetch(userUrl, {
        method: 'PATCH',
        headers: {
            authorization: token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            about: about
        })
        })
        .then (res => res.json())
        .then(updatedData => {
        nameElement.textContent = updatedData.name;
        aboutElement.textContent = updatedData.about;
    })
    .catch(err => {
        console.error('Ошибка при обновлении информации о пользователе:', err);
    });
}