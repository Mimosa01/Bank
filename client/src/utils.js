import Navigo from 'navigo';
import { el, mount, setChildren } from 'redom';
import { WorkApi } from './WorkApi';
import { setItemData, addStorage, getData } from './localStorage';
import { skeletonCurrency, skeletonDynamic, skeletonViewBalance, skeletonAccounts, skeletonMap } from './loader';

import ErrorSvg from './asset/images/error.svg';

export const router = new Navigo('/'); // экземпляр Navigo
export const $root = el('div.body-wrapper'); // Корневой элемент приложения
setChildren(document.body, $root);

// Путь страниц
export const PATH = {
  accounts: 'accounts/',
  detail: 'detail-balance',
  currencies: 'currencies/',
  banks: 'banks/',
  exit: 'logout/'
};

export const localStorageName = {
  token: 'token',
  history: 'history_payments'
}

// Функция валидации
// inputs - список DOM элементов полей ввода
// type - тип валидации (auth, transaction, translate)
export function validation(inputs, type) {
  let isValid = false;
  let message = null;

  inputs.forEach(input => {
    let value = input.value.trim();

    if (value === '') {
      message = 'Поле не может быть пустым';
    } else if (value.includes(' ')) {
      message = 'Поле не может содержать пробелы';
    } else if (type === 'auth' && value.length < 6) {
      message = 'Значение поля не может быть меньше 6 символов';
    } else if ((type === 'transaction' || type === 'traslate') && input.name === 'amount' && Number(input.value) < 0) {
      message = 'Сумма не может быть отрицательной';
    }

    if (message) {
      addErrorDOM(input.parentElement, input, message);
    }
  });

  if (!message) {
    isValid = true;
  }

  return isValid;
}

// Функция добавления ошибок в DOM элементы
// container - контейнер, в котором будет распологаться текст ошибки
// field - input, который нужно будет подсветить
// message - текст ошибки
export function addErrorDOM(container, field, message) {
  const error = el('div.form__error-container', el('img', {src: ErrorSvg}), el('span', message));

  if (field) {
    field.classList.add('form__input--error');
  }
  mount(container, error);
}

// Функция авторизации
// login - строка с логином
// password - строка с паролем
export async function autorization(login, password) {
  const responce = await WorkApi.autorization(login, password);

  if (responce.payload == null) {
    return responce.error;
  }

  setItemData(localStorageName.token, responce['payload'][localStorageName.token]);
  router.navigate(PATH.accounts);
}

// Функция перенаправления на страницу
// path - путь
// params - параметры (номер счета)
export function navigate(path, params='') {
  switch (path) {
    case PATH.accounts:
      if (params !== '') {
        skeletonViewBalance($root);
      } else {
        skeletonAccounts($root);
      }
      break;
    case PATH.currencies:
      skeletonCurrency($root);
      break;
    case PATH.banks:
      skeletonMap($root);
      break;
    case PATH.detail:
      skeletonDynamic($root);
      break;
  }

  router.navigate(`${path + params}`);
}

// Функция обработчик для dropdown, с типом filter
// filter - строка, поле по которому филььтруем список счетов
// renderFunc - функция отрисовки списка счетов
export function dropdownAccountsHandler(filter, renderFunc) {
  WorkApi.getAccounts(getData(localStorageName.token))
  .then((res) => {
    renderFunc(res.payload, filter);
  });

}

// Функция создание нового счета
// renderFunc - функция отрисовки списка счетов
export function createAccount(renderFunc) {
  const token = getData(localStorageName.token);
  WorkApi.createAccount(token)
  .then(() => {
    WorkApi.getAccounts(token)
    .then((res) => {
      renderFunc(res.payload);
    })
  })
}

// Функция получения истории счетов переводов
export function existsHistoryPayments() {
  return getData(localStorageName.history);
}

// Функция добавления в localStorage только уникальных счетов
// account - номер счета
function addUniqAccountsHistory(account) {
  const historyAccounts = getData(localStorageName.history) ? getData(localStorageName.history) : [];
  if (!historyAccounts.includes(account)) {
    addStorage(localStorageName.history, account);
  }
}

// Функция перевода денег на другой счет
// from - номер счета откуда переводим
// to - номер счета куда переводим
// amount - сколько
export async function trunsferFunds(from, to, amount) {
  const responce = await WorkApi.transferFunds(from, to, amount, getData(localStorageName.token));

  if (responce.error !== '') {
    return responce.error;
  } else {
    addUniqAccountsHistory(to);
    location.reload();
  }
}

// Функция обмена валют
// from - исходная валюта
// to - валюта в которую переводим
// amount - сколько
export async function exchangeCurrency(from, to, amount) {
  const responce = await WorkApi.exchangeCurrency(from, to, amount, getData(localStorageName.token));

  if (responce.error !== null) {
    return responce.error;
  }
}

// Функция получения изменений курсов валют
// renderFunc - функция рендера списка валют
export async function streamCurrencies(renderFunc) {
  const responce = await WorkApi.getChangedCurrency();

  responce.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.type === 'EXCHANGE_RATE_CHANGE') {
      renderFunc(data);
    }
  }
}

// Функция получения списка геоточек для отображения на карте
export async function getBanks() {
  const responce = await WorkApi.getBanks();
}
