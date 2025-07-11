import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { Analytics } from './components/Analytics';
import { useExpenses } from './hooks/useExpenses';
import { Expense } from './types/expense';

function App() {
  const { expenses, addExpense, deleteExpense, updateExpense } = useExpenses();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add' | 'expenses' | 'analytics'>('dashboard');
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setActiveTab('add');
  };

  const handleSubmitExpense = (expenseData: Omit<Expense, 'id'>) => {
    if (selectedExpense) {
      updateExpense(selectedExpense.id, expenseData);
      setSelectedExpense(null);
    } else {
      addExpense(expenseData);
    }
    setActiveTab('dashboard');
  };

  const handleCancelEdit = () => {
    setSelectedExpense(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard expenses={expenses} />}
        {activeTab === 'add' && (
          <ExpenseForm 
            onSubmit={handleSubmitExpense}
            onCancel={handleCancelEdit}
            initialData={selectedExpense}
          />
        )}
        {activeTab === 'expenses' && (
          <ExpenseList 
            expenses={expenses} 
            onEdit={handleEditExpense}
            onDelete={deleteExpense}
          />
        )}
        {activeTab === 'analytics' && <Analytics expenses={expenses} />}
      </main>
    </div>
  );
}

export default App;