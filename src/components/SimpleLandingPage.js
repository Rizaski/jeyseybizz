import React, {
    useState,
    useEffect
} from 'react';

const SimpleLandingPage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Jersey designs data
    const jerseyDesigns = [{
            id: 1,
            image: 'jersey-designs/Mockup24A001.jpg',
            title: 'Classic Blue Design',
            price: '$29.99'
        },
        {
            id: 2,
            image: 'jersey-designs/Mockup24A002.jpg',
            title: 'Modern Red Jersey',
            price: '$34.99'
        },
        {
            id: 3,
            image: 'jersey-designs/Mockup24A003.jpg',
            title: 'Elegant White',
            price: '$32.99'
        },
        {
            id: 4,
            image: 'jersey-designs/Mockup24A004.jpg',
            title: 'Bold Black Design',
            price: '$36.99'
        },
        {
            id: 5,
            image: 'jersey-designs/Mockup24A005.jpg',
            title: 'Vibrant Green',
            price: '$31.99'
        },
        {
            id: 6,
            image: 'jersey-designs/Mockup24A006.jpg',
            title: 'Royal Purple',
            price: '$33.99'
        },
        {
            id: 7,
            image: 'jersey-designs/Mockup24A007.jpg',
            title: 'Sunset Orange',
            price: '$30.99'
        },
        {
            id: 8,
            image: 'jersey-designs/Mockup24A008.jpg',
            title: 'Ocean Blue',
            price: '$35.99'
        },
        {
            id: 9,
            image: 'jersey-designs/Mockup24A009.jpg',
            title: 'Forest Green',
            price: '$32.99'
        },
        {
            id: 10,
            image: 'jersey-designs/Mockup24A010.jpg',
            title: 'Midnight Black',
            price: '$37.99'
        },
    ];

    // Auto-play functionality
    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % jerseyDesigns.length);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [isPlaying, jerseyDesigns.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % jerseyDesigns.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + jerseyDesigns.length) % jerseyDesigns.length);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    return ( <
        div className = "min-h-screen bg-white" > {
            /* Header */ } <
        header className = "flex justify-between items-center px-5 py-4 bg-white border-b border-gray-200" >
        <
        img src = "public/logo.png"
        alt = "Otomono Logo"
        className = "h-10 w-30" /
        >
        <
        div className = "flex gap-4" >
        <
        button className = "p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors" >
        <
        svg className = "w-6 h-6 text-blue-600"
        fill = "none"
        stroke = "currentColor"
        viewBox = "0 0 24 24" >
        <
        path strokeLinecap = "round"
        strokeLinejoin = "round"
        strokeWidth = {
            2
        }
        d = "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" / >
        <
        /svg> <
        /button> <
        button className = "p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors" >
        <
        svg className = "w-6 h-6 text-blue-600"
        fill = "none"
        stroke = "currentColor"
        viewBox = "0 0 24 24" >
        <
        path strokeLinecap = "round"
        strokeLinejoin = "round"
        strokeWidth = {
            2
        }
        d = "M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" / >
        <
        /svg> <
        /button> <
        /div> <
        /header>

        {
            /* Hero Section */ } <
        section className = "px-5 py-8 text-center" >
        <
        h1 className = "text-4xl font-bold text-blue-600 mb-3" >
        Premium Jersey Designs <
        /h1> <
        p className = "text-gray-600 text-lg mb-8 max-w-2xl mx-auto" >
        Custom designs, quality printing, and fast delivery
        for all your jersey needs <
        /p>

        {
            /* Reel Style Slider */ } <
        div className = "max-w-4xl mx-auto" >
        <
        div className = "relative" >
        <
        div className = "relative w-full h-96 rounded-2xl overflow-hidden bg-gray-100" >
        <
        img src = {
            jerseyDesigns[currentSlide].image
        }
        alt = {
            jerseyDesigns[currentSlide].title
        }
        className = "w-full h-full object-cover" /
        >

        {
            /* Slider Controls */ } <
        button onClick = {
            prevSlide
        }
        className = "absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-3 text-white hover:bg-opacity-70 transition-all" >
        <
        svg className = "w-6 h-6"
        fill = "none"
        stroke = "currentColor"
        viewBox = "0 0 24 24" >
        <
        path strokeLinecap = "round"
        strokeLinejoin = "round"
        strokeWidth = {
            2
        }
        d = "M15 19l-7-7 7-7" / >
        <
        /svg> <
        /button>

        <
        button onClick = {
            nextSlide
        }
        className = "absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-3 text-white hover:bg-opacity-70 transition-all" >
        <
        svg className = "w-6 h-6"
        fill = "none"
        stroke = "currentColor"
        viewBox = "0 0 24 24" >
        <
        path strokeLinecap = "round"
        strokeLinejoin = "round"
        strokeWidth = {
            2
        }
        d = "M9 5l7 7-7 7" / >
        <
        /svg> <
        /button>

        {
            /* Play/Pause Button */ } <
        button onClick = {
            togglePlay
        }
        className = "absolute top-4 right-4 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition-all" >
        <
        svg className = "w-5 h-5"
        fill = "currentColor"
        viewBox = "0 0 24 24" >
        <
        path d = "M8 5v14l11-7z" / >
        <
        /svg> <
        /button>

        {
            /* Slide Indicators */ } <
        div className = "absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2" > {
            jerseyDesigns.map((_, index) => ( <
                button key = {
                    index
                }
                onClick = {
                    () => setCurrentSlide(index)
                }
                className = {
                    `w-2 h-2 rounded-full transition-all ${
                      index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`
                }
                />
            ))
        } <
        /div> <
        /div>

        {
            /* Slide Info */ } <
        div className = "mt-5 text-center" >
        <
        h3 className = "text-xl font-semibold text-gray-800 mb-1" > {
            jerseyDesigns[currentSlide].title
        } <
        /h3> <
        p className = "text-lg font-bold text-blue-600" > {
            jerseyDesigns[currentSlide].price
        } <
        /p> <
        /div> <
        /div> <
        /div> <
        /section>

        {
            /* Features Section */ } <
        section className = "px-5 py-10 bg-gray-50" >
        <
        h2 className = "text-3xl font-bold text-gray-800 text-center mb-8" >
        Why Choose Otomono ?
        <
        /h2> <
        div className = "max-w-6xl mx-auto grid md:grid-cols-3 gap-6" >
        <
        div className = "bg-white p-6 rounded-2xl shadow-sm text-center" >
        <
        div className = "w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4" >
        <
        svg className = "w-6 h-6 text-green-600"
        fill = "none"
        stroke = "currentColor"
        viewBox = "0 0 24 24" >
        <
        path strokeLinecap = "round"
        strokeLinejoin = "round"
        strokeWidth = {
            2
        }
        d = "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" / >
        <
        /svg> <
        /div> <
        h3 className = "text-lg font-semibold text-gray-800 mb-3" > Premium Quality < /h3> <
        p className = "text-gray-600" >
        High - quality materials and professional printing techniques <
        /p> <
        /div>

        <
        div className = "bg-white p-6 rounded-2xl shadow-sm text-center" >
        <
        div className = "w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4" >
        <
        svg className = "w-6 h-6 text-green-600"
        fill = "none"
        stroke = "currentColor"
        viewBox = "0 0 24 24" >
        <
        path strokeLinecap = "round"
        strokeLinejoin = "round"
        strokeWidth = {
            2
        }
        d = "M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" / >
        <
        /svg> <
        /div> <
        h3 className = "text-lg font-semibold text-gray-800 mb-3" > Fast Delivery < /h3> <
        p className = "text-gray-600" >
        Quick turnaround times with reliable shipping <
        /p> <
        /div>

        <
        div className = "bg-white p-6 rounded-2xl shadow-sm text-center" >
        <
        div className = "w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4" >
        <
        svg className = "w-6 h-6 text-green-600"
        fill = "none"
        stroke = "currentColor"
        viewBox = "0 0 24 24" >
        <
        path strokeLinecap = "round"
        strokeLinejoin = "round"
        strokeWidth = {
            2
        }
        d = "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" / >
        <
        /svg> <
        /div> <
        h3 className = "text-lg font-semibold text-gray-800 mb-3" > Custom Designs < /h3> <
        p className = "text-gray-600" >
        Personalized jerseys tailored to your specifications <
        /p> <
        /div> <
        /div> <
        /section>

        {
            /* CTA Section */ } <
        section className = "px-5 py-10 bg-blue-600 text-center" >
        <
        h2 className = "text-3xl font-bold text-white mb-3" >
        Ready to Get Started ?
        <
        /h2> <
        p className = "text-blue-100 text-lg mb-8 max-w-2xl mx-auto" >
        Browse our collection and create your perfect jersey today <
        /p> <
        button className = "bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg" >
        Shop Now <
        /button> <
        /section> <
        /div>
    );
};

export default SimpleLandingPage;