export class WorkApi {
  // Класс представляет собой работу с API сервера
  constructor() {};

  static async autorization(login, password) {
    return await fetch('http://localhost:3000/login/', {
      method: 'POST',
      body: JSON.stringify({
        login,
        password
      }),
      headers: {'Content-Type': 'application/json'}
    }).then((res) => res.json());
  }

  static async getAccounts(token) {
    return await fetch('http://localhost:3000/accounts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + token,
      },
    }).then((res) => res.json());
  }

  static async getAccount(id, token) {
    return await fetch(`http://localhost:3000/account/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + token,
      },
    }).then((res) => res.json());
  }

  static async createAccount(token) {
    return await fetch('http://localhost:3000/create-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + token,
      },
    }).then((res) => res.json());
  }

  static async transferFunds(from, to, amount, token) {
    return await fetch('http://localhost:3000/transfer-funds', {
      method: 'POST',
      body: JSON.stringify({
        from,
        to,
        amount,
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + token,
      },
    }).then((res) => res.json());
  }

  static async getCurrencyAccounts(token) {
    return await fetch('http://localhost:3000/currencies', {
      methos: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + token,
      },
    }).then((res) => res.json());
  }

  static async exchangeCurrency(from, to, amount, token) {
    return await fetch('http://localhost:3000/currency-buy', {
      method: 'POST',
      body: JSON.stringify({
        from,
        to,
        amount
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + token,
      }
    }).then((res) => res.json());
  }

  static async getKnowCurrencies() {
    return await fetch('http://localhost:3000/all-currencies').then((res) => res.json());
  }

  static async getChangedCurrency() {
    return new WebSocket('ws://localhost:3000/currency-feed');
  }

  static async getBanks() {
    return await fetch('http://localhost:3000/banks').then((res) => res.json());
  }
}
