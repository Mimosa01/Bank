import { router, PATH, localStorageName } from "./utils";
import { el, setChildren } from 'redom';

import accountsPage from "./pages/accountsPage";
import autorizationPage from "./pages/autorizationPage";
import viewAccountPage from './pages/viewAccountPage';
import detailBalancePage from "./pages/detailBalance";
import currencyPage from "./pages/currencyPage";
import banksPage from "./pages/banksPage";
import { $root } from "./utils";

import './scss/main.scss';
import { WorkApi } from "./WorkApi";
import { getData } from "./localStorage";

// Главная страницы
router.on('/', () => {
  autorizationPage($root, router);
});

// Страница со списком счетов
router.on(PATH.accounts, () => {
  WorkApi.getAccounts(getData(localStorageName.token))
  .then((res) => {
    if (res.payload === null) {
      router.navigate('error/'); // Заменить на что-то другое
    } else {
      accountsPage($root, res.payload);
    }
  });
});

// Страница с детальным описанием счета
router.on(`${PATH.accounts}:id`, (params) => {
  const id = params.data.id;
  WorkApi.getAccount(id, getData(localStorageName.token))
  .then((res) => {
    if (res.payload === null) {
      router.navigate('error/'); // Заменить на что-то другое
    } else {
      viewAccountPage($root, res.payload);
    }
  });
});

// Страница с динамикой баланса
router.on(`${PATH.detail}:id`, (params) => {
  const id = params.data.id;
  WorkApi.getAccount(id, getData(localStorageName.token))
  .then((res) => {
    if (res.payload === null) {
      router.navigate('error/'); // Заменить на что-то другое
    } else {
      detailBalancePage($root, res.payload);
    }
  });
});

// Страница с валютами
router.on(PATH.currencies, () => {
  WorkApi.getCurrencyAccounts(getData(localStorageName.token))
  .then((res) => {
    WorkApi.getKnowCurrencies()
    .then((allCurrencies) => {
      currencyPage($root, res.payload, allCurrencies.payload);
    })
  })
});

// Страница с отображением банкоматов
router.on(PATH.banks, () => {
  WorkApi.getBanks()
  .then(res => {
    banksPage($root, res.payload);
  });
});

// Страница 404
router.on('error/', () => {
  const container = el('div.container');
  const error = el('h1.error', 'Ошибка 404!');
  const reload = el('button.btn-reset.btn-outline', 'Вернуться на страницу авторизации');

  reload.addEventListener('click', () => {
    router.navigate('/');
  });
  setChildren(container, [error, reload]);
  setChildren($root, container);
});

router.resolve();
