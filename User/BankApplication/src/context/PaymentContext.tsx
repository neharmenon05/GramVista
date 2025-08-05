import React, { createContext, useContext, useState } from 'react';

interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  status: 'created' | 'attempted' | 'paid' | 'failed';
  experienceId: number;
  experienceTitle: string;
  guests: number;
  duration: number;
  date: string;
  stakeholders: Array<{
    type: string;
    name: string;
    share: number;
  }>;
  createdAt: string;
  razorpayOrderId?: string;
  paymentId?: string;
  signature?: string;
}

interface PaymentContextType {
  orders: PaymentOrder[];
  createOrder: (orderData: Omit<PaymentOrder, 'id' | 'status' | 'createdAt' | 'currency'>) => Promise<PaymentOrder | null>;
  verifyPayment: (orderId: string, paymentId: string, signature: string) => Promise<boolean>;
  getOrder: (orderId: string) => PaymentOrder | undefined;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<PaymentOrder[]>([]);

  const createOrder = async (orderData: Omit<PaymentOrder, 'id' | 'status' | 'createdAt' | 'currency'>): Promise<PaymentOrder | null> => {
    try {
      // Simulate API call to create Razorpay order
      const orderId = `order_${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
      const razorpayOrderId = `rzp_${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
      
      const newOrder: PaymentOrder = {
        ...orderData,
        id: orderId,
        currency: 'INR',
        status: 'created',
        createdAt: new Date().toISOString(),
        razorpayOrderId,
      };

      setOrders(prev => [...prev, newOrder]);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  };

  const verifyPayment = async (orderId: string, paymentId: string, signature: string): Promise<boolean> => {
    try {
      // Simulate payment verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update order status
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'paid', paymentId, signature }
          : order
      ));

      // Simulate blockchain transaction logging
      console.log('Payment verified and logged to blockchain:', {
        orderId,
        paymentId,
        signature,
        timestamp: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error('Error verifying payment:', error);
      
      // Update order status to failed
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'failed' }
          : order
      ));
      
      return false;
    }
  };

  const getOrder = (orderId: string): PaymentOrder | undefined => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <PaymentContext.Provider value={{
      orders,
      createOrder,
      verifyPayment,
      getOrder,
    }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};