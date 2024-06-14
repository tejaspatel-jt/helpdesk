import React, { useState } from "react";
import { FaArrowRight, FaArrowDown } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faEye } from "@fortawesome/free-solid-svg-icons";

export const FAQItem = ({ question, answer, icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border rounded-md shadow-md p-2 mb-4">
      <details onToggle={toggleOpen} open={isOpen}>
        <summary className="cursor-pointer flex items-center text-2xl font-semibold">
          {isOpen ? (
            <FaArrowDown className="mr-2" />
          ) : (
            <FaArrowRight className="mr-2" />
          )}{" "}
          {question}
        </summary>
        <p className="flex items-start space-x-2 mb-2">
          <FontAwesomeIcon icon={icon} className="text-gray-700 mt-1" />
          <span>{answer}</span>
        </p>
      </details>
    </div>
  );
};
