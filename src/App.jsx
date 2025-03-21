import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import Referral from "./Pages/Reception/Referrals/Referral"
import AddReferral from "./Pages/Reception/Referrals/AddReferral"
import EditReferral from "./Pages/Reception/Referrals/EditReferral"
import ReferralFill from "./Pages/Reception/Referrals/ReferralFill"
import ViewReferral from "./Pages/Reception/Referrals/ViewReferral"
import Layout from "./Components/Layout"
import PatientMaster from "./Pages/Reception/PatientMaster/PatientMaster"
import NewPatientRegistration from "./Pages/Reception/NewPatientRegistration/NewPatientRegistration"
import Service from "./Pages/Reception/Services/service"


const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route path="referral" element={<Referral />} />
    <Route path="referral-fill" element={<ReferralFill />} />
    <Route path="add-referral" element={<AddReferral />} />
    <Route path="view-referral" element={<ViewReferral />} />
    <Route path="edit-referral" element={<EditReferral />} />
    <Route path="new-patient-registration" element={<NewPatientRegistration />} />
    <Route path="patient-master" element={<PatientMaster/>} />
    <Route path="services" element={<Service/>} />
    
  </Route>
))
function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
