import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

const NewsletterSlider = () => {
    const [newsletters, setNewsletters] = useState([]);
    const slideshowRef = useRef(null);
    const navigate = useNavigate(); // React Router navigation

    useEffect(() => {
        const getData = async () => {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/newsletters`);
            

            setNewsletters(data);
        };
        getData();
    }, []);

    const goBack = () => {
        if (slideshowRef.current) {
            slideshowRef.current.goBack();
        }
    };

    const goNext = () => {
        if (slideshowRef.current) {
            slideshowRef.current.goNext();
        }
    };

    // Navigate to the details page when an image is clicked
    const handleSelect = (newsId) => {
        navigate(`/newsletters/${newsId}`); // Navigate to the details page
    };

    return (
        <div className="relative w-full max-w-3xl mx-auto p-4">
            {newsletters.length > 0 ? (
                <div className="relative">
                    <Slide
                        ref={slideshowRef}
                        autoplay={true}
                        infinite={true}
                        duration={3000}
                        transitionDuration={500}
                    >
                        {newsletters.map((news) => (
                            <div key={news._id} className="each-slide flex justify-center">
                                <img
                                    src={`${import.meta.env.VITE_API_URL}/${news.banner}`}
                                    alt={news.name}
                                    className="w-full h-60 object-cover rounded shadow-lg cursor-pointer"
                                    onClick={() => handleSelect(news._id)}
                                />
                            </div>
                        ))}
                    </Slide>

                    {/* Left Button */}
                    <button
                        onClick={goBack}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-900"
                    >
                        <ChevronLeft size={30} />
                    </button>

                    {/* Right Button */}
                    <button
                        onClick={goNext}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-900"
                    >
                        <ChevronRight size={30} />
                    </button>
                </div>
            ) : (
                <p className="text-center text-gray-500">Loading newsletters...</p>
            )}
        </div>
    );
};

export default NewsletterSlider;
