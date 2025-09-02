import React, {  useEffect, useState } from 'react'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import IncomeOverview from '../../components/Income/IncomeOverview'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import Modal from '../../components/Modal'
import { toast } from 'react-hot-toast'
import { useUserAuth } from '../../hooks/useUserAuth'
import AddIncomeForm from '../../components/Income/AddIncomeForm'
import IncomeList from '../../components/Income/IncomeList'
import DeleteAlert from '../../components/DeleteAlert'

const Income = () => {
useUserAuth()
  const [incomeData, setIncomeData] = useState([])
  const [loading, setLoading] = useState(false)
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  })

  const [OpenAddIncomeModal, setOpenAddIncomeModal] = useState(false)

  // Fetch income details
  const fetchIncomeDetails = async () => {
    if (loading) return

    setLoading(true)
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME)
      if (response?.data?.data) {  // Ensure that `data` exists and is an array
        setIncomeData(response.data.data)  // Using the correct `data` array
      }
    } catch (error) {
      console.error("Failed to fetch income data:", error)
    } finally {
      setLoading(false)
    }
  }


  const handleAddIncome = async (income) => {
    const {source,amount, date,icon, description}  = income;

    if(!source.trim()){
      toast.error('source is required')
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
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME,{
        source,
        amount,
        date,
        icon,
        description
      })
      setOpenAddIncomeModal(false)  // Close the modal after adding income
      toast.success('Income added successfully')
      fetchIncomeDetails()  // Refresh the income details
    } catch (error) {
      console.error("Failed to add income:", error.response?.data?.message || error.message)  
      toast.error('Failed to add income')
    }
  }

  const deleteIncome = async (id) => {
    try{
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      setOpenDeleteAlert({show:false,data:null})
      toast.success('Income deleted successfully')
      fetchIncomeDetails()  // Refresh the income details
    }
    catch(error){
      console.error("Failed to delete income:", error.response?.data?.message || error.message)  
      toast.error('Failed to delete income')
    }
  }

  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME, {
        responseType: 'blob',  // Important for downloading files
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'income_details.xlsx')  // Set the file name
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.error("Failed to download income details:", error.response?.data?.message || error.message)  
      toast.error('Failed to download income details')
    }
  }
  
  useEffect(() => {
    fetchIncomeDetails() 
 // Fetch income details on mount
  }, [])  // Only run once when the component mounts

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <IncomeOverview
              transactions={incomeData}  // Pass the income data to the IncomeOverview component
              onAddIncome={() => setOpenAddIncomeModal(true)}  // Handle the modal state
            />
          </div>

          <IncomeList
          transactions={incomeData}
          onDelete={(id)=>{
            setOpenDeleteAlert({show:true,data:id})
          }}
          onDownload={handleDownloadIncomeDetails}
          />
        </div>

        <Modal
        isOpen={OpenAddIncomeModal}
        onClose={() => setOpenAddIncomeModal(false)}
        title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome}/>
        </Modal>

        <Modal
        isOpen={openDeleteAlert.show}
        onClose={() => setOpenDeleteAlert({show:false,data:null})}
        title="Delete Income"
        >
          <DeleteAlert
          content ={`Are you sure you want to delete this income?`}
          onDelete={() => {
            deleteIncome(openDeleteAlert.data)
          }}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default Income
