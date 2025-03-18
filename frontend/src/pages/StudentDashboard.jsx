import { useState } from "react";
import NewsletterSlider from "../components/NewsletterSlider";

const StudentDashboard = () => {
    const [selectedNews, setSelectedNews] = useState(null);

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
            <NewsletterSlider onSelect={setSelectedNews} />

            {selectedNews && (
                <div className="mt-5 p-4 bg-white shadow-lg rounded">
                    <h2 className="text-xl font-bold">{selectedNews.name}</h2>
                    <p>{selectedNews.description}</p>
                    {selectedNews.type === "competition" && (
                        <>
                            <p>Prize Money: ${selectedNews.prizeMoney}</p>
                            <p>Capacity: {selectedNews.capacity}</p>
                            <a href={selectedNews.registrationLink} className="text-blue-500" target="_blank" rel="noopener noreferrer">Register Here</a>
                        </>
                    )}
                    <p>Contact: {selectedNews.contactInfo}</p>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
