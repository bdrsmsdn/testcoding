import React, { useState, useEffect } from 'react';
import { Navbar, SidebarUser } from '../../components';

const OrdersUser = () => {
  const [Orders, setOrders] = useState([]);
  const [cars, setCars] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen2, setModalOpen2] = useState(false);
  const [newOrder, setNewOrder] = useState({
    car: '',
    user: '',
    pickupLoc: '',
    dropoffLoc: '',
    pickupDate: '',
    dropoffDate: '',
    pickupTime: '',
  });

  const [editOrder, setEditOrder] = useState({
    car: '',
    user: '',
    pickupLoc: '',
    dropoffLoc: '',
    pickupDate: '',
    dropoffDate: '',
    pickupTime: '',
  });

  const storedData = JSON.parse(localStorage.getItem('userData'));

  useEffect(() => {
    fetchOrders(storedData._id);
    fetchCars();
  }, []);

  const fetchOrders = async (id) => {
    try {
      if (storedData) {
        const response = await fetch('http://localhost:8000/orders/user/' + id, {
          headers: {
            'x-access-token': storedData.token,
          },
        });
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching Orders:', error);
    }
  };

  const fetchCars = async () => {
    try {
      if (storedData) {
        const response = await fetch('http://localhost:8000/cars', {
          headers: {
            'x-access-token': storedData.token,
          },
        });
        const data = await response.json();
        setCars(data);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const toggleDropdown = (orderId) => {
    setShowDropdown(showDropdown === orderId ? null : orderId);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalOpen2(false);
    setNewOrder({
      car: '',
      user: '',
      pickupLoc: '',
      dropoffLoc: '',
      pickupDate: '',
      dropoffDate: '',
      pickupTime: '',
    });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const formatDateForInput = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-CA', options);
  };

  const handleAddOrder = async (storedData) => {
    if (newOrder.dropoffDate < newOrder.pickupDate) {
      alert('Something error');
    }
    const dt = {
      car: newOrder.car,
      user: storedData._id,
      pickupLoc: newOrder.pickupLoc,
      dropoffLoc: newOrder.dropoffLoc,
      pickupDate: newOrder.pickupDate,
      dropoffDate: newOrder.dropoffDate,
      pickupTime: newOrder.pickupTime,
    };

    try {
      const response = await fetch('http://localhost:8000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': storedData.token,
        },
        body: JSON.stringify(dt),
      });

      if (response.ok) {
        closeModal();
        fetchOrders(storedData._id);
      } else {
        console.error('Error adding order:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };

  const handleDelete = async (orderId, storedData) => {
    try {
      const response = await fetch(`http://localhost:8000/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'x-access-token': storedData.token,
        },
      });

      if (response.ok) {
        fetchOrders(storedData._id);
      } else {
        console.error('Error deleting order:', response.statusText);
        alert('Error deleting order. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleEdit = (orderId) => {
    const orderEdit = Orders.find((order) => order._id === orderId);
    setEditOrder(orderEdit);
    setModalOpen2(true);
  };

  const handleEditOrder = async (storedData) => {
    try {
      const response = await fetch(`http://localhost:8000/orders/${editOrder._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': storedData.token,
        },
        body: JSON.stringify(editOrder),
      });

      if (response.ok) {
        closeModal();
        fetchOrders(storedData._id);
      } else {
        console.error('Error editing order:', response.statusText);
      }
    } catch (error) {
      console.error('Error editing order:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex">
        <SidebarUser />
        <div className="ml-[50px] py-6">
          <h1 className="text-2xl font-semibold mb-4 text-left">Orders Table</h1>
          <button onClick={openModal} className="flex px-4 py-2 bg-black text-white mb-4 rounded-md">
            + Add Data
          </button>
          <table className="w-full border-collapse table-auto">
            <thead>
              <tr>
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">Car Name</th>
                <th className="border px-4 py-2">Pick Up Loc</th>
                <th className="border px-4 py-2">Drop Off Loc</th>
                <th className="border px-4 py-2">Pick Up Date</th>
                <th className="border px-4 py-2">Drop Off Date</th>
                <th className="border px-4 py-2">Pick Up Time</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {Orders.map((order, index) => (
                <tr key={order._id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{order.car.carName}</td>
                  <td className="border px-4 py-2">{order.pickupLoc}</td>
                  <td className="border px-4 py-2">{order.dropoffLoc}</td>
                  <td className="border px-4 py-2">{formatDate(order.pickupDate)}</td>
                  <td className="border px-4 py-2">{formatDate(order.dropoffDate)}</td>
                  <td className="border px-4 py-2">{order.pickupTime}</td>
                  <td className="border px-4 py-2">
                    <div className="relative inline-block text-left">
                      <button
                        type="button"
                        className="inline-flex justify-center w-full px-2 py-2 text-sm font-medium text-black bg-white border border-transparent rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                        id="options-menu"
                        aria-haspopup="false"
                        aria-expanded="false"
                        onClick={() => toggleDropdown(order._id)}
                      >
                        ...
                      </button>
                      {showDropdown === order._id && (
                        <div
                          className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-300 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          <div className="py-1" role="none">
                            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={() => handleEdit(order._id)}>
                              Edit
                            </button>
                            <button className="block px-4 py-2 text-sm text-red-700 hover:bg-red-100 hover:text-red-900" role="menuitem" onClick={() => handleDelete(order._id, storedData)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={`${modalOpen ? 'fixed' : 'hidden'} inset-0 flex items-center justify-center z-10`}>
            <div className="fixed inset-0 bg-black opacity-60" onClick={closeModal}></div>
            <div className="bg-white p-4 rounded-lg shadow-lg z-20 w-[500px]">
              <h2 className="text-lg font-semibold mb-4">Add New Order</h2>
              <form className="text-left overflow-y-scroll overflow-x-hidden max-h-[400px]">
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Car Name</label>
                  <select name="car" value={newOrder.car} onChange={(e) => setNewOrder({ ...newOrder, car: e.target.value })} className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300">
                    <option value="">Select a car</option>
                    {cars.map((car) => (
                      <option key={car._id} value={car._id}>
                        {car.carName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Pick Up Location</label>
                  <input
                    type="text"
                    name="pickupLoc"
                    value={newOrder.pickupLoc}
                    onChange={(e) => setNewOrder({ ...newOrder, pickupLoc: e.target.value })}
                    className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Drop Off Location</label>
                  <input
                    type="text"
                    name="dropoffLoc"
                    value={newOrder.dropoffLoc}
                    onChange={(e) => setNewOrder({ ...newOrder, dropoffLoc: e.target.value })}
                    className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Pick Up Date</label>
                  <input
                    type="date"
                    name="pickupDate"
                    value={newOrder.pickupDate}
                    onChange={(e) => setNewOrder({ ...newOrder, pickupDate: e.target.value })}
                    className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Drop Off Date</label>
                  <input
                    type="date"
                    name="dropoffDate"
                    value={newOrder.dropoffDate}
                    onChange={(e) => setNewOrder({ ...newOrder, dropoffDate: e.target.value })}
                    className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Pick Up Time</label>
                  <input
                    type="text"
                    name="pickupTime"
                    value={newOrder.pickupTime}
                    onChange={(e) => setNewOrder({ ...newOrder, pickupTime: e.target.value })}
                    className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => handleAddOrder(storedData)}
                  >
                    Add Order
                  </button>
                  <button
                    type="button"
                    className="ml-2 inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-transparent rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className={`${modalOpen2 ? 'fixed' : 'hidden'} inset-0 flex items-center justify-center z-10`}>
            <div className="fixed inset-0 bg-black opacity-60" onClick={closeModal}></div>
            <div className="bg-white p-4 rounded-lg shadow-lg z-20 w-[500px]">
              <h2 className="text-lg font-semibold mb-4">Edit Order</h2>
              <form className="text-left overflow-y-scroll overflow-x-hidden max-h-[400px]">
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Car Name</label>
                  <select
                    name="car"
                    value={editOrder.car._id}
                    onChange={(e) => setEditOrder({ ...editOrder, car: e.target.value })}
                    className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300"
                  >
                    <option value="">Select a car</option>
                    {cars.map((car) => (
                      <option key={car._id} value={car._id}>
                        {car.carName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Pick Up Location</label>
                  <input
                    type="text"
                    name="pickupLoc"
                    value={editOrder.pickupLoc}
                    onChange={(e) => setEditOrder({ ...editOrder, pickupLoc: e.target.value })}
                    className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Drop Off Location</label>
                  <input
                    type="text"
                    name="dropoffLoc"
                    value={editOrder.dropoffLoc}
                    onChange={(e) => setEditOrder({ ...editOrder, dropoffLoc: e.target.value })}
                    className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Pick Up Date</label>
                  <input
                    type="date"
                    name="pickupDate"
                    value={formatDateForInput(editOrder.pickupDate)}
                    onChange={(e) => setEditOrder({ ...editOrder, pickupDate: e.target.value })}
                    className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Drop Off Date</label>
                  <input
                    type="date"
                    name="dropoffDate"
                    value={formatDateForInput(editOrder.dropoffDate)}
                    onChange={(e) => setEditOrder({ ...editOrder, dropoffDate: e.target.value })}
                    className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Pick Up Time</label>
                  <input
                    type="text"
                    name="pickupTime"
                    value={editOrder.pickupTime}
                    onChange={(e) => setEditOrder({ ...editOrder, pickupTime: e.target.value })}
                    className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => handleEditOrder(storedData)}
                  >
                    Update Order
                  </button>
                  <button
                    type="button"
                    className="ml-2 inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-transparent rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersUser;
