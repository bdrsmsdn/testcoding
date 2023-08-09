import React, { useState, useEffect } from 'react';
import { Navbar, SidebarAdmin } from '../../components';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen2, setModalOpen2] = useState(false);
  const [viewImageModalOpen, setViewImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newCar, setNewCar] = useState({
    carName: '',
    carType: '',
    rating: 0,
    fuel: '',
    hourRate: '',
    dayRate: '',
    monthRate: '',
    image: null,
  });
  const [editingCar, setEditingCar] = useState({
    carName: '',
    carType: '',
    rating: 0,
    fuel: '',
    hourRate: '',
    dayRate: '',
    monthRate: '',
    image: null,
  });

  const storedData = JSON.parse(localStorage.getItem('userData'));

  useEffect(() => {
    fetchCars();
  }, []);

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

  const toggleDropdown = (carId) => {
    setShowDropdown(showDropdown === carId ? null : carId);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    try {
      const imagePath = URL.createObjectURL(file);
      console.log(imagePath);
      setNewCar((prevCar) => ({
        ...prevCar,
        image: imagePath,
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalOpen2(false);
    setNewCar({
      carName: '',
      carType: '',
      rating: 0,
      fuel: '',
      hourRate: '',
      dayRate: '',
      monthRate: '',
      image: null,
    });
  };

  const handleViewImage = (imagePath) => {
    setSelectedImage(imagePath);
    setViewImageModalOpen(true);
  };

  const closeViewImageModal = () => {
    setViewImageModalOpen(false);
    setSelectedImage(null);
  };

  const handleAddCar = async (storedData) => {
    const dt = {
      carName: newCar.carName,
      carType: newCar.carType,
      rating: newCar.rating,
      fuel: newCar.fuel,
      hourRate: newCar.hourRate,
      dayRate: newCar.dayRate,
      monthRate: newCar.monthRate,
      image: newCar.image,
    };

    try {
      const response = await fetch('http://localhost:8000/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': storedData.token,
        },
        body: JSON.stringify(dt),
      });

      if (response.ok) {
        closeModal();
        fetchCars();
      } else {
        console.error('Error adding car:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding car:', error);
    }
  };

  const handleDelete = async (carId, storedData) => {
    try {
      const response = await fetch(`http://localhost:8000/cars/${carId}`, {
        method: 'DELETE',
        headers: {
          'x-access-token': storedData.token,
        },
      });

      if (response.ok) {
        fetchCars();
      } else {
        console.error('Error deleting car:', response.statusText);
        alert('Error deleting car. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleEditCar = async (storedData) => {
    try {
      const response = await fetch(`http://localhost:8000/cars/${editingCar._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': storedData.token,
        },
        body: JSON.stringify(editingCar),
      });

      if (response.ok) {
        closeModal();
        fetchCars();
      } else {
        console.error('Error editing car:', response.statusText);
      }
    } catch (error) {
      console.error('Error editing car:', error);
    }
  };

  const handleEdit = (carId) => {
    const carToEdit = cars.find((car) => car._id === carId);
    setEditingCar(carToEdit);
    setModalOpen2(true);
  };

  function ribuan(number) {
    const nmstr = number.toString();
    const formattedNum = nmstr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (nmstr.length > 6) {
      return formattedNum.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
    return formattedNum;
  }

  const handleInputChangeHour = (e) => {
    const rawValue = e.target.value.replace(/,/g, '');
    const formattedValue = ribuan(rawValue);

    setEditingCar({ ...editingCar, hourRate: formattedValue });
  };

  const handleInputChangeDay = (e) => {
    const rawValue = e.target.value.replace(/,/g, '');
    const formattedValue = ribuan(rawValue);

    setEditingCar({ ...editingCar, dayRate: formattedValue });
  };

  const handleInputChangeMonth = (e) => {
    const rawValue = e.target.value.replace(/,/g, '');
    const formattedValue = ribuan(rawValue);

    setEditingCar({ ...editingCar, monthRate: formattedValue });
  };

  return (
    <div>
      <Navbar />
      <div className="flex">
        <SidebarAdmin />
        <div className="ml-[50px] py-6">
          <h1 className="text-2xl font-semibold mb-4 text-left">Cars Table</h1>
          <button onClick={openModal} className="flex px-4 py-2 bg-black text-white mb-4 rounded-md">
            + Add Data
          </button>
          <table className="w-full border-collapse table-auto">
            <thead>
              <tr>
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">Car Name</th>
                <th className="border px-4 py-2">Car Type</th>
                <th className="border px-4 py-2">Rating</th>
                <th className="border px-4 py-2">Fuel</th>
                <th className="border px-4 py-2">Hour Rate</th>
                <th className="border px-4 py-2">Day Rate</th>
                <th className="border px-4 py-2">Month Rate</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car, index) => (
                <tr key={car._id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{car.carName}</td>
                  <td className="border px-4 py-2">{car.carType}</td>
                  <td className="border px-4 py-2">{car.rating}</td>
                  <td className="border px-4 py-2">{car.fuel}</td>
                  <td className="border px-4 py-2">{ribuan(car.hourRate)}</td>
                  <td className="border px-4 py-2">{ribuan(car.dayRate)}</td>
                  <td className="border px-4 py-2">{ribuan(car.monthRate)}</td>
                  <td className="border px-4 py-2">
                    <div className="relative inline-block text-left">
                      <button
                        type="button"
                        className="inline-flex justify-center w-full px-2 py-2 text-sm font-medium text-black bg-white border border-transparent rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                        id="options-menu"
                        aria-haspopup="false"
                        aria-expanded="false"
                        onClick={() => toggleDropdown(car._id)}
                      >
                        ...
                      </button>
                      {showDropdown === car._id && (
                        <div
                          className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-300 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          <div className="py-1" role="none">
                            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={() => handleEdit(car._id)}>
                              Edit
                            </button>
                            <button className="block px-4 py-2 text-sm text-red-700 hover:bg-red-100 hover:text-red-900" role="menuitem" onClick={() => handleDelete(car._id, storedData)}>
                              Delete
                            </button>
                            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900" role="menuitem" onClick={() => handleViewImage(car.image)}>
                              View Image
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
        </div>
        <div className={`${modalOpen ? 'fixed' : 'hidden'} inset-0 flex items-center justify-center z-10`}>
          <div className="fixed inset-0 bg-black opacity-60" onClick={closeModal}></div>
          <div className="bg-white p-4 rounded-lg shadow-lg z-20 w-[500px]">
            <h2 className="text-lg font-semibold mb-4">Add New Car</h2>
            <form className="text-left overflow-y-scroll overflow-x-hidden max-h-[400px]">
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Car Name</label>
                <input
                  type="text"
                  name="carName"
                  value={newCar.carName}
                  onChange={(e) => setNewCar({ ...newCar, carName: e.target.value })}
                  className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Car Type</label>
                <input
                  type="text"
                  name="carType"
                  value={newCar.carType}
                  onChange={(e) => setNewCar({ ...newCar, carType: e.target.value })}
                  className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <input
                  type="number"
                  name="Rating"
                  value={newCar.rating}
                  onChange={(e) => setNewCar({ ...newCar, rating: e.target.value })}
                  className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Fuel</label>
                <input
                  type="text"
                  name="fuel"
                  value={newCar.fuel}
                  onChange={(e) => setNewCar({ ...newCar, fuel: e.target.value })}
                  className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Hourly Rate</label>
                <input
                  type="text"
                  name="hourRate"
                  value={newCar.hourRate}
                  onChange={(e) => setNewCar({ ...newCar, hourRate: e.target.value })}
                  className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Daily Rate</label>
                <input
                  type="text"
                  name="dayRate"
                  value={newCar.dayRate}
                  onChange={(e) => setNewCar({ ...newCar, dayRate: e.target.value })}
                  className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Monthly Rate</label>
                <input
                  type="text"
                  name="monthRate"
                  value={newCar.monthRate}
                  onChange={(e) => setNewCar({ ...newCar, monthRate: e.target.value })}
                  className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <input type="file" name="image" accept="image/*" onChange={handleImageUpload} className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300" />
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => handleAddCar(storedData)}
                >
                  Add Car
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
            <h2 className="text-lg font-semibold mb-4">Edit Car</h2>
            <form className="text-left overflow-y-scroll overflow-x-hidden max-h-[400px]">
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Car Name</label>
                <input
                  type="text"
                  name="carName"
                  value={editingCar.carName}
                  onChange={(e) => setEditingCar({ ...editingCar, carName: e.target.value })}
                  className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Car Type</label>
                <input
                  type="text"
                  name="carType"
                  value={editingCar.carType}
                  onChange={(e) => setEditingCar({ ...editingCar, carType: e.target.value })}
                  className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <input
                  type="number"
                  name="rating"
                  value={editingCar.rating}
                  onChange={(e) => setEditingCar({ ...editingCar, rating: e.target.value })}
                  className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Fuel</label>
                <input
                  type="text"
                  name="fuel"
                  value={editingCar.fuel}
                  onChange={(e) => setEditingCar({ ...editingCar, fuel: e.target.value })}
                  className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Hourly Rate</label>
                <input type="text" name="hourRate" value={ribuan(editingCar.hourRate)} onChange={handleInputChangeHour} className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300" />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Daily Rate</label>
                <input type="text" name="dayRate" value={ribuan(editingCar.dayRate)} onChange={handleInputChangeDay} className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300" />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Monthly Rate</label>
                <input type="text" name="monthRate" value={ribuan(editingCar.monthRate)} onChange={handleInputChangeMonth} className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300" />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => setEditingCar({ ...editingCar, image: e.target.files[0] })}
                  className="mt-1 block w-full py-2 px-4 rounded-lg border focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => handleEditCar(storedData)}
                >
                  Update Car
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
        {viewImageModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-10">
            <div className="fixed inset-0 bg-black opacity-60" onClick={closeViewImageModal}></div>
            <div className="bg-white p-4 rounded-lg shadow-lg z-20 max-w-full">
              <img src={selectedImage} alt="Car" className="max-h-[80vh] max-w-full object-contain" />
              <button
                className="mt-4 inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-transparent rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                onClick={closeViewImageModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;
