import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { 
  Heart, 
  Salad, 
  Dumbbell, 
  Brain, 
  ChevronRight, 
  ArrowRight, 
  CheckCircle, 
  Camera, 
  Sparkles, 
  Lightbulb,
  BarChart,
  Zap,
  Bell,
  Lock
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    
    // Store the email for later use during signup
    localStorage.setItem('waitlistEmail', email);
    
    toast.success('Thanks for joining our waitlist!');
    setEmail('');
    
    // Redirect to signup page after a short delay
    setTimeout(() => {
      navigate('/signup');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          <Heart className="h-8 w-8 text-purple-600 mr-2" />
          <h1 className="text-2xl font-bold">Health Guardian</h1>
        </div>
        
        <nav className="hidden md:flex space-x-6 items-center">
          <Link to="/features" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Features
          </Link>
          <Link to="/pricing" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Pricing
          </Link>
          <Link to="/contact-us" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Contact
          </Link>
        </nav>
        
        <div className="flex space-x-3">
          <Link to="/login">
            <Button variant="outline">Log in</Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-purple-600 hover:bg-purple-700">Sign up</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto">
        <div className="lg:w-1/2 mb-12 lg:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Your Personal Health Guardian
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl">
            Track your health, nutrition, fitness, and mental wellness all in one place. 
            Powered by AI, Health Guardian helps you make smarter health decisions.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white py-6 px-8 rounded-lg text-lg"
              onClick={() => navigate('/signup')}
            >
              Get Started
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              className="py-6 px-8 rounded-lg text-lg"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
          <div className="mt-8 flex items-center">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-10 h-10 rounded-full bg-purple-${i * 100} border-2 border-white dark:border-gray-900 flex items-center justify-center text-white font-bold`}>
                  {i}
                </div>
              ))}
            </div>
            <p className="ml-4 text-sm text-gray-600 dark:text-gray-300">
              <span className="font-bold">5,000+</span> users tracking their health journey
            </p>
          </div>
        </div>
        <div className="lg:w-1/2 relative">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl p-1">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-2">
              <img 
                src="/assets/dashboard-preview.png" 
                alt="Health Guardian Dashboard" 
                className="rounded-2xl shadow-xl w-full"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/600x400/5046e5/ffffff?text=Health+Guardian+Dashboard';
                }}
              />
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">Smart Health Tracking</span>
            </div>
          </div>
          <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">AI Powered Insights</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-6 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Track your nutrition effortlessly in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                <Camera className="h-10 w-10 text-purple-600" />
              </div>
              <div className="bg-purple-600 text-white text-xs font-bold py-1 px-3 rounded-full mb-4">STEP 1</div>
              <h3 className="text-2xl font-bold mb-3">Take a Photo</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Simply snap a picture of your meal using the Health Guardian app. Our AI handles the rest.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="h-10 w-10 text-indigo-600" />
              </div>
              <div className="bg-indigo-600 text-white text-xs font-bold py-1 px-3 rounded-full mb-4">STEP 2</div>
              <h3 className="text-2xl font-bold mb-3">AI Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our advanced AI identifies the food and calculates detailed nutritional content with remarkable accuracy.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                <Lightbulb className="h-10 w-10 text-blue-600" />
              </div>
              <div className="bg-blue-600 text-white text-xs font-bold py-1 px-3 rounded-full mb-4">STEP 3</div>
              <h3 className="text-2xl font-bold mb-3">Get Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Receive personalized recommendations based on your goals, dietary preferences, and health metrics.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link to="/signup">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Try It Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Health Tracking</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Health Guardian combines multiple health aspects into one seamless experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Salad className="h-10 w-10 text-green-500" />}
              title="Nutrition Tracking"
              description="Scan food, track calories, and get personalized nutrition recommendations"
              color="green"
            />
            <FeatureCard 
              icon={<Dumbbell className="h-10 w-10 text-blue-500" />}
              title="Fitness Tracking"
              description="Log workouts, track progress, and celebrate your fitness achievements"
              color="blue"
            />
            <FeatureCard 
              icon={<Heart className="h-10 w-10 text-red-500" />}
              title="Health Vitals"
              description="Monitor blood pressure, heart rate, sleep quality and other vital signs"
              color="red"
            />
            <FeatureCard 
              icon={<Brain className="h-10 w-10 text-purple-500" />}
              title="Mental Wellness"
              description="Track mood, stress levels and get personalized wellness recommendations"
              color="purple"
            />
          </div>
          
          <div className="text-center mt-12">
            <Link to="/features">
              <Button className="bg-purple-600 hover:bg-purple-700">
                View All Features
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Health Guardian */}
      <section className="py-20 px-6 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Health Guardian</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the future of health management with our cutting-edge features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex">
              <div className="mr-4 flex-shrink-0">
                <Sparkles className="h-7 w-7 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">AI-Powered Health Assistant</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Chat with Mia, your personal health AI assistant, for instant answers to health questions and personalized recommendations.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 flex-shrink-0">
                <Camera className="h-7 w-7 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Smart Food Recognition</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Simply take a photo of your food and our AI instantly identifies it, providing accurate nutritional information.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 flex-shrink-0">
                <BarChart className="h-7 w-7 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Comprehensive Analytics</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Visualize your health data with intuitive charts and gain valuable insights into your progress over time.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 flex-shrink-0">
                <Zap className="h-7 w-7 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Personalized Recommendations</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Receive tailored suggestions for meals, exercises, and lifestyle changes based on your unique health profile.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 flex-shrink-0">
                <Bell className="h-7 w-7 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Smart Reminders</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Stay on track with intelligent reminders for meals, water intake, medication, and exercise routines.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 flex-shrink-0">
                <Lock className="h-7 w-7 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Privacy-First Approach</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your health data is encrypted and secure. We never share your information without your explicit consent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Waitlist</h2>
          <p className="text-xl mb-8">
            Be among the first to experience the future of personal health management
          </p>
          <form onSubmit={handleJoinWaitlist} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg py-6 px-4 flex-1 border-white/20 bg-white/10 text-white placeholder:text-white/70"
            />
            <Button type="submit" className="bg-white text-purple-600 hover:bg-gray-100 py-6 rounded-lg">
              Join Waitlist
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <Heart className="h-8 w-8 text-purple-600 mr-2" />
                <h1 className="text-2xl font-bold">Health Guardian</h1>
              </div>
              <p className="text-gray-600 dark:text-gray-300 max-w-xs">
                Your all-in-one health companion for a balanced lifestyle
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
              <div>
                <h3 className="font-bold mb-4">Product</h3>
                <ul className="space-y-2">
                  <FooterLink href="/features">Features</FooterLink>
                  <FooterLink href="/pricing">Pricing</FooterLink>
                  <FooterLink href="/contact-us">Contact</FooterLink>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Company</h3>
                <ul className="space-y-2">
                  <FooterLink href="/about">About Us</FooterLink>
                  <FooterLink href="/blog">Blog</FooterLink>
                  <FooterLink href="/careers">Careers</FooterLink>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <FooterLink href="/terms">Terms</FooterLink>
                  <FooterLink href="/privacy">Privacy</FooterLink>
                  <FooterLink href="/cookies">Cookies</FooterLink>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} Health Guardian. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <SocialLink href="#" aria-label="Twitter">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </SocialLink>
              <SocialLink href="#" aria-label="LinkedIn">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </SocialLink>
              <SocialLink href="#" aria-label="Instagram">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </SocialLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border-t-4 border-${color}-500`}>
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};

const FooterLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
  return (
    <li>
      <Link to={href} className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
        {children}
      </Link>
    </li>
  );
};

const SocialLink = ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <a 
      href={href} 
      className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      {...props}
    >
      {children}
    </a>
  );
};

export default LandingPage; 