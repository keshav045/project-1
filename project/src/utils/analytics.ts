import { Expense } from '../types/expense';

export const getMonthlySpending = (expenses: Expense[]): number => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);
};

export const getWeeklySpending = (expenses: Expense[]): number => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  return expenses
    .filter(expense => new Date(expense.date) >= oneWeekAgo)
    .reduce((sum, expense) => sum + expense.amount, 0);
};

export const getCategoryTotals = (expenses: Expense[]): Record<string, number> => {
  return expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
};

export const getSpendingTrends = (expenses: Expense[]): { trend: 'up' | 'down' | 'stable'; percentage: number } => {
  const currentMonth = getMonthlySpending(expenses);
  const lastMonth = getLastMonthSpending(expenses);
  
  if (lastMonth === 0) return { trend: 'stable', percentage: 0 };
  
  const percentage = ((currentMonth - lastMonth) / lastMonth) * 100;
  
  if (percentage > 5) return { trend: 'up', percentage };
  if (percentage < -5) return { trend: 'down', percentage: Math.abs(percentage) };
  return { trend: 'stable', percentage: Math.abs(percentage) };
};

export const getLastMonthSpending = (expenses: Expense[]): number => {
  const lastMonth = new Date().getMonth() - 1;
  const currentYear = new Date().getFullYear();
  
  return expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === currentYear;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);
};

export const getMonthlyBreakdown = (expenses: Expense[]): Record<string, number> => {
  return expenses.reduce((acc, expense) => {
    const monthYear = expense.date.substring(0, 7); // YYYY-MM
    acc[monthYear] = (acc[monthYear] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
};

export const getDailyAverage = (expenses: Expense[]): number => {
  if (expenses.length === 0) return 0;
  
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const oldestExpense = expenses[expenses.length - 1];
  const daysSinceOldest = Math.max(1, Math.ceil((Date.now() - new Date(oldestExpense.date).getTime()) / (1000 * 60 * 60 * 24)));
  
  return total / daysSinceOldest;
};