import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Modal from "../../components/Modal";
import { toast } from "react-hot-toast";
import { useUserAuth } from "../../hooks/useUserAuth";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import IncomeList from "../../components/Income/IncomeList";
import DeleteAlert from "../../components/DeleteAlert";

const Income = () => {
  useUserAuth();

  const [groupedIncomes, setGroupedIncomes] = useState([]);
  const [incomePage, setIncomePage] = useState(1);
  const [incomeTotalPages, setIncomeTotalPages] = useState(1);
  const [selectedIncomeDate, setSelectedIncomeDate] = useState(
    new Date().toISOString().split("T")[0] // default today
  );

  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [OpenAddIncomeModal, setOpenAddIncomeModal] = useState(false);

  // ---------- Fetch grouped incomes ----------
  const fetchGroupedIncomes = async (page = 1, date = selectedIncomeDate) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME, {
        params: { page, limit: 1, date },
      });

      setGroupedIncomes(response.data.data || []);
      setIncomeTotalPages(response.data.totalPages || 1);
      setIncomePage(response.data.currentPage || 1);
    } catch (error) {
      console.error("Failed to fetch incomes:", error);
      toast.error("Failed to fetch incomes");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Add Income ----------
  const handleAddIncome = async (income) => {
    const { source, amount, date, icon, description } = income;

    if (!source.trim()) {
      toast.error("Source is required");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount must be a valid number and greater than 0");
      return;
    }
    if (!date) {
      toast.error("Date is required");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon,
        description,
      });
      setOpenAddIncomeModal(false);
      toast.success("Income added successfully");
      fetchGroupedIncomes(1, selectedIncomeDate);
    } catch (error) {
      console.error(
        "Failed to add income:",
        error.response?.data?.message || error.message
      );
      toast.error("Failed to add income");
    }
  };

  // ---------- Delete Income ----------
  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Income deleted successfully");
      fetchGroupedIncomes(incomePage, selectedIncomeDate);
    } catch (error) {
      console.error(
        "Failed to delete income:",
        error.response?.data?.message || error.message
      );
      toast.error("Failed to delete income");
    }
  };

  // ---------- Download ----------
  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.INCOME.DOWNLOAD_INCOME,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(
        "Failed to download income details:",
        error.response?.data?.message || error.message
      );
      toast.error("Failed to download income details");
    }
  };

  useEffect(() => {
    fetchGroupedIncomes(1, selectedIncomeDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <IncomeOverview
              transactions={
                groupedIncomes.flatMap((group) => group.incomes) || []
              }
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>

          <IncomeList
            groupedIncomes={groupedIncomes}
            onDelete={(id) =>
              setOpenDeleteAlert({ show: true, data: id })
            }
            onDownload={handleDownloadIncomeDetails}
            currentPage={incomePage}
            totalPages={incomeTotalPages}
            onPageChange={(page) => fetchGroupedIncomes(page, selectedIncomeDate)}
            onDatePick={(date) => {
              setSelectedIncomeDate(date);
              fetchGroupedIncomes(1, date);
            }}
          />
        </div>

        {/* Add Income Modal */}
        <Modal
          isOpen={OpenAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>

        {/* Delete Confirmation */}
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            content={`Are you sure you want to delete this income?`}
            onDelete={() => {
              deleteIncome(openDeleteAlert.data);
            }}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
