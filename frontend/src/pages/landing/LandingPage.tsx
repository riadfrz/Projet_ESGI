import Navbar from '@/components/layout/Navbar';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
           <div className="absolute top-20 left-1/2 w-[800px] h-[500px] bg-neon-blue/20 rounded-full blur-[120px] -translate-x-1/2" />
           <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-neon-purple/10 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge variant="accent" className="mb-6 animate-pulse">Next Gen Fitness</Badge>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight leading-tight">
            Level Up Your <span className="text-transparent bg-clip-text bg-linear-to-r from-neon-blue to-neon-purple">Performance</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            The ultimate platform for fitness challenges. Join gyms, compete with friends, and earn rewards in a futuristic gamified ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" href="/register">Start Your Journey</Button>
            <Button size="lg" variant="secondary" href="#features">Explore Features</Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Ecosystem Roles</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Designed for everyone involved in the fitness journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Client Card */}
            <Card hoverEffect className="relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
               </div>
               <h3 className="text-2xl font-bold mb-4 text-neon-blue">Clients</h3>
               <ul className="space-y-3 text-gray-300">
                 <li className="flex items-start"><span className="text-neon-blue mr-2">✓</span> Create & Join Challenges</li>
                 <li className="flex items-start"><span className="text-neon-blue mr-2">✓</span> Track Calories & Stats</li>
                 <li className="flex items-start"><span className="text-neon-blue mr-2">✓</span> Earn Badges & Rewards</li>
                 <li className="flex items-start"><span className="text-neon-blue mr-2">✓</span> Social Competition</li>
               </ul>
            </Card>

            {/* Gym Owner Card */}
            <Card hoverEffect className="relative overflow-hidden group border-neon-purple/30">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" /></svg>
               </div>
               <h3 className="text-2xl font-bold mb-4 text-neon-purple">Gym Owners</h3>
               <ul className="space-y-3 text-gray-300">
                 <li className="flex items-start"><span className="text-neon-purple mr-2">✓</span> Manage Gym Profile</li>
                 <li className="flex items-start"><span className="text-neon-purple mr-2">✓</span> Create Gym Challenges</li>
                 <li className="flex items-start"><span className="text-neon-purple mr-2">✓</span> Engage Members</li>
                 <li className="flex items-start"><span className="text-neon-purple mr-2">✓</span> Boost Visibility</li>
               </ul>
            </Card>

            {/* Super Admin Card */}
            <Card hoverEffect className="relative overflow-hidden group border-neon-cyan/30">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
               </div>
               <h3 className="text-2xl font-bold mb-4 text-neon-cyan">Super Admin</h3>
               <ul className="space-y-3 text-gray-300">
                 <li className="flex items-start"><span className="text-neon-cyan mr-2">✓</span> Approve Gyms</li>
                 <li className="flex items-start"><span className="text-neon-cyan mr-2">✓</span> Manage Exercises</li>
                 <li className="flex items-start"><span className="text-neon-cyan mr-2">✓</span> Configure Badges</li>
                 <li className="flex items-start"><span className="text-neon-cyan mr-2">✓</span> User Management</li>
               </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-neon-blue/10 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">Ready to Compete?</h2>
          <Button size="lg" className="px-12 py-4 text-xl">Join Now</Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
