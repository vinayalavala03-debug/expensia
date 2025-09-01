import React, { useState } from 'react'
import Input from '../Inputs/Input';
import EmojiPickerPopup from '../EmojiPickerPopup';

const sources = [
  "Salary",
  "Business",
  "Investment",
  "Gift",
  "Freelance",
  "Other"
]

const AddIncomeForm = ({ onAddIncome }) => {
  const [income, setIncome] = useState({
    source: "",
    amount: "",
    date: "",
    icon: '',
    description: '' // ✅ optional description
  })

  const [isCustomSource, setIsCustomSource] = useState(false)

  const handleChange = (key, value) =>
    setIncome(prev => ({ ...prev, [key]: value }))

  const handleSubmit = () => {
    onAddIncome(income)
  }

  return (
    <div>
      <EmojiPickerPopup
        icon={income.icon}
        onSelect={(icon) => handleChange("icon", icon)}
      />

      {/* Source: dropdown or input */}
      {!isCustomSource ? (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Income Source
          </label>
          <select
            value={income.source}
            onChange={(e) => {
              const value = e.target.value
              if (value === "Other") {
                setIsCustomSource(true)
                handleChange("source", "")
              } else {
                handleChange("source", value)
              }
            }}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Select source</option>
            {sources.map((src, i) => (
              <option key={i} value={src}>{src}</option>
            ))}
          </select>
        </div>
      ) : (
        <Input
          label="Income Source"
          value={income.source}
          onChange={({ target }) => handleChange("source", target.value)}
          placeholder="Enter custom source"
          type="text"
        />
      )}

      <Input
        value={income.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Income Amount"
        placeholder="Enter income amount"
        type="number"
      />

      <Input
        value={income.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Income Date"
        type="date"
      />

      {/* ✅ Optional Description Field */}
      <Input
        label="Description (optional)"
        value={income.description}
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
          Add Income
        </button>
      </div>
    </div>
  )
}

export default AddIncomeForm
