import { el, setChildren, mount } from 'redom';
import { navigate , PATH} from '../../utils';

// форматируем дату в удобное строковое представление
// dateStr - дата
function formatDate(dateStr) {
  const date = new Date(dateStr);
  let dd = date.getDate();
  if (dd < 10) dd = '0' + dd;

  let mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;

  let yyyy = date.getFullYear();

  return dd + '.' + mm + '.' + yyyy;
}

function headerTable() {
  return el(
    'table.table',
    el(
      'thead.table__thead',
      el(
        'tr',
        el('th.table__col-sender', 'Счет отправителя'),
        el('th.table__col-recipient', 'Счет получателя'),
        el('th.table__col-sum', 'Сумма'),
        el('th', 'Дата'),
      )
    )
  )
}

// Функция формирует одну строку в таблице
// {from, to, amoun, date} - данные о транзакции
// currentAccount - номер текущего счета
function rowTable({from, to, amount, date}, currentAccount) {
  const $row = el('tr'),
        $colSender = el('td.table__col-sender', from),
        $colRecipient = el('td.table__col-recipient', to),
        $colDate = el('td', formatDate(date)),
        $colSum = from === currentAccount ? el('td.table__col-sum.low', `- ${amount} ₽`) : el('td.table__col-sum.buy', `+ ${amount} ₽`);

  setChildren($row, [$colSender, $colRecipient, $colSum, $colDate]);

  return $row;
}

// Галвная функция компонента historyTable.
// data - список объектов транзакций
// currentAccount - номер текущего счета
export default function historyComponent(data, currentAccount) {
  const $container = el('article.history.card-model', {tabindex: 0}),
        $header = el('h3.card-header', 'История переводов'),
        $tableContainer = el('div.scroll-table'),
        $tableBodyContainer = el('div.scroll-table-body'),
        $tableBody = el('table'),
        $tBody = el('tbody.table__body');

  data.forEach(element => {
    mount($tBody, rowTable(element, currentAccount));
  });

  $container.addEventListener('click', () => {
    navigate(PATH.detail, currentAccount);
  });

  setChildren($tableBody, $tBody);
  setChildren($tableBodyContainer, $tableBody)
  setChildren($tableContainer, [headerTable(), $tableBodyContainer]);
  setChildren($container, [$header, $tableContainer]);

  return $container;
}
