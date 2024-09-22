import React from 'react';
import { Users, Target, Zap, Award, Github, Linkedin, Twitter, Youtube } from 'lucide-react';

const AboutSection: React.FC<{ icon: React.ReactNode; title: string; content: string }> = ({ icon, title, content }) => (
  <div className="flex flex-col items-center text-center mb-8">
    <div className="text-blue-500 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 dark:text-white">{title}</h3>
    <p className="dark:text-gray-300">{content}</p>
  </div>
);

const SocialLink: React.FC<{ href: string; icon: React.ReactNode; label: string }> = ({ href, icon, label }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 mr-4 mb-2">
    {icon}
    <span className="ml-2">{label}</span>
  </a>
);

const TeamMember: React.FC<{ name: string; role: string; bio: string }> = ({ name, role, bio }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
    <h3 className="text-xl font-semibold mb-2 dark:text-white">{name}</h3>
    <p className="text-blue-500 mb-2">{role}</p>
    <p className="dark:text-gray-300 mb-4">{bio}</p>
    <div className="flex flex-wrap">
      <SocialLink href="https://github.com/Yash-Kavaiya" icon={<Github size={20} />} label="GitHub" />
      <SocialLink href="https://www.linkedin.com/in/yashkavaiya/" icon={<Linkedin size={20} />} label="LinkedIn" />
      <SocialLink href="https://twitter.com/Yash_Kavaiya_" icon={<Twitter size={20} />} label="Twitter" />
      <SocialLink href="https://aspecta.id/u/Yash-Kavaiya" icon={<Youtube size={20} />} label="Aspecta" />
    </div>
  </div>
);

const About: React.FC = () => (
  <div className="container mx-auto mt-8 p-4">
    <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">About Dialogflow Testing Tools</h1>
    
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Our Mission</h2>
      <p className="text-lg mb-4 dark:text-gray-300">
        At Dialogflow Testing Tools, our mission is to empower developers and businesses to create 
        more efficient, accurate, and user-friendly chatbots. We believe that comprehensive testing 
        is the key to delivering exceptional conversational experiences.
      </p>
      <p className="text-lg mb-4 dark:text-gray-300">
        Our advanced testing tools for Dialogflow CX and ES are designed to streamline the chatbot 
        development process, helping you identify and resolve issues quickly, and ultimately 
        deliver better products to your users.
      </p>
    </section>

    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Why Choose Us?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AboutSection 
          icon={<Target size={48} />}
          title="Precision Testing"
          content="Our tools provide in-depth analysis of your Dialogflow agents, ensuring that every interaction is thoroughly tested and optimized."
        />
        <AboutSection 
          icon={<Zap size={48} />}
          title="Efficiency Boost"
          content="Automate your testing process and save countless hours of manual work, allowing your team to focus on improving the core functionality of your chatbots."
        />
        <AboutSection 
          icon={<Users size={48} />}
          title="Collaborative Platform"
          content="Our platform is designed for team collaboration, making it easy to share results, track improvements, and work together towards better chatbot performance."
        />
        <AboutSection 
          icon={<Award size={48} />}
          title="Industry Expertise"
          content="With years of experience in chatbot development and testing, our team brings unparalleled expertise to help you succeed in your conversational AI projects."
        />
      </div>
    </section>

    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Meet the Creator</h2>
      <div className="max-w-2xl mx-auto">
        <TeamMember 
          name="Yash Kavaiya"
          role="Founder & Developer"
          bio="Yash is a passionate developer with expertise in AI and chatbot technologies. With a deep understanding of Dialogflow and a commitment to improving chatbot development processes, Yash created Dialogflow Testing Tools to empower developers in building more efficient and reliable conversational AI solutions. Connect with Yash on social media to learn more about his work and stay updated on the latest developments in chatbot testing."
        />
      </div>
    </section>

    <section>
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Our Commitment</h2>
      <p className="text-lg mb-4 dark:text-gray-300">
        We are committed to continuous innovation and improvement. As the field of conversational AI 
        evolves, so do our tools. We actively seek feedback from our users and stay up-to-date with 
        the latest developments in Dialogflow and chatbot technology to ensure that we're always 
        providing the best possible testing solutions.
      </p>
      <p className="text-lg dark:text-gray-300">
        Choose Dialogflow Testing Tools and join a community of developers dedicated to creating 
        better, more efficient chatbots. Let's shape the future of conversational AI together!
      </p>
    </section>
  </div>
);

export default About;