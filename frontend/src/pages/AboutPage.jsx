import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';

const team = [
  { name: 'Jane Doe', title: 'CEO & Co-Founder', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdGOyFEBX7bgCQqZqY31_ShhKpA2zgfdhmD11qU1X9WPpxc9AL5tOAKh-NKOyW5XOPlXLDeVcG37s8lqKZF3p17vWSqxtM3pkqFDxhUGCEpl4jc9cPDpGzPtOn3s-6C98Wbrh2VUHsLMbJp0S8b4_Y7O0tb4tStgAmvvRSpKjs1Zxh-zTVXY5d-9rliSLtV7BV7fofVFOLrBXjcF9f85jUP4cfRVPMOSEJY84uKuiNq4sABN79TF0CWr0RfL7E-9dJHfuFXj7DWw' },
  { name: 'John Smith', title: 'CTO & Co-Founder', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjHznO-qOZgszv5hW0d99LP3x8-IcqytPXjADilOT0VeOUQZPgUzGe8jwb9vmcJ7GPjfsv50ohhS3dDKLcxlnl6Udgt0tkY5j5cRzdgzX144WIANz9ke1kNRL3s3lgzsSBIaYzSc7Bg0xJH4rir1kkfT4Dr6fcla9sYKXb2YUigbfIzzYs5k-EkP7ygpVGXLiLGmIya3ukB3qHsBoOYnKvMPGCHXMqn3_RehNgUyGax0Og1drRhQRx6A6n3GA4XnAZQbrQphgr6g' },
  { name: 'Emily White', title: 'Head of Operations', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5lGDhEyIlFuQJ183M9A37lcNUNaGuEQdT8i3Hb2YbY4fwoUnlNuN6gpEfuTnEXHOexLcOIZOOFrz2llENaZn4Xua9OUcFk79biBv-KewZRaRhpqZPiXvkeKM4rJ7Cdkc7XJnmYP0H3BrzhqlA-D4sMq3G7hRSAG5UsFVUSVmpLnPzps3uL79XjAoBf67OGokpZB_o-Rrjn2xiSx2lOjqBORTNcPlToyvA1bfwvsv0bPq3Kq5fbk8r6v1TXZmQDpI5ZZiQDlO4mw' },
  { name: 'Michael Brown', title: 'Head of Marketing', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9TfYKEqZsGsU-zAstQIhWmoLfWgbnGaIk0U-ZQ64ank0chlSeJp9R3XPho1jZYh5EoboAAoNkWX9MgpUrEd73PbJONNSJYUHgj_8-NcebwVNBnYvuhnbCIU_0Zv24ywHOQeU1I_-6Ak8vwYdVMJS-N29NvfKITwv39WSUTE6ctvpPGJD0jrxqOLtdvxuNTWbZZAlE3tGsH3jonpdSx9V6lT5NO7Ia1CIw8uj9pHR5bJtDvNFPwKPaM39iqNKLLn3adrxXeHV3Tw' }
];

const stats = [
  { label: 'Successful Gigs Completed', value: '10k+' },
  { label: 'Client Satisfaction Rate', value: '98%' },
  { label: 'Active Gig Workers', value: '5,000+' }
];

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="flex flex-col min-h-screen bg-background-light text-text-light font-display">

        {/* Unit: Hero Section with Gradient Overlay */}
        <section className="relative bg-background-dark py-20 px-4 sm:px-6 lg:px-8 text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#005a9c] to-[#003d6b] opacity-90"></div>
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="Office meeting"
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 mt-16 text-shadow-md">
              About Quick Staff
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Connecting skilled professionals with businesses, seamlessly and efficiently. We are revolutionizing the gig economy, one job at a time.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-10 relative z-20">
          {/* Unit: Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl shadow-xl p-8 border border-gray-100 transform transition-transform hover:-translate-y-1">
                <div className="text-4xl font-black text-secondary mb-2">{stat.value}</div>
                <div className="text-subtle-light font-medium uppercase tracking-wide text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Unit: Our Journey */}
          <section className="mb-24">
            <div className="bg-white rounded-2xl shadow-sm border border-border-light overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
                  <h2 className="text-3xl font-bold mb-6 text-primary">Our Journey</h2>
                  <div className="space-y-4 text-subtle-light text-lg leading-relaxed">
                    <p>
                      Founded in 2021, Quick Staff Hiring Portal was born from a simple observation: the traditional hiring process was too slow for on-demand services. We bridge the gap between businesses needing immediate quality staff and skilled gig workers seeking flexible opportunities.
                    </p>
                    <p>
                      We leverage technology to create a trusted community where connections are instant and work gets done efficiently. Today, thousands of users find work and hire talent on their own terms.
                    </p>
                  </div>
                </div>
                <div className="relative h-64 md:h-auto order-1 md:order-2">
                  <img
                    alt="Workers Team"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLJd94Q3F3xSI8LUeqAMSI876PsjZ5qnD5XGmcOk_WQ5iNZXmp5yOHXWB_Bs_Naf_-WFGdxjIGoCUD5O0x_17RRskl3CG8nKaYnQnb8Sv2uBbi0NaHXmaJ6vyOyaCaawPGa57qssUEXYzst25EuhsNruaX_sgPbPm6Hgw1VDE0LfC_u9yC2YTPpshCAaLWanY9BEktseT27D1hiB2TZcsFz7GIpXg0gTdfAK15jbFK5yHiCbaVcEMyOyMXOMpboK9eGXeWaK2fvA"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Unit: Mission, Vision, Values */}
          <section className="mb-24 text-center">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Mission, Vision, and Values</h2>
              <p className="text-subtle-light max-w-2xl mx-auto text-lg">The principles that guide our every decision.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: 'rocket_launch', title: 'Our Mission', body: 'Empower individuals with flexible work and provide businesses reliable on-demand talent.' },
                { icon: 'visibility', title: 'Our Vision', body: 'Be the most trusted and efficient platform for connecting gig workers and clients.' },
                { icon: 'verified', title: 'Our Values', body: 'Trust, Efficiency, Empowerment, Community, and Innovation.' }
              ].map((item) => (
                <div key={item.title} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6 text-primary">
                    <span className="material-symbols-outlined text-4xl">{item.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-text-light">{item.title}</h3>
                  <p className="text-subtle-light leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Unit: Meet the Team */}
          <section className="mb-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Meet the Team</h2>
              <p className="text-subtle-light text-lg">The passionate minds behind Quick Staff Hiring Portal.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {team.map((person) => (
                <div key={person.name} className="flex flex-col items-center group">
                  <div className="w-40 h-40 mb-6 relative rounded-full overflow-hidden shadow-lg border-4 border-white group-hover:scale-105 transition-transform duration-300">
                    <img src={person.img} alt={person.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-lg font-bold text-text-light">{person.name}</h3>
                  <p className="text-primary font-medium text-sm">{person.title}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Unit: CTA */}
          <section className="bg-primary rounded-3xl p-12 text-center text-white shadow-2xl shadow-blue-900/20 mb-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Community</h2>
              <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                Whether you're hiring or finding gigs, get started today and experience the difference.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register/client" className="inline-flex items-center justify-center px-8 py-4 bg-secondary text-white rounded-xl font-bold text-lg hover:bg-green-600 transition-colors shadow-lg shadow-green-900/10">
                  I want to HIRE
                </Link>
                <Link to="/register/worker" className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg">
                  I want to WORK
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
