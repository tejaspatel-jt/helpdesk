import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUserCog,
  faBuilding,
  faArrowRight,
  faSignInAlt,
  faTicketAlt,
  faPlusCircle,
  faPencilAlt,
  faPaperPlane,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import {
  ArrowRightIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/20/solid";
import { FaArrowRight } from "react-icons/fa";
import Navbar from "../components/navbar/Navbar";
import { UserContext } from "../components/contexts/UserContextProvider";

const HelpPage = () => {
  const { userDetails } = useContext(UserContext);
  return (
    <>
      <Navbar userRole={userDetails.role} />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Help</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Ticket Flow :</h2>
          <div className="flex justify-center items-center mb-6 space-x-8">
            <div className="flex flex-col items-center">
              <div className="text-center mb-2 font-bold">User</div>
              <div className="p-4 bg-gray-200 rounded-full mb-2">
                <FontAwesomeIcon
                  icon={faUser}
                  size="2x"
                  className="text-gray-700"
                />
              </div>
              <div className="text-center">
                <strong>Status:</strong> Created
              </div>
            </div>
            <FontAwesomeIcon
              icon={faArrowRight}
              size="3x"
              className="text-gray-700"
            />
            <div className="flex flex-col items-center">
              <div className="text-center mb-2 font-bold">Master</div>
              <div className="p-4 bg-gray-200 rounded-full mb-2">
                <FontAwesomeIcon
                  icon={faUserCog}
                  size="2x"
                  className="text-gray-700"
                />
              </div>
              <div className="text-center">
                <strong>Status:</strong> Reviewed
              </div>
            </div>
            <FontAwesomeIcon
              icon={faArrowRight}
              size="3x"
              className="text-gray-700"
            />
            <div className="flex flex-col items-center">
              <div className="text-center mb-2 font-bold">Department</div>
              <div className="p-4 bg-gray-200 rounded-full mb-2">
                <FontAwesomeIcon
                  icon={faBuilding}
                  size="2x"
                  className="text-gray-700"
                />
              </div>
              <div className="text-center">
                <strong>Status:</strong> Processed
              </div>
            </div>
          </div>
        </section>

        <div>
          <h2 className="text-2xl font-semibold mb-4">FAQs :</h2>
          <div className="border rounded-md shadow-md p-2 mb-4">
            <details>
              <summary className="cursor-pointer flex items-center text-2xl font-semibold ">
                <FaArrowRight className="mr-2" /> How to create a ticket ?
              </summary>
              <p className="flex items-start space-x-2 mb-2">
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  className="text-gray-700 mt-1"
                />{" "}
                <span>
                  <strong>Create New Ticket:</strong> Click on the "Create New
                  Ticket" button. Enter all the required details such as title,
                  description, attach any relevant files, and choose the
                  appropriate department. Click on the "Submit" button to create
                  the ticket.
                </span>
              </p>
            </details>
          </div>
          <div className="border rounded-md shadow-md p-2 mb-4">
            <details>
              <summary className="cursor-pointer flex items-center text-2xl font-semibold ">
                {/* Steps to Create a Ticket :- */}
                <FaArrowRight className="mr-2" /> How to track status of the
                ticket ?
              </summary>
              <p className="flex items-start space-x-2 mb-2">
                <FontAwesomeIcon icon={faEye} className="text-gray-700 mt-1" />
                <span>
                  <strong>Track Ticket:</strong> You can track the status of
                  your ticket on the Tickets Details Page.
                </span>
              </p>
            </details>
          </div>
          <div className="border rounded-md shadow-md p-2 mb-4">
            <details>
              <summary className="cursor-pointer flex items-center text-2xl font-semibold ">
                {/* Steps to Create a Ticket :- */}
                <FaArrowRight className="mr-2" /> What will be the flow of the
                ticket ?
              </summary>
              <p className="flex items-start space-x-2 mb-2">
                <FontAwesomeIcon icon={faEye} className="text-gray-700 mt-1" />
                <span>
                  <strong>Track Ticket:</strong> The ticket will go through the
                  following stages: User, Master, Department. Initially the user
                  will create the ticket. Then it will go to the master (Piyush
                  sir). Then it will go the related department.
                </span>
              </p>
            </details>
            {/* <details>
            <summary>More details</summary>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Reiciendis, exercitationem.
          </details> */}
          </div>{" "}
        </div>
      </div>
    </>
  );
};

export default HelpPage;
