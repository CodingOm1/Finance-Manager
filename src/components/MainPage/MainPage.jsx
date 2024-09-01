import React, { useState, useEffect } from 'react';
import FinanceChart from '../Chart/FinanceChart';
import { FaPlus } from 'react-icons/fa';
import { db } from '../../utils/firebase'; // Import Firestore
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import './MainPage.scss';

const MainPage = () => {
  const [financeData, setFinanceData] = useState({
    netWorth: 0,
    income: 0,
    expenses: 0,
    transactions: [],
    budgets: [],
    goals: [],
  });

  const [newTransaction, setNewTransaction] = useState({ date: '', description: '', amount: '' });
  const [newIncome, setNewIncome] = useState('');
  const [newExpense, setNewExpense] = useState('');
  const [newBudget, setNewBudget] = useState({ category: '', amount: '' });
  const [newGoal, setNewGoal] = useState({ name: '', current: '', target: '' });

  const fetchData = async () => {
    try {
      const financeRef = collection(db, 'financeData');
      const snapshot = await getDocs(financeRef);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0];
      setFinanceData(data || {
        netWorth: 0,
        income: 0,
        expenses: 0,
        transactions: [],
        budgets: [],
        goals: [],
      });
    } catch (error) {
      console.error("Error fetching finance data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFinanceData(prevData => ({
      ...prevData,
      netWorth: prevData.income - prevData.expenses
    }));
  }, [financeData.income, financeData.expenses]);

  const handleAddIncome = async () => {
    const updatedIncome = financeData.income + parseFloat(newIncome || 0);
    const updatedData = { ...financeData, income: updatedIncome };
    await updateFirestore(updatedData);
    setFinanceData(updatedData);
    setNewIncome('');
  };

  const handleAddExpense = async () => {
    const updatedExpenses = financeData.expenses + parseFloat(newExpense || 0);
    const updatedData = { ...financeData, expenses: updatedExpenses };
    await updateFirestore(updatedData);
    setFinanceData(updatedData);
    setNewExpense('');
  };

  const handleAddTransaction = async () => {
    const amount = parseFloat(newTransaction.amount || 0);
    const updatedData = {
      ...financeData,
      transactions: [...financeData.transactions, { ...newTransaction, amount }],
      expenses: financeData.expenses + (amount < 0 ? Math.abs(amount) : 0),
      income: financeData.income + (amount > 0 ? amount : 0),
    };
    await updateFirestore(updatedData);
    setFinanceData(updatedData);
    setNewTransaction({ date: '', description: '', amount: '' });
  };

  const handleAddBudget = async () => {
    const updatedData = {
      ...financeData,
      budgets: [...financeData.budgets, { ...newBudget, amount: parseFloat(newBudget.amount || 0) }]
    };
    await updateFirestore(updatedData);
    setFinanceData(updatedData);
    setNewBudget({ category: '', amount: '' });
  };

  const handleAddGoal = async () => {
    const updatedData = {
      ...financeData,
      goals: [...financeData.goals, {
        name: newGoal.name,
        current: parseFloat(newGoal.current || 0),
        target: parseFloat(newGoal.target || 0)
      }]
    };
    await updateFirestore(updatedData);
    setFinanceData(updatedData);
    setNewGoal({ name: '', current: '', target: '' });
  };

  const updateFirestore = async (data) => {
    try {
      const financeRef = doc(db, 'financeData', 'uPTatr0kZpe9MhTpVgKCccOqMYj1'); // 'user1' is an example, use the actual document ID
      await updateDoc(financeRef, data);
    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
  };

  return (
    <div className="main-page">
      <div className="flex">
        {/* Header Section */}
        <div className="main-page__header">
          <h1>Personal Finance Manager</h1>
          <div className="main-page__summary">
            <div className="summary__item">
              <h2>Net Worth</h2>
              <p>${financeData.netWorth.toFixed(2)}</p>
            </div>
            <div className="summary__item">
              <h2>Income</h2>
              <p>${financeData.income.toFixed(2)}</p>
              <input 
                type="number" 
                value={newIncome} 
                onChange={(e) => setNewIncome(e.target.value)} 
                placeholder="Add Income" 
              />
              <button onClick={handleAddIncome}><FaPlus /> Add Income</button>
            </div>
            <div className="summary__item">
              <h2>Expenses</h2>
              <p>${financeData.expenses.toFixed(2)}</p>
              <input 
                type="number" 
                value={newExpense} 
                onChange={(e) => setNewExpense(e.target.value)} 
                placeholder="Add Expense" 
              />
              <button onClick={handleAddExpense}><FaPlus /> Add Expense</button>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="main-page__chart">
          <FinanceChart data={financeData} />
        </div>
      </div>

      {/* Budget Section */}
      <div className="main-page__budget">
        <h2>Budget Overview</h2>
        <div className="budget__categories">
          {financeData.budgets.length ? (
            financeData.budgets.map((budget, index) => (
              <div className="category" key={index}>
                <span>{budget.category}</span>
                <span>${budget.amount.toFixed(2)}</span>
              </div>
            ))
          ) : (
            <p>No budgets set.</p>
          )}
        </div>
        <div className="add-budget">
          <h3>Add Budget</h3>
          <input 
            type="text" 
            value={newBudget.category} 
            onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })} 
            placeholder="Category" 
          />
          <input 
            type="number" 
            value={newBudget.amount} 
            onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })} 
            placeholder="Amount" 
          />
          <button onClick={handleAddBudget}><FaPlus /> Add Budget</button>
        </div>
      </div>

      {/* Goals Section */}
      <div className="main-page__goals">
        <h2>Financial Goals</h2>
        {financeData.goals.length ? (
          financeData.goals.map((goal, index) => (
            <div className="goal" key={index}>
              <span>{goal.name}</span>
              <div className="goal__progress">
                <div className="goal__progress-bar" style={{ width: `${(goal.current / goal.target) * 100}%` }}></div>
              </div>
              <span>${goal.current.toFixed(2)} of ${goal.target.toFixed(2)}</span>
            </div>
          ))
        ) : (
          <p>No financial goals set.</p>
        )}
        <div className="add-goal">
          <h3>Add Goal</h3>
          <input 
            type="text" 
            value={newGoal.name} 
            onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })} 
            placeholder="Goal Name" 
          />
          <input 
            type="number" 
            value={newGoal.current} 
            onChange={(e) => setNewGoal({ ...newGoal, current: e.target.value })} 
            placeholder="Current Amount" 
          />
          <input 
            type="number" 
            value={newGoal.target} 
            onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })} 
            placeholder="Target Amount" 
          />
          <button onClick={handleAddGoal}><FaPlus /> Add Goal</button>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="main-page__transactions">
        <h2>Recent Transactions</h2>
        <table className="transactions__table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {financeData.transactions.length ? (
              financeData.transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.date}</td>
                  <td>{transaction.description}</td>
                  <td>${transaction.amount.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No transactions available.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="add-transaction">
          <h3>Add Transaction</h3>
          <input 
            type="date" 
            value={newTransaction.date} 
            onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })} 
          />
          <input 
            type="text" 
            value={newTransaction.description} 
            onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })} 
            placeholder="Description" 
          />
          <input 
            type="number" 
            value={newTransaction.amount} 
            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })} 
            placeholder="Amount" 
          />
          <button onClick={handleAddTransaction}><FaPlus /> Add Transaction</button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
