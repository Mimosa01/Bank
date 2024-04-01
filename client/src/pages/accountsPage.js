import { el, setChildren, mount, text } from 'redom';

import header from './components/header';
import { infoSectionAccounts } from './components/infoSectionComponent';
import { navigate, PATH } from '../utils';

const $container = el('div.container');

// Переводим дату в удобный формат
// date - дата
function dateConversion(date) {
  const mounts = ['января, февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const dateObj = new Date(date);
  return `${dateObj.getDate()} ${mounts[dateObj.getMonth() - 1]} ${dateObj.getFullYear()}`;
}

// Функция отрисовки одной карточки счета
// number - номер счета
// balance - баланс счета
// lastTransaction - объект последней транзакции
function accountCard(number, balance, lastTransaction) {
  const $article = el('article.account-card.card-model.card-model--white'),
        $number = el('h3.account-card__number', number),
        $balance = el('span.account-card__balance', `${balance} ₽`),
        $wrapper = el('div.account-card__wrapper'),
        $textWrapper = el('div.account-card__text-wrapper'),
        $headerTransaction = el('span.account-card__mini-header', 'Последняя транзакция:'),
        $date = el('span.account-card__time', lastTransaction),
        $button = el('button.btn-reset.btn-primary.btn-primary--normal.account-card__btn', 'Открыть');

  setChildren($textWrapper, [$headerTransaction, $date]);
  setChildren($wrapper, [$textWrapper, $button]);
  setChildren($article, [$number, $balance, $wrapper]);

  $button.addEventListener('click', (event) => {
    event.preventDefault();

    navigate(PATH.accounts, number);
  });

  return $article;
}

// Функция отрисовки списка карточек счетов
// data - список данных содержащий (номер счета, баланс, объект последней транзакции)
// filter - поле, по которому фильтруем список счетов
function listCards(data, filter='accounts') {
  const $section = el('section.main.main--grid');
  let newData = [];

  if (document.querySelector('section.main')) {
    document.querySelector('section.main').remove();
  }

  data.forEach(obj => {
    newData.push({
      account: obj.account,
      balance: obj.balance,
      date: obj.transactions.length === 0 ? null : obj.transactions[0].date
    });
  });

  newData = newData.sort(function(a, b) {
    let sort = a[filter] > b[filter];
    if (sort) return -1;
  });

  newData.forEach(card => {
    mount($section, accountCard(
        card.account,
        card.balance,
        card.date ? dateConversion(card.date) : 'Отстувуют транзакции',
      )
    )
  });

  mount($container, $section);
}

// Главная функция компонента accountsPage
// root - корневой контейнер
// data - список данных содержащий (номер счета, баланс, объект последней транзакции)
export default async function accountsPage(root, data) {
  setChildren($container, infoSectionAccounts(listCards));
  setChildren(root, [header(true), $container]);
  listCards(data);
}
