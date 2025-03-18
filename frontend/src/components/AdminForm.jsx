import { useState } from "react";
import axios from "axios";

const AdminForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        eventDuration: "",
        type: "event",
        prizeMoney: "",
        registrationLink: "",
        capacity: "",
        contactInfo: "",
        banner: null,
        poster: null,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        Object.keys(formData).forEach((key) => form.append(key, formData[key]));

        try {
            await await axios.post(`${import.meta.env.VITE_API_URL}/create`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Newsletter created successfully!");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">Create Newsletter</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* File Inputs */}
                <div className="space-y-2">
                    <label className="block text-gray-700 font-semibold">Banner:</label>
                    <input type="file" name="banner" onChange={handleFileChange} required className="w-full border p-2 rounded-lg" />

                    <label className="block text-gray-700 font-semibold">Poster:</label>
                    <input type="file" name="poster" onChange={handleFileChange} required className="w-full border p-2 rounded-lg" />
                </div>

                {/* Name & Description */}
                <input type="text" name="name" placeholder="Event Name" onChange={handleChange} required className="w-full border p-3 rounded-lg" />
                <textarea name="description" placeholder="Description" onChange={handleChange} required className="w-full border p-3 rounded-lg" />

                {/* Event Duration & Type (Side by Side) */}
                <div className="flex gap-4">
                    <input type="text" name="eventDuration" placeholder="Event Duration" onChange={handleChange} required className="w-1/2 border p-3 rounded-lg" />

                    <select name="type" onChange={handleChange} className="w-1/2 border p-3 rounded-lg">
                        <option value="event">Event</option>
                        <option value="competition">Competition</option>
                    </select>
                </div>

                {/* Conditional Fields for Competition */}
                {formData.type === "competition" && (
                    <div className="space-y-4 animate-fadeIn">
                        <input type="number" name="prizeMoney" placeholder="Prize Money" onChange={handleChange} className="w-full border p-3 rounded-lg" />
                        <input type="url" name="registrationLink" placeholder="Registration Link" onChange={handleChange} className="w-full border p-3 rounded-lg" />
                        <input type="number" name="capacity" placeholder="Capacity" onChange={handleChange} className="w-full border p-3 rounded-lg" />
                    </div>
                )}

                {/* Contact Info */}
                <input type="text" name="contactInfo" placeholder="Contact Info" onChange={handleChange} required className="w-full border p-3 rounded-lg" />

                {/* Submit Button */}
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition">
                    Create Newsletter
                </button>
            </form>
        </div>
    );
};

export default AdminForm;
