
import React, { useState } from 'react';
import { X, Send, Calendar, MapPin, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const InquiryModal = () => {
  const { state, dispatch } = useAppContext();
  const { selectedPhotographer } = state;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    eventLocation: '',
    eventType: '',
    guestCount: '',
    budget: '',
    message: '',
    services: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const eventTypes = [
    'Maternity Shoot',
    'Newborn Photography',
    'Birthday Party',
    'Wedding',
    'Pre-Wedding',
    'Engagement',
    'Family Portrait',
    'Corporate Event',
    'Other'
  ];

  const services = [
    'Photography Only',
    'Videography Only',
    'Photography + Videography',
    'Photo Editing',
    'Same Day Edit',
    'Photo Album',
    'Digital Gallery'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => {
      handleClose();
    }, 3000);
  };

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_INQUIRY_MODAL' });
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      eventDate: '',
      eventLocation: '',
      eventType: '',
      guestCount: '',
      budget: '',
      message: '',
      services: []
    });
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center transition-all duration-300">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-800">Inquiry Sent!</h3>
          <p className="text-gray-600 mt-2">
            Your inquiry has been sent to <strong>{selectedPhotographer?.name}</strong>.
          </p>
          <button onClick={handleClose} className="mt-6 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Send Inquiry</h2>
            <p className="text-sm text-gray-500">Contact {selectedPhotographer?.name}</p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Photographer Info */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <img src={selectedPhotographer?.profilePic} alt={selectedPhotographer?.name} className="w-14 h-14 rounded-full object-cover" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{selectedPhotographer?.name}</h3>
              <p className="text-gray-500 text-sm">{selectedPhotographer?.tags?.[0] || selectedPhotographer?.styles?.[0]}</p>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{selectedPhotographer?.location}</span>
                <span>₹{selectedPhotographer?.price}/day</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-sm">
          {/* Personal Info */}
          <div>
            <h4 className="font-semibold text-lg text-gray-800 mb-3">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" value={formData.name} onChange={handleInputChange} required placeholder="Full Name *" className="input-field" />
              <input name="email" value={formData.email} onChange={handleInputChange} required type="email" placeholder="Email *" className="input-field" />
              <input name="phone" value={formData.phone} onChange={handleInputChange} required type="tel" placeholder="Phone *" className="input-field" />
              <select name="budget" value={formData.budget} onChange={handleInputChange} className="input-field">
                <option value="">Budget Range</option>
                <option value="under-10000">Under ₹10,000</option>
                <option value="10000-25000">₹10,000 - ₹25,000</option>
                <option value="25000-50000">₹25,000 - ₹50,000</option>
                <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                <option value="above-100000">Above ₹1,00,000</option>
              </select>
            </div>
          </div>

          {/* Event Info */}
          <div>
            <h4 className="font-semibold text-lg text-gray-800 mb-3">Event Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="eventDate" value={formData.eventDate} onChange={handleInputChange} required type="date" className="input-field" />
              <select name="eventType" value={formData.eventType} onChange={handleInputChange} required className="input-field">
                <option value="">Select Event Type</option>
                {eventTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
              <input name="eventLocation" value={formData.eventLocation} onChange={handleInputChange} required placeholder="Event Location *" className="input-field" />
              <input name="guestCount" value={formData.guestCount} onChange={handleInputChange} type="number" placeholder="Guest Count" className="input-field" />
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg text-gray-800 mb-3">Services Required</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {services.map(service => (
                <label key={service} className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50 transition cursor-pointer">
                  <input type="checkbox" checked={formData.services.includes(service)} onChange={() => handleServiceToggle(service)} className="accent-black" />
                  <span>{service}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Message */}
          <textarea name="message" value={formData.message} onChange={handleInputChange} rows={4} className="input-field resize-none" placeholder="Any additional details..." />

          {/* Buttons */}
          <div className="flex justify-end gap-4 border-t pt-4">
            <button type="button" onClick={handleClose} className="btn-secondary">Cancel</button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Inquiry</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InquiryModal;
