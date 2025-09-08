import React, { useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import {
  LuLifeBuoy,
  LuMail,
  LuBookOpen,
  LuMessageCircle,
  LuInfo,
} from "react-icons/lu";

const Help = () => {
  const faqs = [
    {
      question: "How do I add an expense?",
      answer:
        "Go to the Expenses section, click the 'Add Expense' button, fill in details like category, amount, and date, then save.",
    },
    {
      question: "Can I edit or delete a transaction?",
      answer:
        "Yes, click on any expense or income card to open its details. From there, you can edit or delete it.",
    },
    {
      question: "How do I track a trip?",
      answer:
        "Create a new trip from the Trips page. You can add expenses, incomes, and members inside that trip for better tracking.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, all data is securely stored in our servers with encrypted communication.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <LuLifeBuoy className="w-7 h-7 text-blue-500" />
          <h1 className="text-2xl font-semibold">Help & Support</h1>
        </div>

        {/* Quick Support Options */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card text-center flex flex-col items-center space-y-3">
            <LuBookOpen className="w-8 h-8 text-purple-500" />
            <h2 className="font-medium">User Guide</h2>
            <p className="text-sm text-gray-500">
              Learn how to get started and explore all features.
            </p>
          </div>

          <div className="card text-center flex flex-col items-center space-y-3">
            <LuMessageCircle className="w-8 h-8 text-green-500" />
            <h2 className="font-medium">FAQs</h2>
            <p className="text-sm text-gray-500">
              Find answers to the most commonly asked questions.
            </p>
          </div>

          <div className="card text-center flex flex-col items-center space-y-3">
            <LuMail className="w-8 h-8 text-red-500" />
            <h2 className="font-medium">Contact Us</h2>
            <p className="text-sm text-gray-500">
              Reach out to our support team for assistance.
            </p>
          </div>
        </div>

        {/* FAQs Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <LuInfo className="w-5 h-5 text-blue-500" /> Frequently Asked
            Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="card cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{faq.question}</span>
                  <span className="text-gray-500 text-xl">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </div>
                {openIndex === index && (
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Help;
