import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { Expense } from '../types/expense';
import { formatCurrency } from '../utils/formatters';
import { 
  getMonthlySpending, 
  getWeeklySpending, 
  getCategoryTotals, 
  getSpendingTrends,
  getMonthlyBreakdown 
} from '../utils/analytics';

interface AnalyticsProps {
  expenses: Expense[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ expenses }) => {
  const monthlySpending = getMonthlySpending(expenses);
  const weeklySpending = getWeeklySpending(expenses);
  const categoryTotals = getCategoryTotals(expenses);
  const spendingTrends = getSpendingTrends(expenses);
  const monthlyBreakdown = getMonthlyBreakdown(expenses);

  const avgDailySpending = expenses.length > 0 ? 
    expenses.reduce((sum, expense) => sum + expense.amount, 0) / 
    Math.max(1, Math.ceil((Date.now() - new Date(expenses[expenses.length - 1]?.date || Date.now()).getTime()) / (1000 * 60 * 60 * 24))) : 0;

  const categoryData = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / (monthlySpending || 1)) * 100,
    }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Average</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthlySpending)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Weekly Average</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(weeklySpending)}</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Average</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgDailySpending)}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingDown className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
          <div className="space-y-4">
            {categoryData.map(({ category, amount, percentage }) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{category}</span>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(amount)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{percentage.toFixed(1)}% of monthly spending</span>
                </div>
              </div>
            ))}
            {categoryData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No spending data available.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <div className="space-y-4">
            {Object.entries(monthlyBreakdown)
              .sort(([a], [b]) => b.localeCompare(a))
              .slice(0, 6)
              .map(([month, amount]) => (
                <div key={month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{month}</p>
                    <p className="text-sm text-gray-600">
                      {expenses.filter(e => e.date.startsWith(month)).length} expenses
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(amount)}</p>
                  </div>
                </div>
              ))}
            {Object.keys(monthlyBreakdown).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No monthly data available.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Highest Category</h4>
            <p className="text-2xl font-bold text-blue-700">
              {categoryData[0]?.category || 'N/A'}
            </p>
            <p className="text-sm text-blue-600">
              {categoryData[0] ? formatCurrency(categoryData[0].amount) : 'No data'}
            </p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg">
            <h4 className="font-medium text-emerald-900 mb-2">Most Active Day</h4>
            <p className="text-2xl font-bold text-emerald-700">
              {expenses.length > 0 ? new Date(expenses[0].date).toLocaleDateString('en-US', { weekday: 'long' }) : 'N/A'}
            </p>
            <p className="text-sm text-emerald-600">
              Latest expense
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium text-orange-900 mb-2">Average per Expense</h4>
            <p className="text-2xl font-bold text-orange-700">
              {formatCurrency(expenses.length > 0 ? 
                expenses.reduce((sum, expense) => sum + expense.amount, 0) / expenses.length : 0)}
            </p>
            <p className="text-sm text-orange-600">
              Across all expenses
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};