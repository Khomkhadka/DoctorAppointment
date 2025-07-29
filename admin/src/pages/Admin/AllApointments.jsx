import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  // Filter appointments based on selected filterType
  const filteredAppointments = appointments.filter(item => {
    if (filterType === 'cancelled') return item.cancelled;
    if (filterType === 'active') return !item.cancelled;
    return true; // all
  });

  // Count active and cancelled appointments for display below the table
  const activeCount = appointments.filter(item => !item.cancelled).length;
  const cancelledCount = appointments.filter(item => item.cancelled).length;

  return (
    <div className="p-6 w-full max-w-[90%] mx-auto bg-blue-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">All Appointments</h2>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-md ${
            filterType === 'all' ? 'bg-blue-500 text-white' : 'bg-white border border-blue-500 text-blue-500'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterType('active')}
          className={`px-4 py-2 rounded-md ${
            filterType === 'active' ? 'bg-blue-500 text-white' : 'bg-white border border-blue-500 text-blue-500'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilterType('cancelled')}
          className={`px-4 py-2 rounded-md ${
            filterType === 'cancelled' ? 'bg-blue-500 text-white' : 'bg-white border border-blue-500 text-blue-500'
          }`}
        >
          Cancelled
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left">SN</th>
              <th className="p-4 text-left">Patient</th>
              <th className="p-4 text-left">Age</th>
              <th className="p-4 text-left">Date & Time</th>
              <th className="p-4 text-left">Doctor</th>
              <th className="p-4 text-left">Fees</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments
                .slice() // make a shallow copy before reversing
                .reverse()
                .map((item, index) => (
                  <tr key={item._id} className="border-b hover:bg-gray-100">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4 flex items-center gap-4">
                      <img
                        src={item.userData.image || assets.profileIcon}
                        alt="Patient"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span>{item.userData.name}</span>
                    </td>
                    <td className="p-4">{calculateAge(item.userData.dob)}</td>
                    <td className="p-4">
                      {slotDateFormat(item.slotDate)}, {item.slotTime}
                    </td>
                    <td className="p-4 flex items-center gap-4">
                      <img
                        src={item.docData.image || assets.profileIcon}
                        alt="Doctor"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span>{item.docData.name}</span>
                    </td>
                    <td className="p-4">{currency}{item.amount}</td>
                    <td className="p-4">
                      {item.cancelled ? (
                        <p
                          onClick={() => toast.info('Appointment already cancelled')}
                          className="text-red-400 text-xs font-medium cursor-pointer"
                        >
                          Cancelled
                        </p>
                      ) : (item.isCompleted ?<p className='text-green-500 text-xs font-medium cursor-pointer'>
                          Completed
                      </p>:
                        <img
                          onClick={() => cancelAppointment(item._id)}
                          src={assets.cancel_icon}
                          alt="Cancel"
                          className="w-10 cursor-pointer"
                        />
                      )}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Counts below the table */}
      <div className="mt-4 flex gap-8 text-gray-700 font-semibold">
        <p>
          Active Appointments: <span className="text-blue-600">{activeCount}</span>
        </p>
        <p>
          Cancelled Appointments: <span className="text-red-600">{cancelledCount}</span>
        </p>
      </div>
    </div>
  );
};

export default AllAppointments;
