import { useState ,useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const AdminForm = () => {
    const location = useLocation();
    const isEditing = location.state?.isEditing || false;
    const navigate = useNavigate();
    const { _id } = location.state || {}; // ✅ Get `_id` and `isEditing`

    // Initialize state with default values or pre-filled data for editing
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

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [bannerPreview, setBannerPreview] = useState(null);
    const [posterPreview, setPosterPreview] = useState(null);

    // Ensure the form gets updated when editing
    useEffect(() => {
        if (isEditing && _id) {
            const fetchEventDetails = async () => {
                try {
                    setLoading(true);
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/newsletters/${_id}`);
    
                    console.log("Fetched event details:", res.data); // ✅ Log full response
                    
                    if (res.data) {
                        const formattedDate = res.data.eventDuration
                            ? res.data.eventDuration.split("T")[0]
                            : "";
    
                        console.log("Formatted eventDuration:", formattedDate); // ✅ Check extracted date
    
                        setFormData({
                            name: res.data.name || "",
                            description: res.data.description || "",
                            eventDuration: formattedDate, 
                            type: res.data.type || "event",
                            prizeMoney: res.data.prizeMoney || "",
                            registrationLink: res.data.registrationLink || "",
                            capacity: res.data.capacity || 1,
                            contactInfo: res.data.contactInfo || "",
                            banner: res.data.banner || null,
                            poster: res.data.poster || null,
                        });
    
                        console.log("Updated formData after setting:", formData); // ❌ Might not update immediately

                        // Set preview images from fetched data
                        setBannerPreview(`${import.meta.env.VITE_API_URL}/${res.data.banner}`);
                        setPosterPreview(`${import.meta.env.VITE_API_URL}/${res.data.poster}`);
                    } else {
                        setErrors({ form: "No event details found." });
                    }
                } catch (error) {
                    console.error("❌ Error fetching event details:", error);
                    setErrors({ form: "Failed to fetch event details." });
                } finally {
                    setLoading(false);
                }
            };
    
            fetchEventDetails();
        }
    }, [_id, isEditing]);
    


    // Handle text input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle file input changes
    const handleFileChange = (e) => {
        const { name } = e.target;
        const file = e.target.files[0];

        if (file && file.size > 10 * 1024 * 1024) {
            setErrors((prev) => ({ ...prev, [name]: "File size must be less than 10MB" }));
        } else {
            setErrors((prev) => ({ ...prev, [name]: "" }));
            setFormData((prev) => ({ ...prev, [name]: file }));

            const fileUrl = URL.createObjectURL(file);
            if (name === "banner") {
                setBannerPreview(fileUrl);
                localStorage.setItem("bannerPreview", fileUrl);
            } else if (name === "poster") {
                setPosterPreview(fileUrl);
                localStorage.setItem("posterPreview", fileUrl);
            }
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

        try {
            const eventData = new FormData();
            Object.keys(formData).forEach((key) => {
                eventData.append(key, formData[key]);
            });

            if (isEditing) {
                await axios.put(`${import.meta.env.VITE_API_URL}/edit/${_id}`, eventData ,{
                    headers: { "Content-Type": "multipart/form-data" }
                });
                
                alert("Newsletter updated successfully!");
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/create`, eventData,{
                    headers: { "Content-Type": "multipart/form-data" }
                });
                alert("Newsletter created successfully!");
            }
            navigate("/newsletterlist"); // Redirect to NewsletterList after success

        } catch (error) {
            console.error("❌ Error saving event:", error);
            alert("Failed to save event. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">{isEditing ? "Edit Newsletter" : "Create Newsletter"}
            </h2>


            {loading && <p className="text-center text-gray-600">Loading event details...</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* File Inputs */}
                <label className="block text-gray-700 font-semibold">Banner:</label>
                <input
                    type="file"
                    name="banner"
                    onChange={handleFileChange}
                    className="w-full border p-2 rounded-lg"
                />
                {bannerPreview && (
                    <img
                        src={bannerPreview}
                        alt="Banner Preview"
                        className="mt-2 w-40 h-20 object-cover rounded"
                    />
                )}
        

                <label className="block text-gray-700 font-semibold">Poster:</label>
                <input
                    type="file"
                    name="poster"
                    onChange={handleFileChange}
                    className="w-full border p-2 rounded-lg"
                />
                {posterPreview && (
                    <img
                        src={posterPreview}
                        alt="Poster Preview"
                        className="mt-2 w-40 h-20 object-cover rounded"
                    />
                )}
    


                {/* Name & Description */}
                <input type="text" name="name" value={formData.name} placeholder="Event Name" onChange={handleChange} required className="w-full border p-3 rounded-lg" />
                <textarea name="description" value={formData.description} placeholder="Description" onChange={handleChange} required className="w-full border p-3 rounded-lg" />

                {/* Event Duration & Type */}
                <div className="flex gap-4">
                    <input
                        type="date"
                        name="eventDuration"
                        value={formData.eventDuration}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]} // Ensures only future dates are selectable
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
                            value={formData.prizeMoney}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                        />
                        {errors.prizeMoney && <p className="text-red-500 text-sm">{errors.prizeMoney}</p>}

                        <input
                            type="url"
                            name="registrationLink"
                            placeholder="Registration Link"
                            value={formData.registrationLink}
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
                <input type="text" name="contactInfo" value={formData.contactInfo} placeholder="Contact Info" onChange={handleChange} required className="w-full border p-3 rounded-lg" />
                {errors.contactInfo && <p className="text-red-500 text-sm">{errors.contactInfo}</p>}

                {/* Submit Button */}
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition">
                    {loading ? "Saving..." : isEditing ? "Update Event" : "Create Event"}
                </button>
            </form>
        </div>
    );
};

export default AdminForm;
