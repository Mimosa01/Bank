import { el, setChildren, mount } from 'redom';

import header from './components/header';
import dynamicBalanceComponent from './components/chartComponent';
import { infoSection } from './components/infoSectionComponent';
import historyComponent from './components/historyTable';
import { PATH } from '../utils';

// Главная функция компонента detailBalancePage
// root - корневой элемент
// data - объект счета пользователя
export default function detailBalancePage(root, data) {
  const $container = el('div.container');
  const $mainSection = el('section.main.main--row-gap');

  const $simpleChart = dynamicBalanceComponent(12, data, 'simple', true);
  const $doubleChart = dynamicBalanceComponent(12, data, 'double', true);

  setChildren($mainSection,
    [
      $simpleChart,
      $doubleChart,
      historyComponent(data.transactions.slice(-25), data.account)
    ]);

  setChildren($container, [infoSection(data.account, data.balance, PATH.accounts, data.account), $mainSection]);
  setChildren(root, [header(true), $container]);
}
