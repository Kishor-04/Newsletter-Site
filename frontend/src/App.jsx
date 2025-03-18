import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminForm from "./components/AdminForm";
import StudentDashboard from "./pages/StudentDashboard";
import NewsletterDetails from "./pages/NewsletterDetails";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/admin" element={<AdminForm />} />
                <Route path="/" element={<StudentDashboard />} />
                <Route path="/:id" element={<NewsletterDetails />} />
            </Routes>
        </Router>
    );
};

export default App;
