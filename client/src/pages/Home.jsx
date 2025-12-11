import { Link } from 'react-router-dom';
import { Rocket, Briefcase, Users, TrendingUp, ArrowRight } from 'lucide-react';
import Background from '../components/common/Background';
import Navbar from '../components/common/Navbar';

const Home = () => {
  const features = [
    {
      icon: Briefcase,
      title: 'Thousands of Jobs',
      description: 'Access a wide range of job opportunities from top companies worldwide'
    },
    {
      icon: Users,
      title: 'Connect with Employers',
      description: 'Build direct connections with hiring managers and recruiters'
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Find opportunities that match your skills and help you grow'
    }
  ];

  return (
    <>
      <Background />
      <Navbar />
      
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <div className="min-h-[80vh] flex items-center justify-center text-center">
          <div className="max-w-4xl">
            <div className="mb-8 flex justify-center">
              <div className="p-4 bg-purple-500/20 rounded-full border border-purple-500/30">
                <Rocket className="w-16 h-16 text-purple-400" />
              </div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Your Future Starts Here
            </h1>
            
            <p className="text-xl md:text-2xl text-purple-300 mb-12 max-w-2xl mx-auto">
              Discover opportunities that match your skills and ambitions. Connect with top employers and take the next step in your career journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold transition-all text-lg flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/login"
                className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800/70 text-white border border-purple-500/30 hover:border-purple-500/50 rounded-lg font-semibold transition-all text-lg"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            Why Choose FutureJobs?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-900/60 backdrop-blur-lg border border-purple-500/20 rounded-xl p-8 hover:border-purple-500/50 transition-all hover:transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-purple-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 mb-20">
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-purple-300 mb-8">
              Join thousands of job seekers and employers on FutureJobs today
            </p>
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold transition-all text-lg"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;