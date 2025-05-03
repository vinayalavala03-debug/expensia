import React, { useState, useEffect } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import axiosInstance from '../../utils/axiosInstance' 
import toast from 'react-hot-toast'
import { API_PATHS } from '../../utils/apiPaths'
import ExpenseOverview from '../../components/Expense/ExpenseOverview'
import Modal from '../../components/Modal'
import AddExpenseForm from '../../components/Expense/AddExpenseForm'
import ExpenseList from '../../components/Expense/ExpenseList'
import DeleteAlert from '../../components/DeleteAlert'

const Expense = () => {
  useUserAuth()
  const [expenseData, setExpenseData] = useState([])
    const [loading, setLoading] = useState(false)
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
      show: false,
      data: null,
    })
  
    const [OpenAddExpenseModal, setOpenAddExpenseModal] = useState(false)

  const fetchExpenseDetails = async () => {
      if (loading) return
  
      setLoading(true)
      try {
        const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE)
        if (response?.data?.data) {  
          setExpenseData(response.data.data)  
        }
      } catch (error) {
        console.error("Failed to fetch expense data:", error)
      } finally {
        setLoading(false)
      }
    }
  
  
    const handleAddExpense = async (expense) => {
      const {category,amount, date,icon}  = expense;
  
      if(!category.trim()){
        toast.error('category is required')
        return
      }
      if(!amount||isNaN(amount)||Number(amount)<=0){
        toast.error('amount is should be a valid number and greater than 0')
        return
      }
      if(!date){
        toast.error('date is required')
        return
      }
      try {
        await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE,{
          category,
          amount,
          date,
          icon
        })
        setOpenAddExpenseModal(false)  // Close the modal after adding expense
        toast.success('Expense added successfully')
        fetchExpenseDetails()  // Refresh the expense details
      } catch (error) {
        console.error("Failed to add expense:", error.response?.data?.message || error.message)  
        toast.error('Failed to add expense')
      }
    }

    const deleteExpense = async (id) => {
      try{
        await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
        setOpenDeleteAlert({show:false,data:null})
        toast.success('Expense deleted successfully')
        fetchExpenseDetails()  // Refresh the Expense details
      }
      catch(error){
        console.error("Failed to delete Expense:", error.response?.data?.message || error.message)  
        toast.error('Failed to delete Expense')
      }
    }
  
    const handleDownloadExpenseDetails = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
          responseType: 'blob',  // Important for downloading files
        })
  
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'Expense_Details.xlsx')  // Set the file name
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)  // Clean up the link element
        window.URL.revokeObjectURL(url)  // Release the object URL
      } catch (error) {
        console.error("Failed to download expense details:", error.response?.data?.message || error.message)  
        toast.error('Failed to download expense details')
      }
    }

    useEffect(() => {
        fetchExpenseDetails()  // Fetch expense details on mount
    },[]) 
  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <ExpenseOverview
            transactions={expenseData}
            onExpenseIncome={()=>setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
          transactions={expenseData}
          onDelete={(id)=>{
            setOpenDeleteAlert({
              show:true,
              data:id
            })
          }}
          onDownload={handleDownloadExpenseDetails}
          />
        </div>

        <Modal
        isOpen={OpenAddExpenseModal}
        onClose={() => setOpenAddExpenseModal(false)}
        title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        <Modal
        isOpen={openDeleteAlert.show}
        onClose={() => setOpenDeleteAlert({show:false,data:null})}
        title="Delete Expense"
        >
          <DeleteAlert
          content ={`Are you sure you want to delete this Expense?`}
          onDelete={() => {
            deleteExpense(openDeleteAlert.data)
          }}
          />
        </Modal>


      </div>
    </DashboardLayout>
  )
}

export default Expense