import React, { useEffect, useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import CustomBarChart from '../Charts/CustomBarChart'
import { prepareIncomeBarChartData } from '../../utils/helper'

const IncomeOverview = ({ transactions, onAddIncome }) => {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    const result = prepareIncomeBarChartData(transactions)  // Prepare chart data from transactions
    setChartData(result)  // Set the chart data in state
  }, [transactions])  // Re-run effect when `transactions` change

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-lg">Income Overview</h5>
          <p className="text text-gray-400 mt-0.5">
            Track your incomes over time and analyze your income trends.
          </p>
        </div>

        <button className="add-btn" onClick={onAddIncome}>
          <LuPlus className="text-lg" />
          Add Income
        </button>
      </div>

      <div className="mt-10">
        <CustomBarChart data={chartData} />  
      </div>
    </div>
  )
}

export default IncomeOverview
