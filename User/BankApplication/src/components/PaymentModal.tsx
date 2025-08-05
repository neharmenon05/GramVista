import React, { useState } from 'react';
import { X, CreditCard, Shield, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { usePayment } from '../context/PaymentContext';

interface PaymentModalProps {
  experience: any;
  onClose: () => void;
}

const PaymentModal = ({ experience, onClose }: PaymentModalProps) => {
  const [paymentStep, setPaymentStep] = useState('review'); // review, processing, success, error
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const { verifyPayment } = usePayment();

  const handlePayment = async () => {
    setPaymentStep('processing');
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate payment verification
      const paymentId = `pay_${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
      const signature = `sig_${Date.now()}${Math.random().toString(36).substr(2, 10)}`;
      
      const verified = await verifyPayment(experience.orderId, paymentId, signature);
      
      if (verified) {
        setPaymentStep('success');
      } else {
        setPaymentStep('error');
      }
    } catch (error) {
      setPaymentStep('error');
    }
  };

  const renderReviewStep = () => (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {experience.experienceTitle}
        </h3>
        <p className="text-gray-600">{experience.location}</p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Base Price</span>
          <span>₹{experience.price.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Guests</span>
          <span>{experience.guests}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Duration</span>
          <span>{experience.duration} days</span>
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total Amount</span>
            <span>₹{experience.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Revenue Distribution</h4>
        <div className="space-y-2">
          {experience.stakeholders.map((stakeholder, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <span className="font-medium">{stakeholder.name}</span>
                <span className="text-sm text-gray-600 ml-2">({stakeholder.type})</span>
              </div>
              <div className="text-right">
                <span className="font-semibold">₹{Math.round(experience.totalAmount * stakeholder.share / 100).toLocaleString()}</span>
                <span className="text-sm text-gray-600 ml-1">({stakeholder.share}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Payment Method</h4>
        <div className="space-y-2">
          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="payment"
              value="razorpay"
              checked={paymentMethod === 'razorpay'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3"
            />
            <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
            <span>Razorpay (Card, UPI, NetBanking)</span>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-center p-3 bg-blue-50 rounded-lg mb-6">
        <Shield className="h-5 w-5 text-blue-600 mr-2" />
        <span className="text-sm text-blue-800">
          Your payment is secured by blockchain-verified smart contracts
        </span>
      </div>

      <button
        onClick={handlePayment}
        className="w-full bg-gradient-to-r from-green-600 to-amber-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-amber-700 transition-colors"
      >
        Pay ₹{experience.totalAmount.toLocaleString()}
      </button>
    </div>
  );

  const renderProcessingStep = () => (
    <div className="text-center py-8">
      <Clock className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment</h3>
      <p className="text-gray-600 mb-4">
        Your payment is being processed securely. Please wait...
      </p>
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          Smart contract is distributing funds to stakeholders automatically
        </p>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center py-8">
      <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
      <p className="text-gray-600 mb-6">
        Your booking has been confirmed and funds have been distributed to stakeholders.
      </p>
      
      <div className="bg-green-50 p-4 rounded-lg mb-6">
        <h4 className="font-semibold text-green-800 mb-2">Blockchain Transaction</h4>
        <p className="text-sm text-green-700 font-mono break-all">
          0xa1b2c3d4e5f6789abcdef01234567890abcdef01
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-green-600 to-amber-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-amber-700 transition-colors"
        >
          View Dashboard
        </button>
        <button
          onClick={onClose}
          className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Download Receipt
        </button>
      </div>
    </div>
  );

  const renderErrorStep = () => (
    <div className="text-center py-8">
      <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Failed</h3>
      <p className="text-gray-600 mb-6">
        There was an issue processing your payment. Please try again.
      </p>
      
      <div className="space-y-3">
        <button
          onClick={() => setPaymentStep('review')}
          className="w-full bg-gradient-to-r from-green-600 to-amber-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-amber-700 transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={onClose}
          className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {paymentStep === 'review' && 'Review & Pay'}
            {paymentStep === 'processing' && 'Processing'}
            {paymentStep === 'success' && 'Payment Successful'}
            {paymentStep === 'error' && 'Payment Failed'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          {paymentStep === 'review' && renderReviewStep()}
          {paymentStep === 'processing' && renderProcessingStep()}
          {paymentStep === 'success' && renderSuccessStep()}
          {paymentStep === 'error' && renderErrorStep()}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;