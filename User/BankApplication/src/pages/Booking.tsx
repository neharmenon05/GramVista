import React, { useState } from 'react';
import { Calendar, MapPin, Users, IndianRupee, Clock, Star } from 'lucide-react';
import { usePayment } from '../context/PaymentContext';
import PaymentModal from '../components/PaymentModal';

const Booking = () => {
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    guests: 1,
    duration: 1,
  });
  const [showPayment, setShowPayment] = useState(false);
  const { createOrder } = usePayment();

  const experiences = [
    {
      id: 1,
      title: 'Himalayan Village Homestay',
      location: 'Kasol, Himachal Pradesh',
      price: 2500,
      duration: '2 days',
      rating: 4.8,
      reviews: 124,
      image: 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Experience authentic mountain life with local families',
      stakeholders: [
        { type: 'Homestay Host', name: 'Lakshmi Devi', share: 40 },
        { type: 'Local Guide', name: 'Rajesh Kumar', share: 25 },
        { type: 'Cook', name: 'Kamla Devi', share: 20 },
        { type: 'Cultural Performer', name: 'Folk Dance Group', share: 15 },
      ],
    },
    {
      id: 2,
      title: 'Rajasthani Desert Safari',
      location: 'Jaisalmer, Rajasthan',
      price: 3200,
      duration: '3 days',
      rating: 4.9,
      reviews: 89,
      image: 'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Camel safari with traditional music and desert camping',
      stakeholders: [
        { type: 'Camp Host', name: 'Mohammed Ali', share: 35 },
        { type: 'Camel Guide', name: 'Shankar Singh', share: 25 },
        { type: 'Musician', name: 'Manganiyar Group', share: 25 },
        { type: 'Cook', name: 'Fatima Bi', share: 15 },
      ],
    },
    {
      id: 3,
      title: 'Kerala Backwater Village',
      location: 'Alleppey, Kerala',
      price: 2800,
      duration: '2 days',
      rating: 4.7,
      reviews: 156,
      image: 'https://images.pexels.com/photos/12526337/pexels-photo-12526337.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Traditional houseboat stay with local fishing experience',
      stakeholders: [
        { type: 'Boat Owner', name: 'Krishnan Nair', share: 40 },
        { type: 'Fisherman Guide', name: 'Sunil Kumar', share: 30 },
        { type: 'Toddy Tapper', name: 'Ravi Menon', share: 20 },
        { type: 'Kathakali Artist', name: 'Gopinath', share: 10 },
      ],
    },
  ];

  const handleBooking = async (experience) => {
    const totalAmount = experience.price * bookingDetails.guests * bookingDetails.duration;
    const order = await createOrder({
      amount: totalAmount,
      experienceId: experience.id,
      experienceTitle: experience.title,
      guests: bookingDetails.guests,
      duration: bookingDetails.duration,
      date: bookingDetails.date,
      stakeholders: experience.stakeholders,
    });
    
    if (order) {
      setSelectedExperience({ ...experience, orderId: order.id, totalAmount });
      setShowPayment(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Book Your Rural Experience
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose from authentic rural experiences that directly benefit local communities
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Experience Cards */}
        <div className="lg:col-span-2 space-y-6">
          {experiences.map((experience) => (
            <div key={experience.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={experience.image}
                    alt={experience.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">{experience.title}</h3>
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-5 w-5 fill-current" />
                      <span className="ml-1 text-gray-700">{experience.rating} ({experience.reviews})</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{experience.location}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{experience.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{experience.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        <span className="font-semibold text-gray-900">₹{experience.price}/person</span>
                      </div>
                    </div>
                  </div>

                  {/* Stakeholders Preview */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Revenue Distribution:</h4>
                    <div className="flex flex-wrap gap-2">
                      {experience.stakeholders.map((stakeholder, index) => (
                        <div key={index} className="bg-green-50 px-2 py-1 rounded text-xs">
                          <span className="text-green-700">{stakeholder.type}</span>
                          <span className="text-gray-600 ml-1">({stakeholder.share}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleBooking(experience)}
                    className="w-full bg-gradient-to-r from-green-600 to-amber-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-amber-700 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={bookingDetails.date}
                  onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Users className="h-4 w-4 inline mr-1" />
                  Number of Guests
                </label>
                <select
                  value={bookingDetails.guests}
                  onChange={(e) => setBookingDetails({...bookingDetails, guests: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                >
                  {[1,2,3,4,5,6].map(num => (
                    <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Duration (Days)
                </label>
                <select
                  value={bookingDetails.duration}
                  onChange={(e) => setBookingDetails({...bookingDetails, duration: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                >
                  {[1,2,3,4,5,6,7].map(num => (
                    <option key={num} value={num}>{num} Day{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-amber-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Transparency Promise</h4>
              <p className="text-sm text-gray-600">
                100% of your payment is distributed fairly among local stakeholders. 
                Track your contribution impact in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showPayment && selectedExperience && (
        <PaymentModal
          experience={selectedExperience}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
};

export default Booking;