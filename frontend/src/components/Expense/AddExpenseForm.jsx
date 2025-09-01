import React, { useState } from 'react'
import Input from '../Inputs/Input'
import EmojiPickerPopup from '../EmojiPickerPopup'

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Other"
]

const AddExpenseForm = ({ onAddExpense }) => {
  const [expense, setExpense] = useState({
    category: '',
    amount: '',
    date: '',
    icon: '',
    description: ''   // ✅ new optional field
  })
  const [isCustomCategory, setIsCustomCategory] = useState(false)

  const handleChange = (key, value) => {
    setExpense(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSubmit = () => {
    onAddExpense(expense)
  }

  return (
    <div>
      <EmojiPickerPopup
        icon={expense.icon}
        onSelect={(icon) => handleChange("icon", icon)}
      />

      {/* Category: dropdown or input in the same place */}
      {!isCustomCategory ? (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={expense.category}
            onChange={(e) => {
              const value = e.target.value
              if (value === "Other") {
                setIsCustomCategory(true)   // switch to input
                handleChange("category", "")
              } else {
                handleChange("category", value)
              }
            }}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Select category</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      ) : (
        <div className="mb-4">
          <Input
            label="Category"
            value={expense.category}
            onChange={({ target }) => handleChange('category', target.value)}
            placeholder="Enter custom category"
            type="text"
          />
          <button
            type="button"
            className="text-sm text-blue-500 underline mt-1"
            onClick={() => {
              setIsCustomCategory(false)
              handleChange("category", "")
            }}
          >
            ← Back to categories
          </button>
        </div>
      )}

      <Input
        label="Amount"
        value={expense.amount}
        onChange={({ target }) => handleChange('amount', target.value)}
        placeholder="Enter amount"
        type="number"
      />

      <Input
        label="Date"
        value={expense.date}
        onChange={({ target }) => handleChange('date', target.value)}
        type="date"
      />

      {/* ✅ Optional Description Field */}
      <Input
        label="Description (optional)"
        value={expense.description}
        onChange={({ target }) => handleChange('description', target.value)}
        placeholder="Add a note (optional)"
        type="text"
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={handleSubmit}
        >
          Add Expense
        </button>
      </div>
    </div>
  )
}

export default AddExpenseForm
