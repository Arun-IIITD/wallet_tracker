import React, { useState, useEffect } from "react";
import "./App.css"

function App() {
  const categories = ["Food", "Entertainment", "Travel"];
  const [walletbalance, setwalletbalance] = useState(5000);
  const [expenses, setexpenses] = useState(0);
  const [transactions, setTransaction] = useState([]);
  const [showIncomeModal, setshowincomemodal] = useState(false);
  const [showexpensemodal, setshowexpensemodal] = useState(false);
  const [incomeAmount, setIncomeAmount] = useState("");
  const [expenseform, setexpenseform] = useState({
    title: "",
    price: "",
    category: "Food",
    date: "",
  });

    //FETCH FROM LOCAL STORAGE
   useEffect(() => {
  const wallet_balance = localStorage.getItem("walletbalance")
  const wallet_expenses = localStorage.getItem("expenses")

  if (wallet_balance){
    setwalletbalance(Number(wallet_balance))
  }

  if (wallet_expenses){
   // setexpenses(Number(wallet_expenses))
    const parsed = JSON.parse(wallet_expenses);
    setTransaction(parsed);
    setexpenses(parsed.reduce((sum, t) => sum + Number(t.price), 0)); 

  }

  const wallet_transactions = localStorage.getItem("transactions");
  if (wallet_transactions){
    setTransaction(JSON.parse(wallet_transactions))
  }
   }, []);



  //ADD TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("walletbalance", Number(walletbalance))
    localStorage.setItem("expenses", JSON.stringify(transactions))
      localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [walletbalance, expenses, transactions])

  //ADD BALANCE OR INCOME
  const handleaddincome = (e) => {
    e.preventDefault();
    if(!incomeAmount) return;

    // setwalletbalance(Number(walletbalance) + Number(incomeAmount));
    // setIncomeAmount("");
    // const newWallet = walletbalance + Number(incomeAmount);
    // localStorage.setItem("walletbalance", Number(newWallet));
    // setshowincomemodal(false);

    const updatedWallet = Number(walletbalance) + Number(incomeAmount);
    setwalletbalance(updatedWallet);
    setIncomeAmount("");
    localStorage.setItem("walletbalance", updatedWallet);
    setshowincomemodal(false);

}

//ADD EXPENSES
const handleaddexpense = (e) => {
  e.preventDefault();

  const {title, price, category, date} = expenseform;
  if (!title || !price || !category || !date){
    return ;
  }

  const newexpense = {
   id: Date.now(),
   title,
   price: Number(price),
   category,
   date,
  };

  // setTransaction([...transactions,newexpense]);
  // setexpenses(expenses +Number(price))
  // setwalletbalance(walletbalance - Number(price))
  // //setexpenseform("");
  // setexpenseform({ title: "", price: "", category: "Food", date: "" });
  // setshowexpensemodal(false)
   const updatedTransactions = [...transactions, newexpense];
    setTransaction(updatedTransactions);

    const newExpensesTotal = expenses + Number(price);
    setexpenses(newExpensesTotal);
    const newWallet = walletbalance - Number(price);
    setwalletbalance(newWallet);
    setexpenseform({ title: "", price: "", category: "Food", date: "" });
    setshowexpensemodal(false);
    // localStorage.setItem("expenses", JSON.stringify(updatedTransactions));
    // localStorage.setItem("walletbalance", Number(newWallet));







}









  return (
    <div className="App">
      <h1>Expense Tracker</h1>

      <div className="cards">
          <div className="card">
            <h2>Wallet Balance:  <span style={{ color: "limegreen" }}>₹{walletbalance}</span> </h2>
            <button onClick={()=> setshowincomemodal(true)} style = {{backgroundColor: "limegreen"}}> + Add Income</button>
          </div>


          <div className="card">
            <h2>Expenses: <span style={{ color: "orange" }}>₹{expenses}</span> </h2>
            <button onClick={() => setshowexpensemodal(true)} style = {{backgroundColor: "orange"}}> + Add Expense</button>
          </div>

      </div>

        {/* ADD BALANCE POP UP */}
       {showIncomeModal && (
      <div className="modal">
     
      <h2>ADD BALANCE</h2>
      <form onSubmit={handleaddincome}>
        <input
        type="number"
        placeholder="Income Amount"
        value={incomeAmount}
        onChange= {(e) => setIncomeAmount(e.target.value)}
        />

        <button type="submit">Add Balance</button>
        <button type="button" onClick={()=> setshowincomemodal(false)}>Cancel</button>

      </form>
      </div>
       )}

       {/* EXPENSE POP UP */}
       {showexpensemodal && 
       <div className="modal">
          <h2>ADD EXPENSES</h2>
        <form onSubmit={handleaddexpense}>
          {/* FOR TITLE */}
          <input
          name="title"
          placeholder="TITLE"
          value={expenseform.title}
          onChange={(e) => setexpenseform({...expenseform,title: e.target.value})}
          />
           {/* FOR PRICE */}
          <input
          name="price"
          type="number"
          placeholder="price"
          value={expenseform.price}
           onChange={(e) => setexpenseform({ ...expenseform, price: e.target.value })}
          />
          
           {/* FOR CATEGORIES */}
          <select
          name="category"
          value={expenseform.category}
           onChange={(e) => setexpenseform({ ...expenseform, category: e.target.value })}
          >
            {categories.map((cat,index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}

        </select>

         {/* FOR DATE */}
         <input
         name="date"
         type ="date"
         value={expenseform.date}
          onChange={(e) => setexpenseform({ ...expenseform, date: e.target.value })}
          
         />

        
        <button type="submit">Add Expense</button>
        <button onClick={() => setshowexpensemodal(false)}>Cancel</button>


        </form>
       </div>
      }

       {/* RECENT TRANSACTIONS*/}
       <div className="transactions">
        <h2>Transactions</h2>
        {transactions.length === 0 ? (
          <p>No transactions yet</p>
        ):(
          <ul>
            {transactions.map((t) => (
              <li key ={t.id}>
                <strong>{t.title}</strong> -  ₹{t.price} ({t.category}) on {t.date}
                
              </li>
            ))}
          </ul>
        )}


       </div>







    </div>
  );
}

export default App;
