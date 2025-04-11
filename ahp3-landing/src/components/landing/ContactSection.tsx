'use client';

import { useState } from 'react';

export const ContactSection = () => {
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setMessage(text);
    setCharCount(text.length);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the form data to a server
    console.log({ email, topic, message });
    // Reset form
    setEmail('');
    setTopic('');
    setMessage('');
    setCharCount(0);
    alert('Thank you for your message. We will get back to you soon.');
  };
  
  return (
    <section className="w-full py-16 bg-[#00626B] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-light text-center mb-12 font-['Gibson']">
          Connect with us.
        </h2>
        
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-semibold text-base font-['IBM_Plex_Sans']">
              Your e-mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-3 border border-[#D8D8D8] rounded bg-transparent text-white font-['IBM_Plex_Sans']"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="topic" className="font-semibold text-base font-['IBM_Plex_Sans']">
              Topic
            </label>
            <div className="relative">
              <select
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                className="w-full p-3 border border-[#D8D8D8] rounded bg-transparent text-white appearance-none font-['IBM_Plex_Sans']"
              >
                <option value="" disabled className="bg-[#00626B]">Select a topic</option>
                <option value="quote" className="bg-[#00626B]">Request a quote</option>
                <option value="information" className="bg-[#00626B]">Product information</option>
                <option value="support" className="bg-[#00626B]">Customer support</option>
                <option value="other" className="bg-[#00626B]">Other</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.41 0.590088L6 5.17009L10.59 0.590088L12 2.00009L6 8.00009L0 2.00009L1.41 0.590088Z" fill="white"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <textarea
              id="message"
              value={message}
              onChange={handleMessageChange}
              placeholder="Share any details that you think are important."
              rows={5}
              maxLength={1200}
              className="w-full p-4 border border-[#D8D8D8] rounded bg-transparent text-white resize-none font-['IBM_Plex_Sans']"
            ></textarea>
            <div className="text-right text-m font-['IBM_Plex_Sans']">
              {charCount} / 1200
            </div>
          </div>
          
          <button
            type="submit"
            className="mx-auto border-2 border-white text-white font-semibold px-6 py-3 rounded hover:bg-white hover:text-[#00626B] transition-colors"
          >
            Deliver
          </button>
        </form>
      </div>
    </section>
  );
};
