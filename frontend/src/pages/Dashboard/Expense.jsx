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

  const [groupedExpenses, setGroupedExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null })
  const [OpenAddExpenseModal, setOpenAddExpenseModal] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // ✅ Fetch grouped expenses
  const fetchExpenseDetails = async (page = 1, date = null) => {
    if (loading) return
    setLoading(true)

    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE, {
        params: { page, date }
      })

      if (response?.data?.data) {  
        setGroupedExpenses(response.data.data)
        setTotalPages(response.data.totalPages)
        setCurrentPage(response.data.currentPage)
      }
    } catch (error) {
      console.error("Failed to fetch expense data:", error)
      toast.error('Failed to fetch expense data')
    } finally {
      setLoading(false)
    }
  }

useEffect(() => {
  fetchExpenseDetails(); // ✅ no need to pass today's date manually anymore
}, []);



  // ✅ Add expense
  const handleAddExpense = async (expense) => {
    const {category, amount, date, icon, description} = expense;

    if (!category.trim()) return toast.error('Category is required')
    if (!amount || isNaN(amount) || Number(amount) <= 0) return toast.error('Amount must be a positive number')
    if (!date) return toast.error('Date is required')

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category, amount, date, icon, description
      })

      setOpenAddExpenseModal(false)
      toast.success('Expense added successfully')
      fetchExpenseDetails(currentPage) // refresh
    } catch (error) {
      console.error("Failed to add expense:", error.response?.data?.message || error.message)  
      toast.error('Failed to add expense')
    }
  }

  // ✅ Delete expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id))
      setOpenDeleteAlert({show:false,data:null})
      toast.success('Expense deleted successfully')
      fetchExpenseDetails(currentPage)
    } catch (error) {
      console.error("Failed to delete Expense:", error.response?.data?.message || error.message)  
      toast.error('Failed to delete Expense')
    }
  }

  // ✅ Download Excel
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'Expense_Details.xlsx')
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to download expense details:", error.response?.data?.message || error.message)  
      toast.error('Failed to download expense details')
    }
  }

  useEffect(() => {
    fetchExpenseDetails()
  },[]) 

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className='grid grid-cols-1 gap-6'>
          <div>
            <ExpenseOverview
              transactions={groupedExpenses?.flatMap(g => g.expenses) || []}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
            groupedExpenses={groupedExpenses}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => fetchExpenseDetails(page)}
            onDatePick={(date) => fetchExpenseDetails(1, date)}
            onDelete={(id) => setOpenDeleteAlert({ show:true, data:id })}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>

        {/* Add Expense Modal */}
        <Modal
          isOpen={OpenAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        {/* Delete Modal */}
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({show:false,data:null})}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this Expense?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default Expense
