const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];


/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const calcDisplaySummary = function (account) {
  //filter the movements to the ones what are positive
  const filterMovementsIn = account.movements.filter(mov => {
    return mov > 0;
  });
  const SumAllFilterMovementsIn = filterMovementsIn.reduce(
    (acc, cur) => acc + cur,
    0
  );
  labelSumIn.textContent = `${SumAllFilterMovementsIn} €`;
  const filterMovementsOut = account.movements.filter(mov => mov < 0);
  const SumAllfilterMovementsOut = filterMovementsOut.reduce(
    (acc, cur) => acc + cur,
    0
  );
  labelSumOut.textContent = `${Math.abs(SumAllfilterMovementsOut)} €`;  
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (account.interestRate * 1.2) / 100)
    .filter((int,i,arr) =>{
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${Math.abs(interest)} €`;
};

const displayMovements = function (acc, sort = false) {

  containerMovements.innerHTML = '';


const movementsCopy = acc.movements.slice()

const movs = sort ? movementsCopy.sort((a,b) => a-b) : movementsCopy;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal'; //logic that gives the class to define the movement
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">
    ${i + 1} ${type}</div>
    <div class="movements__value">${mov}€
  </div> 
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html); //inserting the html
  });
  //this function is to iterate on the account movements
  //and show it on the balance part part
};

//make an user name like Steven Thomas Williams -> stw

const createUsernames = function (accs) {
  //loop over the array of objects
  accs.forEach(acc => {
    //create the username inside of each object called username
    //we separate make the string of the owener to an array then grab
    //the 1st letter of the each elements and finally we make it an string
    return (acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(e => e[0])
      .join(''));
  });
};
createUsernames(accounts)
//make an function to make a sum of all movements and show on the balance
const calcPrintBalance = function (acc) {
  const balance = acc.movements.reduce((acc, cur) => {
    return acc + cur;
  });
  acc.balance = balance;
  labelBalance.textContent = `${acc.balance} €`;
};

const updateUI = function(acc){
      //display movements
      displayMovements(acc)
      //display balance
      calcPrintBalance(acc)
      //displau summary
      calcDisplaySummary(acc)
}

//event handlers

let currentAccount;

btnLogin.addEventListener('click', function(e){
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if(currentAccount && currentAccount.pin === Number(inputLoginPin.value))
  {
    //displayUI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = ''
    inputLoginPin.blur()
    updateUI(currentAccount)
  }
  
});

btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const amountTransferName = inputTransferTo.value;
  const receiverAcc = accounts.find(acc => acc.username === amountTransferName);//founf the object of the user
  //Pass the amount to the other username 
  if(amount > 0 && currentAccount.balance >= amount && receiverAcc.username !== currentAccount.username){
    //transfer 
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);

    } else {
      alert('Insert a correct amount')
    }

});

btnClose.addEventListener('click', function(e){
  e.preventDefault()

  if(inputCloseUsername.value === currentAccount && Number(inputClosePin.value) === currentAccount.pin){
    const index = accounts.findIndex(acc => {
      acc.username === currentAccount.username
    });

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  };
});


btnLoan.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputLoanAmount);


  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
    currentAccount.movements.push(amount);
  };

  updateUI(currentAccount)
});

btnSort.addEventListener('click', function(e){
  e.preventDefault();
  displayMovements(currentAccount, true)
})




