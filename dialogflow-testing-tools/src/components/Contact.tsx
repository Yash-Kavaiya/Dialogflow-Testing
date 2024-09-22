import React, { useState } from 'react';
import { Mail, Phone, MessageSquare } from 'lucide-react';

const ContactInfo: React.FC<{ icon: React.ReactNode; title: string; content: string }> = ({ icon, title, content }) => (
  <div className="flex items-center mb-4">
    <div className="text-blue-500 mr-4">{icon}</div>
    <div>
      <h3 className="font-semibold dark:text-white">{title}</h3>
      <p className="dark:text-gray-300">{content}</p>
    </div>
  </div>
);

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    businessSize: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    // Reset form or show success message
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Get in Touch</h2>
          <ContactInfo 
            icon={<Mail size={24} />}
            title="Email"
            content="support@dialogflowtesting.com"
          />
          <ContactInfo 
            icon={<Phone size={24} />}
            title="Phone"
            content="+1 (555) 123-4567"
          />
          <ContactInfo 
            icon={<MessageSquare size={24} />}
            title="Live Chat"
            content="Available 9 AM - 5 PM EST"
          />
          
          <h2 className="text-2xl font-bold mt-8 mb-6 dark:text-white">Business Solutions</h2>
          <p className="mb-4 dark:text-gray-300">
            Our enterprise-grade Dialogflow testing tools are designed to meet the needs of businesses of all sizes. 
            We offer customizable solutions that can be tailored to your specific requirements, including:
          </p>
          <ul className="list-disc list-inside mb-4 dark:text-gray-300">
            <li>Scalable testing for large-scale chatbot deployments</li>
            <li>Advanced analytics and reporting features</li>
            <li>Integration with your existing CI/CD pipeline</li>
            <li>Dedicated support and training for your team</li>
            <li>Custom feature development to meet your unique needs</li>
          </ul>
          <p className="dark:text-gray-300">
            Contact our sales team to discuss how we can help optimize your Dialogflow testing process.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Contact Form</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-1 dark:text-white">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 dark:text-white">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label htmlFor="company" className="block mb-1 dark:text-white">Company</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Acme Inc."
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            <div>
              <label htmlFor="businessSize" className="block mb-1 dark:text-white">Business Size</label>
              <select
                id="businessSize"
                name="businessSize"
                value={formData.businessSize}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="">Select size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201+">201+ employees</option>
              </select>
            </div>
            <div>
              <label htmlFor="subject" className="block mb-1 dark:text-white">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enterprise Solution Inquiry"
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-1 dark:text-white">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your Dialogflow testing needs..."
                rows={4}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              ></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;