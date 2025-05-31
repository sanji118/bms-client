import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hook/useAuth';
import { useEffect, useState } from 'react';
import { createAgreement, getUserAgreements, deleteAgreement } from '../../utils/useAgreement';
import Swal from 'sweetalert2';
import RequestAgreement from '../../member/RequestAgreement';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  LoaderPinwheelIcon, SearchIcon, HomeIcon, CalendarIcon, LayersIcon, 
  DollarSignIcon, CheckCircleIcon, XCircleIcon, ClockIcon, Building, 
  EditIcon, TrashIcon, PlusIcon, XIcon 
} from 'lucide-react';
import { getApartments, deleteApartment, createApartment } from '../../utils/useApartment';
import { motion } from 'framer-motion';
import EditApartmentModal from './EditApartmentModal';

const ApartmentsList = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Data fetching
  const { data: apartments = [], isLoading, error } = useQuery({
    queryKey: ['apartments'],
    queryFn: getApartments,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  const { 
    data: userAgreements = [], 
    isLoading: agreementsLoading,
    refetch: refetchAgreements
  } = useQuery({
    queryKey: ['userAgreements', user?.email],
    queryFn: () => user?.email ? getUserAgreements(user.email) : [],
    enabled: !!user?.email,
    staleTime: 5 * 60 * 1000
  });

  // State management
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [agreementForm, setAgreementForm] = useState({
    startDate: '',
    endDate: '',
    termsAccepted: false,
    specialRequests: ''
  });
  const [newApartment, setNewApartment] = useState({
    apartment_no: '',
    floor_no: '',
    block_name: '',
    rent: '',
    status: 'available',
    image: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const apartmentsPerPage = 6;

  // Mutations
  const deleteApartmentMutation = useMutation({
    mutationFn: deleteApartment,
    onSuccess: () => {
      queryClient.invalidateQueries(['apartments']);
      Swal.fire({
        title: 'Success!',
        text: 'Apartment deleted successfully',
        icon: 'success',
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
    },
    onError: (error) => {
      Swal.fire({
        title: 'Error',
        text: error.message || 'Failed to delete apartment',
        icon: 'error',
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
    }
  });

  const createApartmentMutation = useMutation({
    mutationFn: createApartment,
    onSuccess: () => {
      queryClient.invalidateQueries(['apartments']);
      setShowCreateModal(false);
      setNewApartment({
        apartment_no: '',
        floor_no: '',
        block_name: '',
        rent: '',
        status: 'available',
        image: ''
      });
      setImagePreview(null);
      setErrors({});
      Swal.fire({
        title: 'Success!',
        text: 'Apartment created successfully',
        icon: 'success',
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
    },
    onError: (error) => {
      Swal.fire({
        title: 'Error',
        text: error.message || 'Failed to create apartment',
        icon: 'error',
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
    }
  });

  const deleteAgreementMutation = useMutation({
    mutationFn: deleteAgreement,
    onSuccess: () => {
      queryClient.invalidateQueries(['userAgreements']);
      Swal.fire({
        title: 'Success!',
        text: 'Agreement request deleted',
        icon: 'success',
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
    },
    onError: (error) => {
      Swal.fire({
        title: 'Error',
        text: error.message || 'Failed to delete agreement',
        icon: 'error',
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
    }
  });

  // Effects
  useEffect(() => {
    if (apartments.length) setFiltered(apartments);
  }, [apartments]);

  // Handlers
  const handleDeleteApartment = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      background: '#1f2937',
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteApartmentMutation.mutate(id);
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setNewApartment({...newApartment, image: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newApartment.apartment_no) newErrors.apartment_no = 'Required';
    if (!newApartment.floor_no) newErrors.floor_no = 'Required';
    if (!newApartment.block_name) newErrors.block_name = 'Required';
    if (!newApartment.rent || isNaN(newApartment.rent)) newErrors.rent = 'Must be a valid number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateApartment = () => {
    if (!validateForm()) return;
    createApartmentMutation.mutate(newApartment);
  };

  const handleDeleteAgreement = (agreementId) => {
    Swal.fire({
      title: 'Cancel Agreement Request?',
      text: "This will delete your pending request",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it',
      background: '#1f2937',
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAgreementMutation.mutate(agreementId);
      }
    });
  };

  const handleAgreementClick = (apartment) => {
    if (!user) {
      Swal.fire({
        title: 'Login Required',
        text: 'You need to login to request an agreement',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel',
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280'
      }).then((result) => {
        if (result.isConfirmed) navigate('/login');
      });
      return;
    }
    setSelectedApartment(apartment);
    setShowAgreementModal(true);
  };

  const handleAgreementSubmit = async () => {
    if (!agreementForm.termsAccepted || !agreementForm.startDate || !agreementForm.endDate) {
      Swal.fire({
        title: 'Error',
        text: 'Please complete all required fields and accept terms.',
        icon: 'error',
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    setLoading(true);
    try {
      const exists = userAgreements.find(
        a => a.apartmentNo === selectedApartment.apartment_no &&
             a.block === selectedApartment.block_name &&
             a.floor === selectedApartment.floor_no
      );
      if (exists) {
        Swal.fire({
          title: 'Notice',
          text: `You already have a ${exists.status} agreement for this apartment.`,
          icon: 'info',
          background: '#1f2937',
          color: '#fff',
          confirmButtonColor: '#3b82f6'
        });
        return;
      }
      if (userAgreements.some(a => a.status === 'accepted')) {
        Swal.fire({
          title: 'Already Renting',
          text: 'You can only rent one apartment at a time.',
          icon: 'warning',
          background: '#1f2937',
          color: '#fff',
          confirmButtonColor: '#3b82f6'
        });
        return;
      }

      const agreementData = {
        userName: user.displayName,
        userEmail: user.email,
        userId: user.uid,
        apartmentId: selectedApartment._id,
        floor: selectedApartment.floor_no,
        block: selectedApartment.block_name,
        apartmentNo: selectedApartment.apartment_no,
        rent: selectedApartment.rent,
        status: 'pending',
        requestDate: new Date().toISOString(),
        startDate: agreementForm.startDate,
        endDate: agreementForm.endDate,
        specialRequests: agreementForm.specialRequests
      };

      await createAgreement(agreementData);
      await refetchAgreements();
      Swal.fire({
        title: 'Success!',
        text: 'Agreement request submitted.',
        icon: 'success',
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
      setShowAgreementModal(false);
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.error || 'Failed to submit agreement',
        icon: 'error',
        background: '#1f2937',
        color: '#fff',
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setLoading(false);
    }
  };

  const getButtonState = (apt) => {
    if (agreementsLoading) {
      return {
        text: 'Loading...',
        className: 'btn btn-ghost btn-block',
        disabled: true,
        icon: <LoaderPinwheelIcon className="w-5 h-5 mr-2 animate-spin" />
      };
    }

    if (apt.status === 'unavailable') {
      return { 
        text: 'Unavailable', 
        className: 'btn btn-error btn-block text-white shadow-lg hover:shadow-error/50', 
        disabled: true, 
        tooltip: 'This apartment is not available for rent',
        icon: <XCircleIcon className="w-5 h-5 mr-2" />
      };
    }
    
    if (!user) return { 
      text: 'Login to Request', 
      className: 'btn btn-soft btn-warning btn-block text-white shadow-lg hover:shadow-primary/50', 
      disabled: false, 
      tooltip: 'Login to request agreement',
      icon: <HomeIcon className="w-5 h-5 mr-2" />
    };
    
    const exist = userAgreements.find(a => 
      a.apartmentNo === apt.apartment_no && 
      a.block === apt.block_name && 
      a.floor === apt.floor_no
    );
    
    if (exist) {
      const btnStyle = exist.status === 'accepted' ? 'btn-success' : 
                      exist.status === 'pending' ? 'btn-warning' : 'btn-error';
      const icon = exist.status === 'accepted' ? <CheckCircleIcon className="w-5 h-5 mr-2" /> : 
                   exist.status === 'pending' ? <ClockIcon className="w-5 h-5 mr-2" /> : 
                   <XCircleIcon className="w-5 h-5 mr-2" />;
      
      return { 
        text: exist.status.charAt(0).toUpperCase() + exist.status.slice(1), 
        className: `btn ${btnStyle} btn-block text-white shadow-lg hover:shadow-${btnStyle}/50`, 
        disabled: exist.status !== 'pending',
        tooltip: exist.status,
        icon,
        agreementId: exist._id,
        isPending: exist.status === 'pending'
      };
    }
    
    if (userAgreements.some(a => a.status === 'accepted')) return { 
      text: 'Already Renting', 
      className: 'btn btn-info btn-block text-white shadow-lg hover:shadow-info/50', 
      disabled: true, 
      tooltip: 'Only one apartment allowed',
      icon: <HomeIcon className="w-5 h-5 mr-2" />
    };
    
    return { 
      text: 'Request Agreement', 
      className: 'btn btn-primary btn-block text-white shadow-lg hover:shadow-primary/50', 
      disabled: false, 
      tooltip: 'Click to request agreement',
      icon: <CalendarIcon className="w-5 h-5 mr-2" />
    };
  };

  const handleSearch = () => {
    const filtered = apartments.filter(
      apt => (!minRent || apt.rent >= +minRent) && (!maxRent || apt.rent <= +maxRent)
    );
    setFiltered(filtered);
    setCurrentPage(1);
  };

  // Pagination calculations
  const lastIndex = currentPage * apartmentsPerPage;
  const currentApartments = filtered.slice(lastIndex - apartmentsPerPage, lastIndex);
  const totalPages = Math.ceil(filtered.length / apartmentsPerPage);

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <LoaderPinwheelIcon className="w-16 h-16 text-primary" />
      </motion.div>
    </div>
  );
  
  if (error) return (
    <div className="alert alert-error shadow-lg max-w-2xl mx-auto mt-10">
      <div>
        <XCircleIcon className="w-6 h-6" />
        <span>{error.message}</span>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-xl p-6 mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <HomeIcon className="w-8 h-8 mr-3 text-primary" />
            Available Apartments
            {user?.role === 'admin' && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="ml-auto btn btn-primary flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                Create Apartment
              </motion.button>
            )}
          </h1>
          
          {/* Search Filters */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <div className="relative flex-1">
              <DollarSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="number" 
                placeholder="Min Rent" 
                value={minRent} 
                onChange={e => setMinRent(e.target.value)} 
                className="input input-bordered w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/50" 
              />
            </div>
            <div className="relative flex-1">
              <DollarSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="number" 
                placeholder="Max Rent" 
                value={maxRent} 
                onChange={e => setMaxRent(e.target.value)} 
                className="input input-bordered w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/50" 
              />
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary text-white shadow-lg hover:shadow-primary/50 px-6 py-3 rounded-lg flex items-center"
              onClick={handleSearch}
            >
              <SearchIcon className="w-5 h-5 mr-2" />
              Search
            </motion.button>
          </div>
        </motion.div>

        {/* Apartments List */}
        {filtered.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-8 text-center"
          >
            <div className="text-gray-500 text-lg mb-4">No apartments match your search criteria</div>
            <button 
              onClick={() => {
                setMinRent('');
                setMaxRent('');
                setFiltered(apartments);
              }}
              className="btn btn-outline btn-primary"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentApartments.map((apt, index) => {
                const btn = getButtonState(apt);
                return (
                  <motion.div 
                    key={apt._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
                  >
                    {user?.role === 'admin' && (
                      <div className="absolute top-2 left-2 flex gap-2 z-10">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApartment(apt);
                            setShowEditModal(true);
                          }}
                          className="btn btn-sm btn-circle btn-warning text-white"
                          title="Edit Apartment"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteApartment(apt._id);
                          }}
                          className="btn btn-sm btn-circle btn-error text-white"
                          title="Delete Apartment"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <figure className="relative">
                      <img 
                        src={apt.image || '/default-apartment.jpg'} 
                        alt="Apartment" 
                        className="h-60 w-full object-cover transition-transform duration-500 hover:scale-105" 
                      />
                      <div className="absolute top-4 right-4 badge badge-warning text-white shadow-lg">
                        {apt.rent}৳/month
                      </div>
                    </figure>
                    <div className="card-body p-6">
                      <h2 className="card-title text-2xl font-bold text-gray-800">
                        Apartment {apt.apartment_no}
                      </h2>
                      
                      <div className="space-y-2 text-gray-600">
                        <div className="flex items-center">
                          <LayersIcon className="w-5 h-5 mr-2 text-primary" />
                          <span>Floor: {apt.floor_no}</span>
                        </div>
                        <div className="flex items-center">
                          <Building className="w-5 h-5 mr-2 text-primary" />
                          <span>Block: {apt.block_name}</span>
                        </div>
                        <div className="flex items-center">
                          {apt.status === 'available' ? (
                            <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />
                          ) : (
                            <XCircleIcon className="w-5 h-5 mr-2 text-red-500" />
                          )}
                          <span className={apt.status === 'available' ? 'text-green-500' : 'text-red-500'}>
                            {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="card-actions mt-4">
                        <motion.button 
                          whileHover={!btn.disabled ? { scale: 1.03 } : {}}
                          whileTap={!btn.disabled ? { scale: 0.97 } : {}}
                          onClick={() => apt.status === 'available' && handleAgreementClick(apt)} 
                          className={btn.className}
                          disabled={btn.disabled} 
                          title={btn.tooltip}
                        >
                          {btn.icon}
                          {btn.text}
                        </motion.button>
                        {btn.isPending && (
                          <motion.button 
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleDeleteAgreement(btn.agreementId)}
                            className="btn btn-error btn-block text-white shadow-lg hover:shadow-error/50"
                            title="Cancel this request"
                          >
                            <TrashIcon className="w-5 h-5 mr-2" />
                            Cancel Request
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-10 flex justify-center"
              >
                <div className="btn-group">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="btn btn-outline"
                  >
                    «
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`btn ${currentPage === pageNum ? 'btn-active' : 'btn-outline'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="btn btn-outline"
                  >
                    »
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Create Apartment Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <PlusIcon className="w-6 h-6 text-primary" />
                  Create New Apartment
                </h2>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-circle btn-ghost"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apartment Image</label>
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-24 rounded-lg bg-gray-100">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="object-cover h-full w-full" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <HomeIcon className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                    </div>
                    <label className="btn btn-outline">
                      Upload Image
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>

                {/* Form Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apartment Number*</label>
                  <input
                    type="text"
                    value={newApartment.apartment_no}
                    onChange={(e) => setNewApartment({...newApartment, apartment_no: e.target.value})}
                    className={`input input-bordered w-full ${errors.apartment_no ? 'input-error' : ''}`}
                    placeholder="e.g., A101"
                  />
                  {errors.apartment_no && <p className="mt-1 text-sm text-error">{errors.apartment_no}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Floor Number*</label>
                    <input
                      type="text"
                      value={newApartment.floor_no}
                      onChange={(e) => setNewApartment({...newApartment, floor_no: e.target.value})}
                      className={`input input-bordered w-full ${errors.floor_no ? 'input-error' : ''}`}
                      placeholder="e.g., 1"
                    />
                    {errors.floor_no && <p className="mt-1 text-sm text-error">{errors.floor_no}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Block Name*</label>
                    <input
                      type="text"
                      value={newApartment.block_name}
                      onChange={(e) => setNewApartment({...newApartment, block_name: e.target.value})}
                      className={`input input-bordered w-full ${errors.block_name ? 'input-error' : ''}`}
                      placeholder="e.g., Block A"
                    />
                    {errors.block_name && <p className="mt-1 text-sm text-error">{errors.block_name}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent*</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2">৳</span>
                      <input
                        type="number"
                        value={newApartment.rent}
                        onChange={(e) => setNewApartment({...newApartment, rent: e.target.value})}
                        className={`input input-bordered w-full pl-8 ${errors.rent ? 'input-error' : ''}`}
                        placeholder="e.g., 15000"
                      />
                    </div>
                    {errors.rent && <p className="mt-1 text-sm text-error">{errors.rent}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
                    <select
                      value={newApartment.status}
                      onChange={(e) => setNewApartment({...newApartment, status: e.target.value})}
                      className="select select-bordered w-full"
                    >
                      <option value="available">Available</option>
                      <option value="unavailable">Unavailable</option>
                      <option value="maintenance">Under Maintenance</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    className="btn btn-ghost"
                    disabled={createApartmentMutation.isLoading}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleCreateApartment}
                    className="btn btn-primary"
                    disabled={createApartmentMutation.isLoading}
                  >
                    {createApartmentMutation.isLoading ? (
                      <>
                        <LoaderPinwheelIcon className="w-5 h-5 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : 'Create Apartment'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Agreement Request Modal */}
        {showAgreementModal && selectedApartment && (
          <RequestAgreement
            loading={loading}
            handleAgreementSubmit={handleAgreementSubmit}
            setShowAgreementModal={setShowAgreementModal}
            setAgreementForm={setAgreementForm}
            selectedApartment={selectedApartment}
            agreementForm={agreementForm}
          />
        )}

        {/* Edit Apartment Modal */}
        {showEditModal && selectedApartment && (
          <EditApartmentModal
            apartment={selectedApartment}
            onClose={() => setShowEditModal(false)}
            onSave={() => {
              queryClient.invalidateQueries(['apartments']);
              setShowEditModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ApartmentsList;