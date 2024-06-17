import React, { useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUserCog,
  faBuilding,
  faArrowRight,
  faPlusCircle,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { FaArrowRight, FaLine } from "react-icons/fa";
import Navbar from "../components/navbar/Navbar";
import { UserContext } from "../components/contexts/UserContextProvider";
import { FAQItem } from "../components/faq/FAQitem";
import { MyRoutes } from "../common/common.config";

const HelpPage = () => {
  const { userDetails } = useContext(UserContext);
  return (
    <>
      <Navbar userRole={userDetails.role} screen={MyRoutes.HELP_PAGE} />
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
          <FAQItem
            question="How to create a ticket?"
            answer={
              <>
                <strong>Create New Ticket:</strong> Click on the "Create New
                Ticket" button. Enter all the required details such as title,
                description, attach any relevant files, and choose the
                appropriate department. Click on the "Submit" button to create
                the ticket.
              </>
            }
            icon={faPlusCircle}
          />
          <FAQItem
            question="How to track status of the ticket?"
            answer={
              <>
                <strong>Track Ticket:</strong> You can track the status of your
                ticket on the Tickets Details Page.
              </>
            }
            icon={faEye}
          />
          <FAQItem
            question="What will be the flow of the ticket?"
            answer={
              <>
                <strong>Track Ticket:</strong> The ticket will go through the
                following stages: User, Master, Department. Initially the user
                will create the ticket. Then it will go to the master (Piyush
                sir). Then it will go the related department.
              </>
            }
            icon={faEye}
          />
        </div>
      </div>
    </>
  );
};

export default HelpPage;
