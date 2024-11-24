/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
			// ------ Only for Dev Dashboard, plz don't delete. ------
  			'primary-blue': {
  				light: '#A5B4FC',
  				DEFAULT: '#6366F1',
  				dark: '#4338CA'
  			},
  			'primary-purple': {
  				light: '#C4B5FD',
  				DEFAULT: '#8B5CF6',
  				dark: '#6D28D9'
  			},
			'primary-accent': {
          		light: "#818CF8",
          		DEFAULT: "#4F46E5",
          		dark: "#3730A3",
        	},
			'primary-neutral': {
				light: "#E0E7FF",
				DEFAULT: "#CBD5E1",
				dark: "#94A3B8",
			},
			// ------ Only for Dev Dashboard, plz don't delete. ------

  			accent: {
  				'50': '#a8e6db',
  				'100': '#72cbbc',
  				'200': '#48ad9c',
  				'300': '#2c9785',
  				'400': '#128673',
  				'500': '#ffc96a',
  				'600': '#f66677',
  				'700': '#fcbbc0',
  				'800': '#f98b98',
  				'900': '#e44356',
  				'950': '#cb1b30',
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			neutral: {
  				light: '#E0E7FF',
  				DEFAULT: '#CBD5E1',
  				dark: '#94A3B8'
  			},
  			primary: {
  				'50': '#E1E8EF',
  				'100': '#D4DEE7',
  				'200': '#afc5e7',
  				'300': '#99B0C7',
  				'400': '#7c9ccf',
  				'500': '#5478b3',
  				'600': '#4C6B8A',
  				'700': '#3C546C',
  				'800': '#2C3D4F',
  				'900': '#1B2631',
  				'950': '#141C24',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		screens: {
			sm: '640px',
			md: '768px',
			lg: '1024px',
		},
	  },
	},
	plugins: [],
};

//   plugins: [require("tailwindcss-animate")],
