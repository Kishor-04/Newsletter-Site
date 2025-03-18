import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const NewsletterDetails = () => {
    const { id } = useParams(); // Get newsletter ID from URL
    const [newsletter, setNewsletter] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/newsletters/${id}`);
                setNewsletter(response.data);
            } catch (error) {
                console.error("Error fetching newsletter details:", error);
            }
        };
        fetchDetails();
    }, [id]);

    if (!newsletter) {
        return <p className="text-center text-gray-500">Loading newsletter details...</p>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <img
                src={`http://localhost:4000/${newsletter.poster}`}
                alt={newsletter.name}
                className="w-full h-72 object-cover rounded shadow-lg"
            />
            <h1 className="text-3xl font-bold mt-4">{newsletter.name}</h1>
            <p className="text-gray-700 mt-2">{newsletter.description}</p>

            <div className="mt-4 space-y-2">
                <p><strong>Event Duration:</strong> {newsletter.eventDuration}</p>
                <p><strong>Prize Money:</strong> ₹{newsletter.prizeMoney}</p>
                <p><strong>Capacity:</strong> {newsletter.capacity} participants</p>
                <p><strong>Contact Info:</strong> {newsletter.contactInfo}</p>
                <p><strong>Type:</strong> {newsletter.type}</p>
                <a
                    href={newsletter.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 mt-4 rounded"
                >
                    Register Now
                </a>
            </div>
        </div>
    );
};

export default NewsletterDetails;
