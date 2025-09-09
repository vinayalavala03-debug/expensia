import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import { useNavigate } from 'react-router-dom'
import { API_PATHS } from '../../utils/apiPaths'
import axiosInstance from '../../utils/axiosInstance'
import { LuWalletMinimal, LuHandCoins } from 'react-icons/lu'
import InfoCard from '../../components/Cards/InfoCard'
import { IoMdCard } from 'react-icons/io'
import { MdCalendarMonth } from 'react-icons/md'

import RecentTransactions from '../../components/Dashboard/RecentTransactions'
import FinanceOverview from '../../components/Dashboard/FinanceOverview'
import { addThousandSeparator } from '../../utils/helper'
import ExpenseTransactions from '../../components/Dashboard/ExpenseTransactions'
import Last30DaysExpenses from '../../components/Dashboard/Last30DaysExpenses'
import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart'
import RecentIncome from '../../components/Dashboard/RecentIncome'

const Home = () => {
  useUserAuth()
  const navigate = useNavigate()

  const [dashboardData, setDashboardData] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    currentMonth: {
      balance: 0,
      income: 0,
      expense: 0,
    },
    recentTransactions: [],
    last30DaysExpenses: { transactions: [] },
    last60DaysIncome: { transactions: [] },
  })

  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('overall') // overall | monthly

  // get current month name (e.g., September)
  const monthName = new Date().toLocaleString('default', { month: 'long' })

  useEffect(() => {
    let isMounted = true
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA)
        if (isMounted && response.data?.data) {
          setDashboardData(response.data.data) // unwrap data
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchDashboardData()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        {/* Toggle Buttons */}
        <div className="flex justify-center mb-2">
          <button
            onClick={() => setView('overall')}
            className={`px-4 py-2 ${
              view === 'overall'
                ? 'text-primary font-semibold border-b-2 border-primary'
                : 'text-gray-600'
            }`}
          >
            Overall 
          </button>
          <button
            onClick={() => setView('monthly')}
            className={`px-4 py-2 ml-4 ${
              view === 'monthly'
                ? 'text-primary font-semibold border-b-2 border-primary'
                : 'text-gray-600'
            }`}
          >
            Current Month
          </button>
        </div>

        {/* Info Cards */}
        {view === 'overall' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard
              icon={<IoMdCard />}
              label="Total Balance"
              value={addThousandSeparator(dashboardData.totalBalance)}
              color="bg-primary"
              loading={loading}
            />

            <InfoCard
              icon={<LuWalletMinimal />}
              label="Total Income"
              value={addThousandSeparator(dashboardData.totalIncome)}
              color="bg-orange-500"
              loading={loading}
            />

            <InfoCard
              icon={<LuHandCoins />}
              label="Total Expense"
              value={addThousandSeparator(dashboardData.totalExpense)}
              color="bg-red-500"
              loading={loading}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard
              icon={<MdCalendarMonth />}
              label={`${monthName} Balance`}
              value={addThousandSeparator(dashboardData.currentMonth.balance)}
              color="bg-green-600"
              loading={loading}
            />

            <InfoCard
              icon={<MdCalendarMonth />}
              label={`${monthName} Income`}
              value={addThousandSeparator(dashboardData.currentMonth.income)}
              color="bg-blue-500"
              loading={loading}
            />

            <InfoCard
              icon={<MdCalendarMonth />}
              label={`${monthName} Expense`}
              value={addThousandSeparator(dashboardData.currentMonth.expense)}
              color="bg-purple-500"
              loading={loading}
            />
          </div>
        )}

        {/* Dashboard Widgets */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <RecentTransactions
            transactions={dashboardData.recentTransactions}
            onSeeMore={() => navigate('/expense')}
            loading={loading}
          />

          <FinanceOverview
            totalBalance={dashboardData.totalBalance}
            totalIncome={dashboardData.totalIncome}
            totalExpense={dashboardData.totalExpense}
            loading={loading}
          />

          <ExpenseTransactions
            transactions={dashboardData.last30DaysExpenses.transactions}
            onSeeMore={() => navigate('/expense')}
            loading={loading}
          />

          <Last30DaysExpenses
            data={dashboardData.last30DaysExpenses.transactions}
            loading={loading}
          />

          <RecentIncomeWithChart
            data={dashboardData.last60DaysIncome.transactions.slice(0, 4)}
            totalIncome={dashboardData.totalIncome}
            loading={loading}
          />

          <RecentIncome
            transactions={dashboardData.last60DaysIncome.transactions}
            onSeeMore={() => navigate('/income')}
            loading={loading}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Home
