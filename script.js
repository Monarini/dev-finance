var Modal = {
  open() {
    // Abrir modal
    // Adicionar a class active no modal
    const modalOpen = document.querySelector('.modal-overlay')
    modalOpen.classList.add("active")
  },
  close() {
    //Fechar modal
    // remover a class active do modal
    const modalClose = document.querySelector('.modal-overlay')
    modalClose.classList.remove('active')
  }
}
const transactions = [
  {
    description: 'Luz',
    amount: -50000,
    date: '23/01/2022'
  },
  {
    description: 'Website',
    amount: 500000,
    date: '23/01/2022'
  },
  {
    description: 'Internet',
    amount: -20000,
    date: '23/01/2022'
  },
  {
    description: 'App',
    amount: 200000,
    date: '23/01/2022'
  },
]
const Storage = {
  get(){
    return JSON.parse(localStorage.getItem("dev.finances: transactions")) || []
  },
  set(transactions){
    localStorage.setItem("dev.finances: transactions", JSON.stringify(transactions))
  }
}
const Transaction = {
  all: Storage.get(),
  add(transaction){
    Transaction.all.push(transaction)
    App.reload()
  },

  remove(index){
    Transaction.all.splice(index, 1)

    App.reload()
  },

  incomes(){
    let income = 0;
    //pegar todas as transações
    //para cada transação,
    Transaction.all.forEach(transaction => {
       //se ela for maior que zero
      if(transaction.amount > 0){
        //somar a uma variavel e retornar a variavel
        income += transaction.amount
      }
    })
    return income;
  },

  expenses(){
    let expense = 0;
    //pegar todas as transações
    //para cada transação,
    Transaction.all.forEach(transaction => {
       //se ela for menor que zero
      if(transaction.amount < 0){
        //somar a uma variavel e retornar a variavel
        expense += transaction.amount
      }
    })
    return expense;
  },

  total(){
    // entradas - saidas
    return Transaction.incomes() + Transaction.expenses()
  }
}

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),
  addTransaction(transaction, index){
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index
    
    DOM.transactionsContainer.appendChild(tr)
  },

  innerHTMLTransaction(transaction, index){
    const CSSClass = transaction.amount > 0 ? "income" : "expense"

    const amount = Utils.formartCurrency(transaction.amount)

    const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSClass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td><img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transações"></td>
    `
    return html
  },

  uptadeBalance(){
    document
      .getElementById('incomeDisplay')
      .innerHTML = Utils.formartCurrency(Transaction.incomes()) 
    document
      .getElementById('expenseDisplay')
      .innerHTML = Utils.formartCurrency(Transaction.expenses())
    document
      .getElementById('totalDisplay')
      .innerHTML = Utils.formartCurrency(Transaction.total())
    
  },
  clearTransaction(){
    DOM.transactionsContainer.innerHTML=""
  }
}

const Utils = {
  formatDate(date){
    const splittedDate = date.split("-")
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  
  },

  formatAmount(value){
    value = Number(value) * 100
    return Math.round(value)
  },

  formartCurrency(value){
    const signal = Number(value) < 0 ? "-" : ""

    value = String(value).replace(/\D/g,"") // faz o tramento do dado e deixa somente numeros

    value = Number(value) / 100

    value = value.toLocaleString('pt-br', {
      style: "currency",
      currency: "BRL"
    })


    return signal + value
  }
}

const Form ={
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues(){
    return{
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    }
  },

  formatValues(){
    let {description, amount, date} = Form.getValues()

    amount = Utils.formatAmount(amount)

    date = Utils.formatDate(date)

    return{
      description,
      amount,
      date
    }
  },
  validateFields(){

    const {description, amount, date} = Form.getValues()
    
    if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
      throw new Error("Por favor, preencha todos os campos")
    }
  },
  clearFields(){
    Form.description.value = ''
    Form.amount.value = ''
    Form.date.value = ''
  },

  submit(event){
    event.preventDefault()
    try{
      //verificar se todos as informações fomra preenchidas
      Form.validateFields()
      //formatar os dados para salvar
      const transaction = Form.formatValues()
      //salvar
      Transaction.add(transaction)
      // apagar os dados do formulario
      Form.clearFields()
      //modal fechar
      Modal.close()
    } catch(error){
      alert(error.message)
    }
    
  }
}

const App = {
  init(){
    Transaction.all.forEach((transaction, index) => {
      DOM.addTransaction(transaction, index)
    })
    DOM.uptadeBalance();

    Storage.set(Transaction.all)
  },
  reload(){
    DOM.clearTransaction()
    App.init();
  }
}

Storage.get()
App.init()

