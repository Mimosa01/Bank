import { el, setChildren } from 'redom';

import { navigate, createAccount, dropdownAccountsHandler } from '../../utils';
import dropdown from './dropdown';

import Add from '../../asset/images/add.svg';
import Arrow from '../../asset/images/arrow.svg';

// Функция отрисовки DOM контейнера с заголовком страницы
// renderFunc - Функция которая, передается в dropdown для перерисовки списка счетов
export function infoSectionAccounts(renderFunc) {
  const $section = el('section.info-section'),
        $header = el('h2.page-header.info-section__header', 'Ваши счета'),
        $button = el('button.btn-reset.btn-primary.btn-primary--normal.info-section__btn', el('img', {src:Add}), 'Создать новый счет');

  setChildren($section, [
    $header,
    dropdown([
      {text: 'По номеру', attr: 'account'},
      {text: 'По балансу', attr: 'balance'},
      {text: 'По последней транзакции', attr: 'date'}
    ], 'filter', null, dropdownAccountsHandler, renderFunc),
    $button
  ])

  $button.addEventListener('click', () => {
    createAccount(renderFunc);
  });

  return $section;
}

// Функция отрисовки DOM контейнера с заголовком страницы
// number - номер счета
// balance - баланс счета
// path - ссылка для перехода по кнопке "Вернуться назад"
export function infoSection(number, balance, path, params='') {
  const $section = el('section.info-section.info-section__column'),
        $button = el('button.btn-reset.btn-primary.btn-primary--normal.info-section__btn.info-section__btn--view', el('img', {src: Arrow}), 'Вернуться назад'),
        $topWrapper = el(
          'div.info-section__wrapper',
          el('h2.page-header.info-section__header', 'Просмотр счета'),
          $button
          ),
        $bottomWrapper = el(
          'div.info-section__wrapper',
          el('span.info-section__number', `№ ${number}`),
          el(
            'div.info-section__balance-container',
            el('span.info-section__balance.info-section__balance--bold', 'Баланс:'),
            el('span.info-section__balance', `${balance.toFixed(2)} р`)
          ),
        );

  $button.addEventListener('click', () => {
    navigate(path, params);
  })

  setChildren($section, [$topWrapper, $bottomWrapper]);

  return $section;
}
