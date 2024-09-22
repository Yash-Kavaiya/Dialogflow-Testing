import React from 'react';
import { Check, X } from 'lucide-react';

interface Feature {
  text: string;
  included: boolean;
}

interface PricingTierProps {
  name: string;
  price: number;
  features: Feature[];
  recommended?: boolean;
}

const PricingTier: React.FC<PricingTierProps> = ({ name, price, features, recommended = false }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${recommended ? 'border-4 border-blue-500' : ''}`}>
    {recommended && (
      <div className="bg-blue-500 text-white text-center py-2">
        Recommended
      </div>
    )}
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-4 dark:text-white">{name}</h3>
      <div className="text-4xl font-bold mb-4 dark:text-white">${price}<span className="text-lg font-normal">/month</span></div>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            {feature.included ? (
              <Check className="text-green-500 mr-2" size={20} />
            ) : (
              <X className="text-red-500 mr-2" size={20} />
            )}
            <span className={`${feature.included ? 'dark:text-white' : 'text-gray-500 dark:text-gray-400 line-through'}`}>{feature.text}</span>
          </li>
        ))}
      </ul>
      <button className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
        Choose Plan
      </button>
    </div>
  </div>
);

const Pricing: React.FC = () => {
  const plans: PricingTierProps[] = [
    {
      name: "Basic",
      price: 0,
      features: [
        { text: "Single agent testing", included: true },
        { text: "10 test runs per day", included: true },
        { text: "Basic analytics", included: true },
        { text: "Email support", included: true },
        { text: "Bulk testing", included: false },
        { text: "Custom integrations", included: false },
        { text: "Priority support", included: false },
      ],
    },
    {
      name: "Pro",
      price: 49,
      features: [
        { text: "Multiple agent testing", included: true },
        { text: "Unlimited test runs", included: true },
        { text: "Advanced analytics", included: true },
        { text: "Email & chat support", included: true },
        { text: "Bulk testing (CSV/JSON)", included: true },
        { text: "Custom integrations", included: false },
        { text: "Priority support", included: false },
      ],
      recommended: true,
    },
    {
      name: "Enterprise",
      price: 199,
      features: [
        { text: "Unlimited agent testing", included: true },
        { text: "Unlimited test runs", included: true },
        { text: "Advanced analytics & reporting", included: true },
        { text: "24/7 priority support", included: true },
        { text: "Bulk testing (CSV/JSON)", included: true },
        { text: "Custom integrations", included: true },
        { text: "Dedicated account manager", included: true },
      ],
    },
  ];

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">Choose Your Plan</h1>
      <p className="text-center text-xl mb-12 dark:text-gray-300">Select the perfect plan for your Dialogflow testing needs</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <PricingTier key={index} {...plan} />
        ))}
      </div>
      {/* Rest of the component remains the same */}
    </div>
  );
};

export default Pricing;