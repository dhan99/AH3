'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/components/MockAuthProvider';
import useStore from '@/store/useStore';

import {
  Header,
  MainNavigation
} from '@/components/dashboard';

export default function BillingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout, user: authUser } = useMockAuth();
  const { user, setUser, setAuthenticated } = useStore();
  
  // Billing state
  const [activeTab, setActiveTab] = useState('invoices');
  
  // Sync auth user with store
  useEffect(() => {
    if (authUser && isAuthenticated) {
      setUser(authUser);
      setAuthenticated(true);
    }
  }, [authUser, isAuthenticated, setUser, setAuthenticated]);

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  // Mock invoices data
  const invoices = [
    {
      id: 'INV-2025-001',
      policyNumber: 'POL-123456',
      company: 'Very Good Trucking',
      amount: '$12,500.00',
      status: 'Paid',
      dueDate: '02/15/2025',
      issuedDate: '01/15/2025',
      paidDate: '02/10/2025',
    },
    {
      id: 'INV-2025-002',
      policyNumber: 'POL-789012',
      company: 'Great Trucking',
      amount: '$18,750.00',
      status: 'Outstanding',
      dueDate: '04/15/2025',
      issuedDate: '03/15/2025',
      paidDate: '-',
    },
    {
      id: 'INV-2025-003',
      policyNumber: 'POL-345678',
      company: 'Excellent Trucking',
      amount: '$15,200.00',
      status: 'Overdue',
      dueDate: '03/01/2025',
      issuedDate: '02/01/2025',
      paidDate: '-',
    },
  ];

  // Mock payment methods data
  const paymentMethods = [
    {
      id: 1,
      type: 'Credit Card',
      lastFour: '4242',
      expiryDate: '05/27',
      isDefault: true,
    },
    {
      id: 2,
      type: 'ACH',
      accountLastFour: '6789',
      routingNumber: '********1234',
      isDefault: false,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Loading...</h1>
          <div className="w-16 h-16 border-4 border-[#007B87] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header user={user} onLogout={handleLogout} />
      
      {/* Main Navigation */}
      <MainNavigation activeTab="billing" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-[#333333]">Billing</h1>
            
            <button 
              className="px-4 py-2 bg-[#007B87] text-white rounded-md hover:bg-[#005F6B] transition-colors"
              onClick={() => console.log('Make a payment')}
            >
              Make a Payment
            </button>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex">
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'invoices'
                    ? 'border-[#007B87] text-[#007B87]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('invoices')}
              >
                Invoices
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'paymentMethods'
                    ? 'border-[#007B87] text-[#007B87]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('paymentMethods')}
              >
                Payment Methods
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'paymentHistory'
                    ? 'border-[#007B87] text-[#007B87]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('paymentHistory')}
              >
                Payment History
              </button>
            </nav>
          </div>
          
          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#F5F8FA]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy #</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#007B87]">{invoice.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.policyNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.company}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          invoice.status === 'Paid' 
                            ? 'bg-green-100 text-green-800' 
                            : invoice.status === 'Outstanding'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.dueDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button className="text-[#007B87] hover:text-[#005F6B] font-medium mr-3">View</button>
                        {invoice.status !== 'Paid' && (
                          <button className="text-[#007B87] hover:text-[#005F6B] font-medium">Pay</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Payment Methods Tab */}
          {activeTab === 'paymentMethods' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="border rounded-lg p-6 relative">
                    {method.isDefault && (
                      <span className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        Default
                      </span>
                    )}
                    <div className="flex items-start mb-4">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-[#F5F8FA] rounded-md">
                        {method.type === 'Credit Card' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#007B87]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#007B87]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 12h18M3 18h12" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{method.type}</h3>
                        {method.type === 'Credit Card' ? (
                          <p className="text-sm text-gray-500">
                            •••• {method.lastFour} | Expires {method.expiryDate}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Account ending in {method.accountLastFour}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      {!method.isDefault && (
                        <button className="text-sm text-[#007B87] hover:text-[#005F6B]">
                          Set as Default
                        </button>
                      )}
                      <button className="text-sm text-[#007B87] hover:text-[#005F6B]">
                        Edit
                      </button>
                      <button className="text-sm text-red-600 hover:text-red-800">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                className="px-4 py-2 border border-[#007B87] text-[#007B87] rounded-md hover:bg-[#f0f9fa] transition-colors"
                onClick={() => console.log('Add payment method')}
              >
                + Add Payment Method
              </button>
            </div>
          )}
          
          {/* Payment History Tab */}
          {activeTab === 'paymentHistory' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#F5F8FA]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">02/10/2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#007B87]">INV-2025-001</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$12,500.00</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Credit Card •••• 4242</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Successful
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button className="text-[#007B87] hover:text-[#005F6B] font-medium">Receipt</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">01/15/2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#007B87]">INV-2024-098</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$9,800.00</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">ACH •••• 6789</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Successful
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button className="text-[#007B87] hover:text-[#005F6B] font-medium">Receipt</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
