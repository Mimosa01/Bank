import { el, setChildren } from "redom";
import Chart from 'chart.js/auto';

import { navigate } from '../../utils';

// Функция расчитывает баланс на конец месяца, в заданом диапазоне countMonths.
// countMonths - за какое количество месяцев расчитывать баланс
// accountData - данные счета (номер, баланс, история транзакций)
function dynamicBalance(countMonths, accountData) {
  let data = [];
  let balance = accountData.balance;
  const currentMonth = new Date().getMonth();

  data.push({'month': currentMonth, 'balance': balance});
  countMonths--;

  const end = accountData.transactions.length - 1;
  let count = 0;

  while (countMonths > 0) {
    for (let i = end - count; i >= 0; i--) {
      const month = new Date(accountData.transactions[i].date).getMonth();
      if (month !== data[data.length - 1].month) {
        if (accountData.transactions[i].from === accountData.account) {
          balance += accountData.transactions[i].amount
        } else {
          balance -= accountData.transactions[i].amount
        }

        data.push({'month': month, 'balance': balance.toFixed(2)});
        count++;
        break;
      }

      if (accountData.transactions[i].from === accountData.account) {
        balance += accountData.transactions[i].amount
      } else {
        balance -= accountData.transactions[i].amount
      }

      count++;

    }

    countMonths--;
  }

  return normalizeData(data);
}

// Функция расчитывает суммы исходящих и входящих транзакций за расчетный период.
// countMonths - за какое количество месяцев расчитывать баланс
// accountData - данные счета (номер, баланс, история транзакций)
function transactionRatio(countMonth, accountData) {
  if (accountData.transactions.length === 0) {
    return [];
  }

  const end = accountData.transactions.length - 1;
  let data = [];
  let count = 0;
  let currentMonth = new Date(accountData.transactions[accountData.transactions.length - 1].date).getMonth();

  while (countMonth > 0) {
    let amountOutgoingTransaction = 0;
    let amountIncomingTransaction = 0;

    for (let i = end - count; i >= 0; i--) {
      if (currentMonth === new Date(accountData.transactions[i].date).getMonth()) {

        if (accountData.account === accountData.transactions[i].from) {
          amountOutgoingTransaction += accountData.transactions[i].amount;
        } else {
          amountIncomingTransaction += accountData.transactions[i].amount;
        }

        count++;
      }

      if (currentMonth !== new Date(accountData.transactions[i].date).getMonth()) {
        data.push({'month': currentMonth, 'incoming': amountIncomingTransaction, 'outgoing': amountOutgoingTransaction});
        currentMonth = new Date(accountData.transactions[i].date).getMonth();
        break;
      }

      if (i === 0) {
        data.push({'month': currentMonth, 'incoming': amountIncomingTransaction, 'outgoing': amountOutgoingTransaction});
        break;
      }
    }

    countMonth--;
  }

  return normalizeData(data);
}

// Функция нормализует данные, для передачи в функцию отрисровки графика
function normalizeData(data) {
  const monthNameList = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  const months = Array.from(data, (elem) => monthNameList[elem.month]).reverse();
  let incoming;
  let outgoing;
  let balances;
  let normalData = {};

  if (Object.keys(data[0]).length === 3) {
    incoming = Array.from(data, (elem) => Number(elem.incoming)).reverse();
    outgoing = Array.from(data, (elem) => Number(elem.outgoing)).reverse();
    normalData = {months: months, data: [{data: outgoing, backgroundColor: 'red'}, {data: incoming, backgroundColor: 'green'}]};
  } else {
    balances = Array.from(data, (elem) => Number(elem.balance)).reverse();
    normalData = {months: months, data: [{data: balances, backgroundColor: 'rgba(17, 106, 204, 1)'}]};
  }

  return normalData;
}

// Функция отрисовки графика баланса
function chartRender(data) {
  console.log(data.data === undefined)
  const $chartCanvas = el('canvas.dynamic-balance__chart');
  let fontSize = 20;
  let stacked = false;

  if (data.data) {
    stacked = data.data.length === 2 ? true : false;
  }

  if (window.innerWidth < 768) {
    fontSize = 10;
  } else if (window.innerWidth < 1024) {
    fontSize = 14;
  }

  new Chart(
    $chartCanvas,
    {
      type: 'bar',
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            stacked: stacked,
            position: 'right',
            ticks: {
              font: {
                size: fontSize,
                weight: 500,
                color: 'black',
              }
            }
          },
          x: {
            beginAtZero: true,
            stacked: stacked,
            ticks: {
              font: {
                size: fontSize,
                weight: 700,
                color: 'black',
              }
            }
          }
        },
      },
      data: {
        labels: data.months,
        datasets: data.data
      }
    }
  );

  return $chartCanvas;
}

// Главная функция компонента chartComponent.
// Принимает на вход:
// count - расчетный период в месяцах,
// account - данные счета пользователя,
// chart - строка "simple" или "double", для определения какой график строить
// fullwidth - если true, то сделать контейнер DOM на всю ширину страницы
export default function dynamicBalanceComponent(count, account, chart, fullWidth=false) {
  const $container = el('article.dynamic-balance.card-model.card-model--white', {tabindex: 0}),
        $header = el('h3.card-header', 'Динамика баланса');

  if (fullWidth) {
    $container.classList.add('dynamic-balance--all');
  }

  $container.addEventListener('click', () => {
    navigate('detail-balance', account.account);
  });

  if (chart === 'simple') {
    setChildren($container, [$header, chartRender(dynamicBalance(count, account))]);
  }

  if (chart === 'double') {
    setChildren($container, [$header, chartRender(transactionRatio(count, account))]);
  }

  return $container;
}
