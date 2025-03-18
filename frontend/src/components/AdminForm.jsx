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
        capacity: 1,
        contactInfo: "",
        banner: null,
        poster: null,
    });

    const [errors, setErrors] = useState({});

    // Handle text input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle file input changes
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 10 * 1024 * 1024) {
            setErrors((prev) => ({ ...prev, [e.target.name]: "File size must be less than 10MB" }));
        } else {
            setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
            setFormData({ ...formData, [e.target.name]: file });
        }
    };

    // Handle increment/decrement for capacity
    const handleCapacityChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            capacity: Math.max(1, prev.capacity + value),
        }));
    };

    // Form validation
    const validateForm = () => {
        let newErrors = {};
        
        if (!formData.eventDuration.match(/^\d{4}-\d{2}-\d{2}$/)) {
            newErrors.eventDuration = "Event duration must be in YYYY-MM-DD format";
        }

        if (formData.type === "competition") {
            if (formData.prizeMoney && isNaN(formData.prizeMoney)) {
                newErrors.prizeMoney = "Prize money should be a number";
            }

            if (formData.registrationLink && !formData.registrationLink.startsWith("http")) {
                newErrors.registrationLink = "Registration link must start with http";
            }
        }

        if (!formData.contactInfo.match(/^\d{10}$/)) {
            newErrors.contactInfo = "Contact info must be exactly 10 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const form = new FormData();
        Object.keys(formData).forEach((key) => form.append(key, formData[key]));

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/create`, form, {
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
                    {errors.banner && <p className="text-red-500 text-sm">{errors.banner}</p>}

                    <label className="block text-gray-700 font-semibold">Poster:</label>
                    <input type="file" name="poster" onChange={handleFileChange} required className="w-full border p-2 rounded-lg" />
                    {errors.poster && <p className="text-red-500 text-sm">{errors.poster}</p>}
                </div>

                {/* Name & Description */}
                <input type="text" name="name" placeholder="Event Name" onChange={handleChange} required className="w-full border p-3 rounded-lg" />
                <textarea name="description" placeholder="Description" onChange={handleChange} required className="w-full border p-3 rounded-lg" />

                {/* Event Duration & Type */}
                <div className="flex gap-4">
                    <input
                        type="date"
                        name="eventDuration"
                        placeholder="YYYY-MM-DD"
                        onChange={handleChange}
                        required
                        className="w-1/2 border p-3 rounded-lg"
                    />
                    {errors.eventDuration && <p className="text-red-500 text-sm">{errors.eventDuration}</p>}

                    <select name="type" onChange={handleChange} className="w-1/2 border p-3 rounded-lg">
                        <option value="event">Event</option>
                        <option value="competition">Competition</option>
                    </select>
                </div>

                {/* Conditional Fields for Competition */}
                {formData.type === "competition" && (
                    <div className="space-y-4 animate-fadeIn">
                        <input
                            type="number"
                            name="prizeMoney"
                            placeholder="Prize Money"
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                        />
                        {errors.prizeMoney && <p className="text-red-500 text-sm">{errors.prizeMoney}</p>}

                        <input
                            type="url"
                            name="registrationLink"
                            placeholder="Registration Link"
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                        />
                        {errors.registrationLink && <p className="text-red-500 text-sm">{errors.registrationLink}</p>}

                        {/* Capacity Input with Increment/Decrement Buttons */}
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => handleCapacityChange(-1)}
                                className="px-3 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                            >
                                -
                            </button>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                readOnly
                                className="w-1/3 border p-3 text-center rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => handleCapacityChange(1)}
                                className="px-3 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                            >
                                +
                            </button>
                        </div>
                    </div>
                )}

                {/* Contact Info */}
                <input type="text" name="contactInfo" placeholder="Contact Info" onChange={handleChange} required className="w-full border p-3 rounded-lg" />
                {errors.contactInfo && <p className="text-red-500 text-sm">{errors.contactInfo}</p>}

                {/* Submit Button */}
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition">
                    Create Newsletter
                </button>
            </form>
        </div>
    );
};

export default AdminForm;
