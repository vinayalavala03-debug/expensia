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

  const [dashboardData, setDashboardData] = useState(null)

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
      {dashboardData && (
        <>
          {/* Overall Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard
              icon={<IoMdCard />}
              label="Total Balance"
              value={addThousandSeparator(dashboardData.totalBalance || 0)}
              color="bg-primary"
            />

            <InfoCard
              icon={<LuWalletMinimal />}
              label="Total Income"
              value={addThousandSeparator(dashboardData.totalIncome || 0)}
              color="bg-orange-500"
            />

            <InfoCard
              icon={<LuHandCoins />}
              label="Total Expense"
              value={addThousandSeparator(dashboardData.totalExpense || 0)}
              color="bg-red-500"
            />
          </div>

          {/* Current Month Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <InfoCard
              icon={<MdCalendarMonth />}
              label={`${monthName} Balance`}
              value={addThousandSeparator(dashboardData.currentMonth?.balance || 0)}
              color="bg-green-600"
            />

            <InfoCard
              icon={<MdCalendarMonth />}
              label={`${monthName} Income`}
              value={addThousandSeparator(dashboardData.currentMonth?.income || 0)}
              color="bg-blue-500"
            />

            <InfoCard
              icon={<MdCalendarMonth />}
              label={`${monthName} Expense`}
              value={addThousandSeparator(dashboardData.currentMonth?.expense || 0)}
              color="bg-purple-500"
            />
          </div>

          {/* Dashboard Widgets */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <RecentTransactions
              transactions={dashboardData.recentTransactions || []}
              onSeeMore={() => navigate('/expense')}
            />

            <FinanceOverview
              totalBalance={dashboardData.totalBalance || 0}
              totalIncome={dashboardData.totalIncome || 0}
              totalExpense={dashboardData.totalExpense || 0}
            />

            <ExpenseTransactions
              transactions={dashboardData.last30DaysExpenses?.transactions || []}
              onSeeMore={() => navigate('/expense')}
            />

            <Last30DaysExpenses
              data={dashboardData.last30DaysExpenses?.transactions || []}
            />

            <RecentIncomeWithChart
              data={dashboardData.last60DaysIncome?.transactions?.slice(0, 4) || []}
              totalIncome={dashboardData.totalIncome || 0}
            />

            <RecentIncome
              transactions={dashboardData.last60DaysIncome?.transactions || []}
              onSeeMore={() => navigate('/income')}
            />
          </div>
        </>
      )}
    </div>
  </DashboardLayout>
)

}

export default Home
