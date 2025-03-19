import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const NewsletterList = () => {
    const [newsletters, setNewsletters] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        fetchNewsletters();
    }, []);

    const fetchNewsletters = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/newsletters`);
            setNewsletters(response.data);
        } catch (error) {
            console.error("Error fetching newsletters:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this newsletter?")) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/delete/${id}`);
                setNewsletters(newsletters.filter(newsletter => newsletter._id !== id));
            } catch (error) {
                console.error("Error deleting newsletter:", error);
            }
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Newsletters</h2>
            <table className="min-w-full bg-white border rounded-lg">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Type</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {newsletters.map((newsletter) => (
                        <tr key={newsletter._id} className="text-center">
                            <td className="border px-4 py-2">{newsletter.name}</td>
                            <td className="border px-4 py-2">{newsletter.type}</td>
                            <td className="border px-4 py-2 flex items-center justify-center gap-3">
                                <button
                                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                                    onClick={() => navigate("/admin", { state: { _id: newsletter._id, isEditing: true } })
                                }
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                                    onClick={() => handleDelete(newsletter._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NewsletterList;
