import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-[#f6f7f8] dark:bg-[#101c22] font-display text-[#212529] dark:text-[#f6f7f8]">
      <div className="layout-container flex h-full grow flex-col">
        <header className="sticky top-0 z-50 bg-[#f6f7f8]/80 dark:bg-[#101c22]/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between whitespace-nowrap px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-3">
            <Link to="/" className="flex items-center gap-4">
              <div className="size-6 text-[#005A9C]">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" fillRule="evenodd" fill="currentColor" />
                </svg>
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Quick Staff Hiring Portal</h2>
            </Link>
            <div className="hidden md:flex flex-1 justify-end gap-8">
              <div className="flex items-center gap-9">
                <Link to="/categories" className="text-sm font-medium leading-normal hover:text-[#005A9C] dark:hover:text-[#005A9C]">Staff Categories</Link>
                <Link to="/how-it-works" className="text-sm font-medium leading-normal hover:text-[#005A9C] dark:hover:text-[#005A9C]">How It Works</Link>
                <Link to="/about" className="text-sm font-medium leading-normal hover:text-[#005A9C] dark:hover:text-[#005A9C]">About Us</Link>
                {/* <Link to="/admin" className="text-sm font-medium leading-normal text-[#005A9C] hover:text-[#005A9C]/80">Admin Panel</Link> */}
              </div>
              <div className="flex gap-2">
                <Link to="/register" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#005A9C] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#005A9C]/90 transition-colors">
                  <span className="truncate">Sign Up</span>
                </Link>
                <Link to="/login" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-200 dark:bg-gray-700/50 text-[#212529] dark:text-[#f6f7f8] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                  <span className="truncate">Login</span>
                </Link>
              </div>
            </div>
          </div>
        </header>
        <main className="flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
            <section className="py-10 md:py-16 @container">
              <div className="@[480px]:p-4">
                <div className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4" 
                style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBLJd94Q3F3xSI8LUeqAMSI876PsjZ5qnD5XGmcOk_WQ5iNZXmp5yOHXWB_Bs_Naf_-WFGdxjIGoCUD5O0x_17RRskl3CG8nKaYnQnb8Sv2uBbi0NaHXmaJ6vyOyaCaawPGa57qssUEXYzst25EuhsNruaX_sgPbPm6Hgw1VDE0LfC_u9yC2YTPpshCAaLWanY9BEktseT27D1hiB2TZcsFz7GIpXg0gTdfAK15jbFK5yHiCbaVcEMyOyMXOMpboK9eGXeWaK2fvA")' }}>
                  <div className="flex flex-col gap-2 text-center max-w-3xl">
                    <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                      The Fastest Way to Hire On-Demand Staff
                    </h1>
                    <h2 className="text-white/90 text-base font-normal leading-normal @[480px]:text-lg @[480px]:font-normal @[480px]:leading-normal">
                      Connect with skilled gig workers or find your next job in minutes.
                    </h2>
                  </div>
                  <div className="flex-wrap gap-4 flex justify-center">
                    <Link to="/register/client" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#005A9C] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#005A9C]/90 transition-colors">
                      <span className="truncate">I want to HIRE</span>
                    </Link>
                    <Link to="/register/worker" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#f6f7f8] dark:bg-[#101c22] text-[#212529] dark:text-[#f6f7f8] text-base font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                      <span className="truncate">I want to WORK</span>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
            <section className="py-10 md:py-16">
              <h2 className="text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 text-center">How It Works</h2>
              <div className="flex flex-col gap-10 px-4 py-10 @container">
                <div className="flex flex-col gap-4 text-center items-center">
                  <h3 className="text-3xl font-bold leading-tight tracking-[-0.033em] max-w-2xl">A simple process to connect</h3>
                  <p className="text-base font-normal leading-normal max-w-2xl text-[#617c89] dark:text-[#a0b1b9]">
                    Our platform makes it easy for clients and gig workers to find each other quickly and efficiently.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-0">
                  <div className="flex flex-1 gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 flex-col text-center items-center">
                    <span className="material-symbols-outlined text-4xl text-[#005A9C]">person_add</span>
                    <div className="flex flex-col gap-1">
                      <h4 className="font-bold leading-tight text-lg">Create Profile / Post Job</h4>
                      <p className="text-sm font-normal leading-normal text-[#617c89] dark:text-[#a0b1b9]">Sign up in minutes and tell us what you're looking for or what skills you offer.</p>
                    </div>
                  </div>
                  <div className="flex flex-1 gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 flex-col text-center items-center">
                    <span className="material-symbols-outlined text-4xl text-[#005A9C]">search</span>
                    <div className="flex flex-col gap-1">
                      <h4 className="font-bold leading-tight text-lg">Browse & Connect</h4>
                      <p className="text-sm font-normal leading-normal text-[#617c89] dark:text-[#a0b1b9]">Search for available jobs or browse profiles of talented workers that fit your needs.</p>
                    </div>
                  </div>
                  <div className="flex flex-1 gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-6 flex-col text-center items-center">
                    <span className="material-symbols-outlined text-4xl text-[#005A9C]">task_alt</span>
                    <div className="flex flex-col gap-1">
                      <h4 className="font-bold leading-tight text-lg">Get Hired / Work Done</h4>
                      <p className="text-sm font-normal leading-normal text-[#617c89] dark:text-[#a0b1b9]">Securely message, agree on terms, and complete the job. It's that simple.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="py-10 md:py-16">
              <h2 className="text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-8 pt-5 text-center">Featured Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                  { icon: 'celebration', label: 'Event Staff' },
                  { icon: 'restaurant_menu', label: 'Hospitality' },
                  { icon: 'warehouse', label: 'Warehouse' },
                  { icon: 'security', label: 'Security' },
                  { icon: 'liquor', label: 'Bartenders' },
                  { icon: 'campaign', label: 'Promoters' },
                  { icon: 'cleaning_services', label: 'Cleaners' },
                  { icon: 'construction', label: 'General Labor' }
                ].map((cat) => (
                  <div key={cat.label} className="flex flex-col items-center gap-3 p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 transition-shadow hover:shadow-lg">
                    <span className="material-symbols-outlined text-4xl text-[#1DB954]">{cat.icon}</span>
                    <span className="text-base font-bold">{cat.label}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className="py-10 md:py-16">
              <h2 className="text-2xl md:text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-8 pt-5 text-center">What Our Users Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    quote: '"This platform is a lifesaver! I needed event staff on short notice and found three amazing people within an hour. Incredibly efficient."',
                    name: 'Sarah L.',
                    title: 'Event Planner',
                    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdGOyFEBX7bgCQqZqY31_ShhKpA2zgfdhmD11qU1X9WPpxc9AL5tOAKh-NKOyW5XOPlXLDeVcG37s8lqKZF3p17vWSqxtM3pkqFDxhUGCEpl4jc9cPDpGzPtOn3s-6C98Wbrh2VUHsLMbJp0S8b4_Y7O0tb4tStgAmvvRSpKjs1Zxh-zTVXY5d-9rliSLtV7BV7fofVFOLrBXjcF9f85jUP4cfRVPMOSEJY84uKuiNq4sABN79TF0CWr0RfL7E-9dJHfuFXj7DWw'
                  },
                  {
                    quote: '"As a gig worker, finding consistent jobs used to be tough. Now, my schedule is always full with great opportunities. The payment system is fast and secure."',
                    name: 'Mark Chen',
                    title: 'Freelance Bartender',
                    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjHznO-qOZgszv5hW0d99LP3x8-IcqytPXjADilOT0VeOUQZPgUzGe8jwb9vmcJ7GPjfsv50ohhS3dDKLcxlnl6Udgt0tkY5j5cRzdgzX144WIANz9ke1kNRL3s3lgzsSBIaYzSc7Bg0xJH4rir1kkfT4Dr6fcla9sYKXb2YUigbfIzzYs5k-EkP7ygpVGXLiLGmIya3ukB3qHsBoOYnKvMPGCHXMqn3_RehNgUyGax0Og1drRhQRx6A6n3GA4XnAZQbrQphgr6g'
                  },
                  {
                    quote: '"The quality of talent on Quick Staff is exceptional. We\'ve hired several warehouse workers who have become essential parts of our team."',
                    name: 'David R.',
                    title: 'Logistics Manager',
                    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5lGDhEyIlFuQJ183M9A37lcNUNaGuEQdT8i3Hb2YbY4fwoUnlNuN6gpEfuTnEXHOexLcOIZOOFrz2llENaZn4Xua9OUcFk79biBv-KewZRaRhpqZPiXvkeKM4rJ7Cdkc7XJnmYP0H3BrzhqlA-D4sMq3G7hRSAG5UsFVUSVmpLnPzps3uL79XjAoBf67OGokpZB_o-Rrjn2xiSx2lOjqBORTNcPlToyvA1bfwvsv0bPq3Kq5fbk8r6v1TXZmQDpI5ZZiQDlO4mw'
                  }
                ].map((testimonial) => (
                  <div key={testimonial.name} className="flex flex-col gap-4 p-6 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                    <p className="text-[#617c89] dark:text-[#a0b1b9] italic">{testimonial.quote}</p>
                    <div className="flex items-center gap-3">
                      <img className="w-12 h-12 rounded-full object-cover" alt={testimonial.name} src={testimonial.avatar} />
                      <div>
                        <div className="font-bold">{testimonial.name}</div>
                        <div className="text-sm text-[#617c89] dark:text-[#a0b1b9]">{testimonial.title}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
        <footer className="bg-gray-100 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider">Company</h3>
                <ul className="space-y-2">
                  <li><Link to="/about" className="text-base text-[#617c89] dark:text-[#a0b1b9] hover:text-[#005A9C] dark:hover:text-[#005A9C]">About Us</Link></li>
                  <li><Link to="/contact" className="text-base text-[#617c89] dark:text-[#a0b1b9] hover:text-[#005A9C] dark:hover:text-[#005A9C]">Contact</Link></li>
                  <li><Link to="/careers" className="text-base text-[#617c89] dark:text-[#a0b1b9] hover:text-[#005A9C] dark:hover:text-[#005A9C]">Careers</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider">Support</h3>
                <ul className="space-y-2">
                  <li><Link to="/faq" className="text-base text-[#617c89] dark:text-[#a0b1b9] hover:text-[#005A9C] dark:hover:text-[#005A9C]">FAQ</Link></li>
                  <li><Link to="/help-center" className="text-base text-[#617c89] dark:text-[#a0b1b9] hover:text-[#005A9C] dark:hover:text-[#005A9C]">Help Center</Link></li>
                  <li><Link to="/trust-safety" className="text-base text-[#617c89] dark:text-[#a0b1b9] hover:text-[#005A9C] dark:hover:text-[#005A9C]">Trust & Safety</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider">Legal</h3>
                <ul className="space-y-2">
                  <li><Link to="/privacy-policy" className="text-base text-[#617c89] dark:text-[#a0b1b9] hover:text-[#005A9C] dark:hover:text-[#005A9C]">Privacy Policy</Link></li>
                  <li><Link to="/terms-of-service" className="text-base text-[#617c89] dark:text-[#a0b1b9] hover:text-[#005A9C] dark:hover:text-[#005A9C]">Terms of Service</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider">Connect</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-[#617c89] dark:text-[#a0b1b9] hover:text-[#005A9C] dark:hover:text-[#005A9C]">
                    <span className="sr-only">Facebook</span>
                    <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fillRule="evenodd" /></svg>
                  </a>
                  <a href="#" className="text-[#617c89] dark:text-[#a0b1b9] hover:text-[#005A9C] dark:hover:text-[#005A9C]">
                    <span className="sr-only">Twitter</span>
                    <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8 text-center">
              <p className="text-base text-[#617c89] dark:text-[#a0b1b9]">© 2024 Quick Staff Hiring Portal. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
