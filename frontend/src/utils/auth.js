export const BASE_URL = 'https://api.oladuwki.nomoredomains.club';

const checkAnswerCorrectness = (response) => {
  if (response.ok) {
    return response.json();
  }

  return Promise.reject(`Ошибка ${response.status}`);
};

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  }).then((response) => checkAnswerCorrectness(response));
};

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  }).then((response) => checkAnswerCorrectness(response));
};

export const getContent = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  })
    .then((response) => checkAnswerCorrectness(response))
    .then((data) => data);
};
