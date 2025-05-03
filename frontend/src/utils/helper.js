import moment from "moment";

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  export const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '';
  
    const names = name.trim().split(/\s+/).filter(Boolean);
  
    if (names.length === 0) return '';
    if (names.length === 1) return names[0][0].toUpperCase();
  
    return names[0][0].toUpperCase() + names[1][0].toUpperCase();
  };
  

export const addThousandSeparator = (num) => {
    if (typeof num !== 'number' || isNaN(num)|| num === null) {
      return num;
    } 
    const [integerPart, fractionalPart] = num.toString().split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return fractionalPart ? `${formattedInteger}.${fractionalPart}` : formattedInteger;
  }

export const prepareExpenseBarChartData= (data=[])=>{
  const charData = data.map((item)=>({
    category:item?.category,
    amount:item?.amount,
    date: moment(item?.date).format('DD MMM YYYY'),

  }))
  return charData
}


export const prepareIncomeBarChartData = (data = []) => {
  const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date))

  const chartData = sortedData.map((item) => {
    const isValidDate = moment(item?.date).isValid()
    return {
      month: isValidDate ? moment(item?.date).format('MMM YYYY') : 'Invalid Date',
      amount: item?.amount,
      source: item?.source,
      date: moment(item?.date).format('DD MMM YYYY'),

    }
  })

  return chartData
}


export const prepareExpenseLineChartData = (data = []) => {
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date))

  const chartData = sortedData.map((item) => ({

      month: moment(item?.date).format('Do MMM') ,
      amount: item?.amount,
      category: item?.category,
      date: moment(item?.date).format('DD MMM YYYY'),

  }))

  return chartData
}