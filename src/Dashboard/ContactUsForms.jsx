import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAllContactForms,
    getContactFormById,
    updateContactFormStatus,
    deleteContactForm,
    replyToContactForm,
    selectContactForms,
    selectContactPagination,
    selectContactFilters,
    selectSelectedForm,
    selectContactSubmitState, // For reply/status update loading
    updateFilters,
    setCurrentPage,
    clearSelectedForm,
    resetSubmitState // To reset success/error for popups
} from '../Redux/features/contactSlice'; // Adjust path based on your Redux setup
import Navbar2 from '../Components/Navbar2'; // Assuming this is your admin Navbar
import Footer from '../Components/Footer'; // Your general Footer
import { XMarkIcon, PaperAirplaneIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'; // Icons (these are still fine, they are just SVG icons)
import ConfirmationModal from './components/ConfirmationModal';
import toast from 'react-hot-toast';

// Helper function to format date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function ContactUsForms() {
    const dispatch = useDispatch();
    const forms = useSelector(selectContactForms);
    const pagination = useSelector(selectContactPagination);
    const filters = useSelector(selectContactFilters);
    const selectedForm = useSelector(selectSelectedForm);
    const { loading: dataLoading, error: dataError } = useSelector(state => state.contact); // Main data loading/error
    const { loading } = useSelector(state => state.contact); // Main data loading/error
    const { loading: submitLoading, error: submitError, success: submitSuccess } = selectContactSubmitState; // For form actions

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [replyMessage, setReplyMessage] = useState('');
    const [currentStatusUpdate, setCurrentStatusUpdate] = useState(''); // Local state for status dropdown

    // Fetch forms on component mount and when filters/pagination change


    useEffect(() => {
        dispatch(getAllContactForms(filters));
    }, [dispatch, filters]);

    // Open modal and fetch selected form details
    const handleViewDetails = (id) => {
        dispatch(getContactFormById(id));
        setIsModalOpen(true);
    };

    // Close modal and clear selected form data
    const handleCloseModal = () => {
        setIsModalOpen(false);
        dispatch(clearSelectedForm());
        setReplyMessage('');
        dispatch(resetSubmitState()); // Clear submit state for modal actions
    };

    // Handle status change in modal
    const handleStatusChange = (e) => {
        setCurrentStatusUpdate(e.target.value);
    };

    // Dispatch status update
    const handleUpdateStatus = () => {
        if (selectedForm && currentStatusUpdate) {
            dispatch(updateContactFormStatus({ id: selectedForm._id, status: currentStatusUpdate }));
        }
    };

    // Handle reply submission
    const handleSendReply = () => {
        if (selectedForm && replyMessage.trim()) {
            dispatch(replyToContactForm({ id: selectedForm._id, replyMessage }));
            // The slice will handle clearing replyMessage on success.
        }
    };

    // Handle form deletion
    const [isdltModalOpen, setIsdltModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    const handleDeleteconfirm = () => {
        if (!selectedForm) {
            toast.error("Form data not loaded.");
            return;
        }

        setModalTitle(`Confirm Delete for Form #${selectedForm._id.substring(0, 8)}`);
        setModalMessage(`Are you sure you want to Delete the contact Form Sent by "${selectedForm.name}" `);
        setIsdltModalOpen(true);
    };

    const handleDeleteForm = () => {
        dispatch(deleteContactForm(selectedForm._id));
        handleCloseModal(); // Close modal after initiating delete
    };

    // Effect to sync local status state with selectedForm status when selectedForm changes
    useEffect(() => {
        if (selectedForm) {
            setCurrentStatusUpdate(selectedForm.status);
            // If a reply was just sent and the modal is still open, clear the reply message input
            if (submitSuccess && !submitLoading && selectedForm.replies.some(r => r.message === replyMessage)) {
                setReplyMessage('');
            }
        }
    }, [selectedForm, submitSuccess, submitLoading, replyMessage]);


    // Effect to re-fetch forms if a delete or status update action was successful
    useEffect(() => {
        // Only re-fetch if an action was successful and not currently loading, and the selectedForm state is either null (deleted) or its ID is valid (updated)
        if (submitSuccess && !submitLoading && (selectedForm === null || selectedForm._id)) {
            dispatch(getAllContactForms(filters)); // Re-fetch the list
            dispatch(resetSubmitState()); // Reset submit state for next actions
        }
    }, [submitSuccess, submitLoading, selectedForm, filters, dispatch]);


    // Pagination handlers
    const handlePageChange = (page) => {
        dispatch(setCurrentPage(page));
        dispatch(getAllContactForms({ ...filters, page }));
    };

    // Filter handlers
    const handleFilterChange = (e) => {
        dispatch(updateFilters({ [e.target.name]: e.target.value }));
        dispatch(setCurrentPage(1)); // Reset to page 1 on filter change
        dispatch(getAllContactForms({ ...filters, [e.target.name]: e.target.value, page: 1 }));
    };

    if (dataError) {
        return (
            <div className="min-h-screen bg-[#080708] text-white flex items-center justify-center font-poppins">
                {/* <Navbar2 /> */}
                <p className="text-red-500 text-xl">Error: {dataError}</p>
                {/* <Footer /> */}
            </div>
        );
    }

    return (
        <div className="min-h-max bg-[#080708] text-white font-poppins flex flex-col relative md:px-4 md:py-5">
            {/* <Navbar2 /> */}
            <div className="container mx-auto  flex-1">
                <h1 className="text-6xl font-gothic-1 mb-4 ">Manage Contact Form</h1>
                <p className="text-md mb-8 text-gray-400 max-w-2xl font-poppins">
                    View, Reply, Update and delete Forms from your Saair's Contact us Section. Maintain accurate inventory and Forms details.
                </p>

                {/* Filter & Pagination Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-[#0E0E0E] p-4 rounded-lg mb-8 border border-[#383838]">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <label htmlFor="statusFilter" className="text-gray-300">Filter by Status:</label>
                        <select
                            id="statusFilter"
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="bg-[#141414] text-white border border-[#383838] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-poppins"
                        >
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="responded">Responded</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center space-x-2 text-gray-300">
                        <button
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage <= 1 || dataLoading}
                            className="px-3 py-1 bg-cyan-600 rounded disabled:opacity-50 hover:bg-cyan-500 font-saira"
                        >
                            Previous
                        </button>
                        <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
                        <button
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage >= pagination.totalPages || dataLoading}
                            className="px-3 py-1 bg-cyan-600 rounded disabled:opacity-50 hover:bg-cyan-500 font-saira"
                        >
                            Next
                        </button>
                    </div>
                </div>

                {/* Forms Table */}
                {dataLoading ? (
                    <p className="text-center text-gray-400 text-xl mt-10">Loading contact forms...</p>
                ) : forms.length === 0 ? (
                    <p className="text-center text-gray-400 text-xl mt-10">No contact forms found.</p>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar::-webkit-scrollbar-track bg-[#0E0E0E] rounded-xl shadow-lg border border-[#383838]">
                        <table className="min-w-full divide-y divide-[#383838]">
                            <thead className="bg-[#141414]">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-saira">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-saira">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-saira">
                                        Subject
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-saira">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-saira">
                                        Received On
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider font-saira">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#383838]">
                                {forms.map((form) => (
                                    <tr key={form._id} className="hover:bg-[#191919] transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white font-poppins">
                                            {form.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-poppins">
                                            {form.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-poppins">
                                            {form.help}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full font-saira
                        ${form.status === 'pending' ? 'bg-yellow-800 text-yellow-300' : ''}
                        ${form.status === 'responded' ? 'bg-blue-800 text-blue-300' : ''}
                        ${form.status === 'resolved' ? 'bg-green-800 text-green-300' : ''}
                      `}>
                                                {form.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-poppins">
                                            {formatDate(form.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleViewDetails(form._id)}
                                                className="text-cyan-400 hover:text-cyan-600 transition-colors mr-3"
                                                title="View Details"
                                            >
                                                <EyeIcon className="h-5 w-5 inline-block mr-1" /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {/* <Footer /> */}

            {/* Custom Details Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 min-h-screen  overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-3xl bg-[#0e0e0e] rounded-2xl shadow-xl border border-[#383838] p-8 text-left top-50 font-poppins animate-fade-in-scale  mb-[100px]">
                        <h3 className="text-4xl font-saira font-medium leading-6 text-white mb-6 border-b border-[#383838] pb-4">
                            Contact Form Details
                            <button
                                type="button"
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                                onClick={handleCloseModal}
                            >
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </h3>

                        {selectedForm && !dataLoading ? (
                            <div className="space-y-4 text-gray-200">
                                <p><strong>Name:</strong> {selectedForm.name}</p>
                                <p><strong>Email:</strong> {selectedForm.email}</p>
                                <p><strong>Subject:</strong> {selectedForm.help}</p>
                                <p><strong>Message:</strong> {selectedForm.about}</p>
                                <p><strong>Received:</strong> {formatDate(selectedForm.createdAt)}</p>

                                {/* Status Update */}
                                <div className="mt-6 flex items-center space-x-4">
                                    <label htmlFor="status" className="font-semibold text-white">Status:</label>
                                    <select
                                        id="status"
                                        value={currentStatusUpdate}
                                        onChange={handleStatusChange}
                                        className="bg-[#141414] text-white border border-[#383838] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-400 flex-grow"
                                        disabled={submitLoading}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="responded">Responded</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                    <button
                                        onClick={handleUpdateStatus}
                                        className="bg-cyan-600 text-white px-4 py-2 rounded-lg font-saira hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={submitLoading || currentStatusUpdate === selectedForm.status}
                                    >
                                        {submitLoading ? 'Updating...' : 'Update Status'}
                                    </button>
                                </div>

                                {/* Replies History */}
                                {selectedForm.replies && selectedForm.replies.length > 0 && (
                                    <div className="mt-8 border-t border-[#383838] pt-6">
                                        <h4 className="text-xl font-saira font-semibold text-white mb-4">Reply History</h4>
                                        <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                            {selectedForm.replies.map((reply, index) => (
                                                <div key={index} className="bg-[#191919] p-4 rounded-lg border border-[#383838]">
                                                    <p className="text-sm text-gray-400 mb-1">Replied {formatDate(reply.repliedAt)}</p>
                                                    <p className="text-gray-100">{reply.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Reply Section */}
                                <div className="mt-8 border-t border-[#383838] pt-6">
                                    <h4 className="text-xl font-saira font-semibold text-white mb-4">Send a Reply</h4>
                                    <textarea
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        placeholder="Type your reply here..."
                                        rows="4"
                                        className="w-full bg-[#141414] text-white border border-[#383838] rounded px-4 py-3 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-poppins"
                                        disabled={submitLoading}
                                    ></textarea>
                                    <button
                                        onClick={handleSendReply}
                                        className="mt-4 bg-cyan-600 text-white px-6 py-2 rounded-lg font-saira hover:bg-cyan-500 transition-colors flex items-center justify-center
                               disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={submitLoading || !replyMessage.trim()}
                                    >
                                        {submitLoading ? 'Sending...' : (
                                            <>
                                                <PaperAirplaneIcon className="h-5 w-5 mr-2" /> Send Reply
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Delete Button */}
                                <div className="mt-8 text-right">

                                    <button
                                        onClick={handleDeleteconfirm}
                                        className="bg-red-600 text-white px-6 py-2 rounded-lg font-saira hover:bg-red-700 transition-colors flex items-center justify-center ml-auto
                               disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={submitLoading}
                                    >
                                        <TrashIcon className="h-5 w-5 mr-2" /> Delete Form
                                    </button>
                                </div>

                            </div>
                        ) : (
                            <p className="text-center text-gray-400">Loading form details...</p>
                        )}
                    </div>
                    <ConfirmationModal isOpen={isdltModalOpen}
                        onClose={() => setIsdltModalOpen(false)}
                        onConfirm={handleDeleteForm}
                        title={modalTitle}
                        message={modalMessage}
                        confirmText="Confirm Delete"
                        confirmButtonClass="bg-red-600 hover:bg-red-700"
                        isLoading={loading} />
                </div>
            )}
        </div>
    );
}