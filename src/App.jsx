import Adminpanel from "./Pages/Referral"
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import AddReferralForm from "./Pages/AddReferral"
import AdminEditReferal from "./Pages/EditReferal"
import AdminpanelFill from "./Pages/ReferralFill"
import AdminViewReferral from "./Pages/ViewReferral"
import Layout from "./Components/Layout"


const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route path="new-patient" element={<Adminpanel />} />
    <Route path="patient-master" element={<Adminpanel />} />
    <Route path="services" element={<Adminpanel />} />
    <Route path="referral" element={<Adminpanel />} />
    <Route path="referral-fill" element={<AdminpanelFill />} />
    <Route path="add-referral" element={<AddReferralForm />} />
    <Route path="view-referral" element={<AdminViewReferral />} />
    <Route path="edit-referral" element={<AdminEditReferal />} />
  </Route>
))
function App() {


  return (
    <RouterProvider router={router} />
  )
}

export default App
