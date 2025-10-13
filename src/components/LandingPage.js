import React, {
    useState,
    useEffect
} from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
} from 'react-native';
import {
    SafeAreaView
} from 'react-native-safe-area-context';
import {
    ChevronLeft,
    ChevronRight,
    Play,
    Star,
    ShoppingCart,
    Heart
} from 'lucide-react-native';

const {
    width: screenWidth
} = Dimensions.get('window');

const LandingPage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Jersey designs data - using public URLs for web compatibility
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
        SafeAreaView style = {
            styles.container
        } >
        <
        ScrollView showsVerticalScrollIndicator = {
            false
        } > {
            /* Header */ } <
        View style = {
            styles.header
        } >
        <
        Image source = {
            {
                uri: 'public/logo.png'
            }
        }
        style = {
            styles.logo
        }
        resizeMode = "contain" /
        >
        <
        View style = {
            styles.headerActions
        } >
        <
        TouchableOpacity style = {
            styles.headerButton
        } >
        <
        Heart size = {
            24
        }
        color = "#0052cc" / >
        <
        /TouchableOpacity> <
        TouchableOpacity style = {
            styles.headerButton
        } >
        <
        ShoppingCart size = {
            24
        }
        color = "#0052cc" / >
        <
        /TouchableOpacity> <
        /View> <
        /View>

        {
            /* Hero Section */ } <
        View style = {
            styles.heroSection
        } >
        <
        Text style = {
            styles.heroTitle
        } >
        Premium Jersey Designs <
        /Text> <
        Text style = {
            styles.heroSubtitle
        } >
        Custom designs, quality printing, and fast delivery
        for all your jersey needs <
        /Text>

        {
            /* Reel Style Slider */ } <
        View style = {
            styles.sliderContainer
        } >
        <
        View style = {
            styles.sliderWrapper
        } >
        <
        Image source = {
            {
                uri: jerseyDesigns[currentSlide].image
            }
        }
        style = {
            styles.sliderImage
        }
        resizeMode = "cover" /
        >

        {
            /* Slider Controls */ } <
        TouchableOpacity style = {
            styles.sliderButton
        }
        onPress = {
            prevSlide
        } >
        <
        ChevronLeft size = {
            24
        }
        color = "#fff" / >
        <
        /TouchableOpacity>

        <
        TouchableOpacity style = {
            [styles.sliderButton, styles.sliderButtonRight]
        }
        onPress = {
            nextSlide
        } >
        <
        ChevronRight size = {
            24
        }
        color = "#fff" / >
        <
        /TouchableOpacity>

        {
            /* Play/Pause Button */ } <
        TouchableOpacity style = {
            styles.playButton
        }
        onPress = {
            togglePlay
        } >
        <
        Play size = {
            20
        }
        color = "#fff" / >
        <
        /TouchableOpacity>

        {
            /* Slide Indicators */ } <
        View style = {
            styles.indicators
        } > {
            jerseyDesigns.map((_, index) => ( <
                View key = {
                    index
                }
                style = {
                    [
                        styles.indicator,
                        index === currentSlide && styles.activeIndicator
                    ]
                }
                />
            ))
        } <
        /View> <
        /View>

        {
            /* Slide Info */ } <
        View style = {
            styles.slideInfo
        } >
        <
        Text style = {
            styles.slideTitle
        } > {
            jerseyDesigns[currentSlide].title
        } < /Text> <
        Text style = {
            styles.slidePrice
        } > {
            jerseyDesigns[currentSlide].price
        } < /Text> <
        /View> <
        /View> <
        /View>

        {
            /* Features Section */ } <
        View style = {
            styles.featuresSection
        } >
        <
        Text style = {
            styles.sectionTitle
        } > Why Choose Otomono ? < /Text> <
        View style = {
            styles.featuresGrid
        } >
        <
        View style = {
            styles.featureCard
        } >
        <
        View style = {
            styles.featureIcon
        } >
        <
        Star size = {
            24
        }
        color = "#36b37e" / >
        <
        /View> <
        Text style = {
            styles.featureTitle
        } > Premium Quality < /Text> <
        Text style = {
            styles.featureDescription
        } >
        High - quality materials and professional printing techniques <
        /Text> <
        /View>

        <
        View style = {
            styles.featureCard
        } >
        <
        View style = {
            styles.featureIcon
        } >
        <
        ShoppingCart size = {
            24
        }
        color = "#36b37e" / >
        <
        /View> <
        Text style = {
            styles.featureTitle
        } > Fast Delivery < /Text> <
        Text style = {
            styles.featureDescription
        } >
        Quick turnaround times with reliable shipping <
        /Text> <
        /View>

        <
        View style = {
            styles.featureCard
        } >
        <
        View style = {
            styles.featureIcon
        } >
        <
        Heart size = {
            24
        }
        color = "#36b37e" / >
        <
        /View> <
        Text style = {
            styles.featureTitle
        } > Custom Designs < /Text> <
        Text style = {
            styles.featureDescription
        } >
        Personalized jerseys tailored to your specifications <
        /Text> <
        /View> <
        /View> <
        /View>

        {
            /* CTA Section */ } <
        View style = {
            styles.ctaSection
        } >
        <
        Text style = {
            styles.ctaTitle
        } > Ready to Get Started ? < /Text> <
        Text style = {
            styles.ctaSubtitle
        } >
        Browse our collection and create your perfect jersey today <
        /Text> <
        TouchableOpacity style = {
            styles.ctaButton
        } >
        <
        Text style = {
            styles.ctaButtonText
        } > Shop Now < /Text> <
        /TouchableOpacity> <
        /View> <
        /ScrollView> <
        /SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    logo: {
        width: 120,
        height: 40,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 15,
    },
    headerButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
    },
    heroSection: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#0052cc',
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: 'Inter',
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
        fontFamily: 'Inter',
    },
    sliderContainer: {
        width: '100%',
        alignItems: 'center',
    },
    sliderWrapper: {
        position: 'relative',
        width: screenWidth - 40,
        height: 400,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#f8f9fa',
    },
    sliderImage: {
        width: '100%',
        height: '100%',
    },
    sliderButton: {
        position: 'absolute',
        top: '50%',
        left: 15,
        transform: [{
            translateY: -20
        }],
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 25,
        padding: 10,
    },
    sliderButtonRight: {
        left: 'auto',
        right: 15,
    },
    playButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 8,
    },
    indicators: {
        position: 'absolute',
        bottom: 15,
        left: '50%',
        transform: [{
            translateX: -50
        }],
        flexDirection: 'row',
        gap: 8,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    activeIndicator: {
        backgroundColor: '#fff',
    },
    slideInfo: {
        marginTop: 20,
        alignItems: 'center',
    },
    slideTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
        fontFamily: 'Inter',
    },
    slidePrice: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0052cc',
        fontFamily: 'Inter',
    },
    featuresSection: {
        paddingHorizontal: 20,
        paddingVertical: 40,
        backgroundColor: '#f8f9fa',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        textAlign: 'center',
        marginBottom: 30,
        fontFamily: 'Inter',
    },
    featuresGrid: {
        gap: 20,
    },
    featureCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    featureIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f0f9ff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
        fontFamily: 'Inter',
    },
    featureDescription: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
        fontFamily: 'Inter',
    },
    ctaSection: {
        paddingHorizontal: 20,
        paddingVertical: 40,
        alignItems: 'center',
        backgroundColor: '#0052cc',
    },
    ctaTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: 'Inter',
    },
    ctaSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginBottom: 30,
        fontFamily: 'Inter',
    },
    ctaButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    ctaButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0052cc',
        fontFamily: 'Inter',
    },
});

export default LandingPage;