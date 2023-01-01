// modulo externos
import inquirer from 'inquirer'
import chalk from 'chalk'


//modulos internos
import fs from 'fs'
import choices from 'inquirer/lib/objects/choices'



function operation() {
    inquirer.prompt([
        {
        type: 'list',
        name: 'action',
        message: 'O que deseja fazer?',
        // Criar um array com as escolhas
        choices: [ 'Criar conta',
        'Consultar Saldo',
        'Depositar',
        'Sacar',
        'Sair',
    
    ],       

},
]).then((ansewer) => {
    const action = ansewer['action']
if(action === 'Criar conta'){
    criarConta()

}else if (action === 'Depositar') {
deposit()


} else if(action === 'Consultar Saldo') {
getAccaountBalance()
}else if(action === 'Sacar') {
withdraw()
}else if(action === 'Sair') {
    console.log(chalk.bgBlue.black('Obrigado por escolher o nosso Banco'))
    process.exit()
}

    console.log(action)
})
.catch((err) => console.log(err))
}

operation()

//Criar uma conta
function criarConta() {
console.log(chalk.bgGreen.black('Agora você faz parte do LFBank!'))
console.log(chalk.green('Defina as opções da sua conta a seguir'))
buildAccount()
}

function buildAccount(){
//Saber qual o nome que vai dar para a conta dele
inquirer.prompt([
    {
       name: 'accountName',
       message: 'Digite um nome para sua conta' 
    }
]).then(ansewer => {
const accountName =  ansewer['accountName']   
console.info(accountName)
if(!fs.existsSync('accounts')) {
    fs.mkdirSync('accounts')
}

if(fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(chalk.bgRed.black('Esta conta ja existe, escolha outro nome!'),
)
buildAccount()
return
}
else{
    fs.writeFileSync(`accounts/${accountName}.json`,
     '{"balance": 0}',
      function (err){
        console.log(err)
    },
    )
}
console.log(chalk.green('Parabés, sua conta foi criada!'))
operation()
})
.catch(err => console.log(err))
}

// add an amount to user account
function deposit() {
inquirer.prompt([
 {
    name: 'accountName',
    message: 'Qual o nome da sua conta?'
 }   
])
.then((ansewer) => {

const accountName = ansewer['accountName'] 

//verificar se a conta existe
if(!checkAccount(accountName)) {
    return deposit()
}

inquirer.prompt([
    {
        name: 'amount',
    message: 'Qual valor do deposito?',
    },
])
.then((ansewer) => {
const amount = ansewer['amount']
addAmount(accountName, amount)

operation()

}).catch( err => console.log(err))


})
.catch(err => console.log(err))
}

function checkAccount(accountName) {
    if(!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Esta conta não existe, escolha outro nome!'))
        return false
    }

    return true
}

function addAmount(accountName, amount) {
const accountData = getAccount(accountName)

if (!amount) {
    console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
    return deposit()
}
accountData.balance = parseFloat(amount)  + parseFloat(accountData.balance)

fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),

    function(err) {
     console.log(err)
    },
)
console.log(chalk.green(`Foi depositado R$${amount} na sua conta`),
)

}

function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf-8',
        flag: 'r',
    })

    return JSON.parse(accountJSON)
}

//consultar saldo
function getAccaountBalance(){
  
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?',
        },

]).then((ansewer) => {
const accountName = ansewer['accountName']

//verificar se a conta existe

if(!checkAccount(accountName)) {
    return getAccaountBalance()
}

const accountData = getAccount(accountName)

console.log(chalk.bgBlue.black(`Seu saldo é de R$${accountData.balance}`,
),
)
operation()

}).catch(err => console.log(err))
}
// sacar valor da conta
function withdraw() {
inquirer.prompt([
    {
        name: 'accountName',
        message: 'Qual o nome da sua conta?',
    },
]).then((ansewer) => {
    const accountName = ansewer['accountName']
if(!checkAccount(accountName)) {

    return withdraw()
}

inquirer.prompt([
    {
        name: 'amount',
        message: 'Qual valor deseja sacar? ',
    },
])
.then((ansewer) => {
const amount = ansewer['amount']
    removeAmount(accountName, amount)
    


})
.catch((err) => console.log(err))

})
.catch((err) => console.log(err))
}

function removeAmount(accountName, amount){
    const accountData =  getAccount(accountName)
    if(!amount) {
      console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'),
      )  
      return withdraw()
    }
    if(accountData.balance < amount) {
        console.log(chalk.bgRed.black('Saldo indisponivel!'))
        return withdraw()
    }
accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

fs.writeFileSync(
    `accounts/${accountName}.Json`,
    JSON.stringify(accountData), 

    function (err) {
        console.log(err)
    },
)
console.log(chalk.green(`Foi realizado um saque de ${amount} da sua conta!`),
)
operation()
}