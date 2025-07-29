import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';

import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';


const Dashboard = () => {
  const { aToken, getDashData, dashData } = useContext(AdminContext);
  

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  const revenueData = [
    { month: 'Jan', revenue: 40000 },
    { month: 'Feb', revenue: 30000 },
    { month: 'Mar', revenue: 50000 },
    { month: 'Apr', revenue: dashData?.totalRevenue || 0 },
  ];

  return (
    <div className="w-full min-h-screen bg-blue-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
          <p className="text-gray-600">Total Doctors</p>
          <h2 className="text-3xl font-bold">{dashData?.doctors || 0}</h2>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
          <p className="text-gray-600">Total Patients</p>
          <h2 className="text-3xl font-bold">{dashData?.patient || 0}</h2>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
          <p className="text-gray-600">Total Revenue</p>
          <h2 className="text-3xl font-bold">Rs. {dashData?.totalRevenue || 0}</h2>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Revenue Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Patients List</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left">SN</th>
                <th className="p-4 text-left">Patient</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Address</th>
              </tr>
            </thead>
            <tbody>
              {dashData?.users?.length > 0 ? (
                dashData.users.map((user, index) => (
                  <tr key={user._id} className="border-b hover:bg-gray-100">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4 flex items-center gap-4">
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span>{user.name}</span>
                    </td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">
                      {user.address?.line1}, {user.address?.line2}
                    </td>
                  </tr>
                  
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
                
              )}
              
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
