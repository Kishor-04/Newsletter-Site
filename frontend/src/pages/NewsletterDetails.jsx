import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const NewsletterDetails = () => {
    const { id } = useParams(); // Get the ID from URL
    const [newsletter, setNewsletter] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/${id}`);
                setNewsletter(data);
            } catch (err) {
                setError("Newsletter not found");
                console.error("Error fetching newsletter details:", err);
            }
        };

        if (id) fetchDetails();
    }, [id]);

    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!newsletter) return <p className="text-center text-gray-500">Loading...</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
            {/* Banner Image */}
            <img 
                src={`http://localhost:4000/${newsletter.banner}`} 
                alt={newsletter.name} 
                className="w-full h-64 object-cover rounded-lg shadow-md" 
            />

            {/* Poster Image */}
            {newsletter.poster && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Event Poster</h3>
                    <img 
                        src={`http://localhost:4000/${newsletter.poster}`} 
                        alt="Event Poster" 
                        className="w-full h-60 object-cover rounded-lg shadow-md" 
                    />
                </div>
            )}

            {/* Event Details */}
            <div className="mt-6">
                <h2 className="text-2xl font-bold">{newsletter.name}</h2>
                <p className="text-gray-700 mt-2">{newsletter.description}</p>

                {/* Additional Details */}
                <div className="mt-4 space-y-2">
                    <p><strong>🕒 Event Duration:</strong> {newsletter.eventDuration}</p>
                    <p><strong>💰 Prize Money:</strong> ₹{newsletter.prizeMoney}</p>
                    <p><strong>👥 Capacity:</strong> {newsletter.capacity} people</p>
                    <p><strong>📞 Contact Info:</strong> {newsletter.contactInfo}</p>
                    <p><strong>📌 Type:</strong> {newsletter.type}</p>
                </div>

                {/* Registration Button */}
                {newsletter.registrationLink && (
                    <div className="mt-6">
                        <a 
                            href={newsletter.registrationLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Register Now
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsletterDetails;
