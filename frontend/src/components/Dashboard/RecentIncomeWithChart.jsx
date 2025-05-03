import React, { useEffect, useState } from 'react'
import CustomPieChart from '../Charts/CustomPieChart';

const COLORS = ['#875CF5','#FA2C37','#FF6900','#4F39F6'];

const RecentIncomeWithChart = ({data,totalIncome}) => {

    const [ChartData, setChartData] = useState([]);

    const prepareChartData = () => {
        const dataArr = data.map((item) => ({
            name: item?.source,
            amount: item?.amount,
        }))

        setChartData(dataArr);
    }

    useEffect(() => {
        prepareChartData();
        return()=>{}
    },[data])

  return (
    <div className='card'>
        <div className='flex flex-col items-center justify-between'>
            <div className='text-lg font-semibold'>
                <h5 className='text-lg'>Last 60 Days Income</h5>
            </div>

            <CustomPieChart
            data ={ChartData}
            label ="Total Income"
            totalIncome={`₹ ${totalIncome}`}
            showTextAnchor
            colors={COLORS}
            />
        </div>
    </div>
  )
}

export default RecentIncomeWithChart