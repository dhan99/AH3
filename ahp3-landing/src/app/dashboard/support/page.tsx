'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMockAuth } from '@/components/MockAuthProvider';
import useStore from '@/store/useStore';

import {
  Header,
  MainNavigation
} from '@/components/dashboard';

export default function SupportPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout, user: authUser } = useMockAuth();
  const { user, setUser, setAuthenticated } = useStore();
  
  // Support state
  const [activeTab, setActiveTab] = useState('tickets');
  const [searchQuery, setSearchQuery] = useState('');
  
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

  // Mock support tickets data
  const tickets = [
    {
      id: 'TKT-2025-001',
      subject: 'Policy Coverage Question',
      status: 'Open',
      priority: 'Medium',
      category: 'Policy',
      createdDate: '03/15/2025',
      lastUpdated: '03/16/2025',
    },
    {
      id: 'TKT-2025-002',
      subject: 'Billing Discrepancy',
      status: 'In Progress',
      priority: 'High',
      category: 'Billing',
      createdDate: '03/12/2025',
      lastUpdated: '03/14/2025',
    },
    {
      id: 'TKT-2025-003',
      subject: 'Enrollment Process Assistance',
      status: 'Closed',
      priority: 'Low',
      category: 'Enrollment',
      createdDate: '03/01/2025',
      lastUpdated: '03/05/2025',
    },
  ];

  // Mock FAQ data
  const faqs = [
    {
      id: 1,
      question: 'How do I add drivers to my policy?',
      answer: 'To add drivers to your policy, navigate to the "Accounts" section, select your policy, and click on the "Drivers" tab. From there, click the "Add Driver" button and fill in the required information. Once submitted, our team will review the request and make the necessary updates to your policy within 24-48 hours.',
      category: 'Policy Management',
    },
    {
      id: 2,
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover) and ACH transfers directly from your bank account. You can manage your payment methods in the "Billing" section under "Payment Methods".',
      category: 'Billing',
    },
    {
      id: 3,
      question: 'How do I file a claim?',
      answer: 'Claims can be filed through the "Claims" section of your dashboard. Click on "Submit New Claim" and follow the guided process. You will need to provide details about the incident, upload any relevant documentation or photos, and submit for review. Our claims team will contact you within 24 hours to discuss next steps.',
      category: 'Claims',
    },
    {
      id: 4,
      question: 'What information is needed for a new submission?',
      answer: 'For a new submission, you will need your DOT number, MC number, company information, driver details, vehicle information, and loss history for the past 3 years. Having this information ready before starting will help streamline the submission process.',
      category: 'Submissions',
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
      <MainNavigation activeTab="support" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-[#333333]">Support</h1>
            
            <button 
              className="px-4 py-2 bg-[#007B87] text-white rounded-md hover:bg-[#005F6B] transition-colors"
              onClick={() => console.log('Create support ticket')}
            >
              Create Support Ticket
            </button>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex">
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'tickets'
                    ? 'border-[#007B87] text-[#007B87]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('tickets')}
              >
                My Tickets
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'faqs'
                    ? 'border-[#007B87] text-[#007B87]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('faqs')}
              >
                FAQs
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  activeTab === 'contact'
                    ? 'border-[#007B87] text-[#007B87]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('contact')}
              >
                Contact Us
              </button>
            </nav>
          </div>
          
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                className="block w-full pr-10 border-gray-300 rounded-md focus:ring-[#007B87] focus:border-[#007B87] pl-4 py-2"
                placeholder={activeTab === 'tickets' ? "Search tickets..." : "Search FAQs..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Tickets Tab */}
          {activeTab === 'tickets' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#F5F8FA]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket #</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#007B87]">{ticket.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ticket.status === 'Open' 
                            ? 'bg-blue-100 text-blue-800' 
                            : ticket.status === 'In Progress'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ticket.priority === 'High' 
                            ? 'bg-red-100 text-red-800' 
                            : ticket.priority === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.createdDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.lastUpdated}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button className="text-[#007B87] hover:text-[#005F6B] font-medium">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* FAQs Tab */}
          {activeTab === 'faqs' && (
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.id} className="bg-[#F5F8FA] p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-[#333333] mb-2">{faq.question}</h3>
                  <p className="text-gray-700 mb-2">{faq.answer}</p>
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {faq.category}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {/* Contact Us Tab */}
          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#F5F8FA] p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[#333333] mb-4">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-[#007B87] mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-900 font-medium">Phone Support</p>
                      <p className="text-gray-700">(800) 555-0123</p>
                      <p className="text-gray-500 text-sm">Monday - Friday, 8:00 AM - 8:00 PM EST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-[#007B87] mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-900 font-medium">Email Support</p>
                      <p className="text-gray-700">support@intactinsurance.com</p>
                      <p className="text-gray-500 text-sm">24/7 response within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-[#007B87] mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-900 font-medium">Live Chat</p>
                      <p className="text-gray-700">Available in your account</p>
                      <p className="text-gray-500 text-sm">Monday - Friday, 9:00 AM - 6:00 PM EST</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#F5F8FA] p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[#333333] mb-4">Your Account Manager</h3>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-lg">
                      JS
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-base font-medium text-gray-900">Jane Smith</h4>
                    <p className="text-sm text-gray-500">Senior Account Manager</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Email:</span> jane.smith@intactinsurance.com
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Direct Line:</span> (800) 555-8888
                      </p>
                      <button className="mt-2 px-3 py-1 text-sm text-[#007B87] border border-[#007B87] rounded-md hover:bg-[#f0f9fa]">
                        Schedule a Meeting
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 bg-[#F5F8FA] p-6 rounded-lg">
                <h3 className="text-lg font-medium text-[#333333] mb-4">Send Us a Message</h3>
                
                <form className="space-y-4">
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#007B87] focus:border-[#007B87]"
                      placeholder="What can we help you with?"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      id="category"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#007B87] focus:border-[#007B87]"
                    >
                      <option>Policy Question</option>
                      <option>Billing Issue</option>
                      <option>Claims Assistance</option>
                      <option>Technical Support</option>
                      <option>Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea
                      id="message"
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#007B87] focus:border-[#007B87]"
                      placeholder="Please describe your issue or question in detail..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="attachments" className="block text-sm font-medium text-gray-700">Attachments (Optional)</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4h-8m-12 4h.02M12 12h24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#007B87] hover:text-[#005F6B]">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, PDF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#007B87] hover:bg-[#005F6B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007B87]">
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
