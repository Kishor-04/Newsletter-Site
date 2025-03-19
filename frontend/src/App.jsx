import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminForm from "./components/AdminForm";
import StudentDashboard from "./pages/StudentDashboard";
import NewsletterDetails from "./pages/NewsletterDetails";
import NewsletterList from "./pages/NewsletterList";
import { useState } from "react";

const App = () => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <Router>
            <Routes>
                <Route path="/newsletters" element={<StudentDashboard />} />
                <Route path="/newsletters/:id" element={<NewsletterDetails />} />
                <Route path="/newsletterlist" element={<NewsletterList />} />
                <Route path="/admin/:id" element={<AdminForm isEditing={isEditing} />} />
                <Route path="/admin" element={<AdminForm isEditing={isEditing} />} />
            </Routes>
        </Router>
    );
};

export default App;
