import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';

const categories = [
  {
    title: 'Drivers',
    desc: 'Reliable and professional drivers for any occasion.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyM8Y1vhqCF_MwHUEAqMFU42Jcyg2Mn7xUVahKhO1MuClrGlogQ1nGZaneclgjIVsogr1kvww4GD0huT77xVI8fi8zG3H1w7jeeB2bfh0ZBgORj7zl1GPQhYFnIr9SuZBcM5MacKVvgaX24zX3oMkVzQgc-lR8WPU_5aHoS9P0olya1OLlcW_uVLzDIKzwTjG0vs7zl55YB38hlIaYPqUi5V8WldiFE-2grhQLrP7NsOttASIkxO14Ns5PfCDxn08Pq9MUegZ3ig'
  },
  {
    title: 'Cooks',
    desc: 'Experienced cooks for your home or events.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC134eQBux76MOIS_Izx9oXXPi0xIp3_wXriW7IQxclVdL9xwjtA1kh72V3vKLvAkdrN7LsJg1cpXF6WCTheBgca41lFyX1pTxyJABmOpoRvFwqk9YyykZzelp7ibb_Ov081lxzohvIbVmXxa-CdQzwntcIr_vhsApocp04xWlS2vdybttRgZrSKIvHKiss2cvoYoi0vrxvCEe3q50Ew1UxR9Gf0FrdAnOCiQKiUCVn_X0t4j1Dj9WA8CQTVWeNUVMKx-Kwm7mVzQ'
  },
  {
    title: 'Gardeners',
    desc: 'Skilled gardeners to maintain your outdoor spaces.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADXBydA7-iKwNsYvyhCR7YdGUQ6HMMHtM8x6oIeEiO4H6xKllDbQ2ig3yMwVYJyMYfB0TQ2UPqCftZP-uitqwV4OHYHfKwEUx4dDj_VXPe-Vbo2DaUAPB5U3FBQDbAv-cyFjJv2qGInve8J-Lqa6QTNT2KwFumSA2eSunhJ_FvZvAkD92RuXKtHUdLKEdbHFovzh0yNhv7OiWuD4AzTbXpqs03zb6hHC1oRm1EFmdc0aqWhQml54BC7EW6EJueu-vx2MDKR5HYdw'
  },
  {
    title: 'Cleaners',
    desc: 'Thorough and efficient cleaning services.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqYBhkEqHb3pYn1wwn2mqxdMH84_y6-A0PBmivVes14Ya_79-aPeEL7vEAKF_voVyPhSY1yql3Xm4ovTEzfTejUrcuzTzez_GOPB4k7vIv3qdYbqB4F8Xn8tArJINNvXk-v9r5PIithkKjJxuNWnm-bNWaTGRjjCc5zZYLv23NlzF3lVyi5BHf510LzW4-gJ5fXZnyPBhgD1YFpNFwtbnauZAMk97_AGor_PRDryyh1k6orHxlZXqEgILyxfvAZt3SPaBwan9Mag'
  },
  {
    title: 'Handymen',
    desc: 'Expert help for repairs and maintenance tasks.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv_5tCkYAvRKIdYQCvQJokjeGim8MCT5hPrPcxorUp_xxLfmJarKD0Itpem0m3qGFs35HbocZhW4Jb1SqxctQFVIQwxIHbqbPXvrfLXzdO5HiuxhUFYWpFSF2F15rJ0-M9Fxyno1F-YD1_5I2WablDE4GCkTiJjrx7U5r47ohPqhKGv2xNT0_JQ7VfkkW4DeqDlz9dFeOqyuKPvBHtw8238gyYyjrKMy6Wi9sMFkHMrrvdcb_8thrF0Cogm_km9EMOPUKf9jTA6g'
  },
  {
    title: 'Electrician',
    desc: 'Safe and certified electrical services for your home.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpWxh-kjF5iSJC8WCa-gSFzWhSio2NcVlRRerfttS_r0M0mdYU5JSLoe32_FUh293h9AFisLfRPEntDlNaRsyUw4dSYkobRVo1kAntD2bK2n_bBnLTR0lQoB0Nh6HNtctJ1LDkyMYozSjZSK6FAkM7TzJo1QLy8wjGWRmdWyJ9p_4acjgM4ZzzD7ewW0lli2OfbeJ3Bck89MwdV4grAi-gSBKpH0k1j_rmRy6X4wqu7KoLQcdpp1BrURhF_vb5hVOWvi96M2tfWg'
  }
];

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter(cat =>
    cat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PublicLayout>
      <div className="flex flex-col min-h-screen bg-background-light text-text-light font-display">
        <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">

          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-primary">Find the Right Help, Right Now</h1>
            <p className="text-xl text-subtle-light max-w-2xl mx-auto leading-relaxed">
              Explore our categories to find the perfect gig worker for your needs. From quick fixes to big projects, we've got you covered.
            </p>
          </div>

          <div className="max-w-xl mx-auto mb-16 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-400">search</span>
            </div>
            <input
              type="text"
              placeholder="Search for a service, e.g., 'plumber'"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-blue-500/10 shadow-lg text-lg transition-all"
            />
          </div>

          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCategories.map((cat) => (
                <div key={cat.title} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 cursor-pointer">
                  <div className="aspect-video relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{cat.title}</h3>
                    <p className="text-subtle-light text-sm leading-relaxed">{cat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
              <p className="text-lg text-subtle-light">No categories found matching "{searchTerm}"</p>
            </div>
          )}
        </main>
      </div>
    </PublicLayout>
  );
}
