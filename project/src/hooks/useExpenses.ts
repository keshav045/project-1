import { useState, useEffect } from 'react';
import { Expense } from '../types/expense';

const STORAGE_KEY = 'finance-tracker-expenses';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const storedExpenses = localStorage.getItem(STORAGE_KEY);
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const updateExpense = (id: string, expenseData: Omit<Expense, 'id'>) => {
    setExpenses(prev => 
      prev.map(expense => 
        expense.id === id ? { ...expenseData, id } : expense
      )
    );
  };

  return {
    expenses,
    addExpense,
    deleteExpense,
    updateExpense,
  };
};