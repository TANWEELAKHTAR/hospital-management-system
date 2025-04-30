import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import Referral from "./Pages/Reception/Referrals/Referral"
import AddReferral from "./Pages/Reception/Referrals/AddReferral"
import EditReferral from "./Pages/Reception/Referrals/EditReferral"
import ViewReferral from "./Pages/Reception/Referrals/ViewReferral"
import Layout from "./Components/Layout"
import PatientMaster from "./Pages/Reception/PatientMaster/PatientMaster"
import NewPatientRegistration from "./Pages/Reception/NewPatientRegistration/NewPatientRegistration"
import Service from "./Pages/Reception/Services/service"
import PatientRecord from "./Pages/Reception/PatientMaster/PatientRecord"
import BookAppoinment from "./Pages/Reception/PatientMaster/BookAppoinment"
import AdmitPatient from "./Pages/Reception/PatientMaster/AdmitPatient"
import OPQueue from "./Pages/Doctor/OP Queue/OPQueue"
import IPDashboard from "./Pages/Doctor/IP Dashboard/IPDashboard"
import MedicalForm from "./Pages/Doctor/OP Queue/MedicalForm"
import OpAssessment from "./Pages/Nurse/OpAssessment"
import IpCareManagement from "./Pages/Nurse/IpCareManagement"
import AdmissionNotes from "./Pages/Nurse/AdmissionNotes"
import AdmissionNotePatient from "./Pages/Nurse/AdmissionNotePatient"
import { MenuProvider } from "./Context/MenuProvider"
import { AuthProvider } from "./Context/AuthContext"
import TestParameterMaster from "./Pages/Lab/Test Parameters/TestParameterMaster"
import AddParameters from "./Pages/Lab/Test Parameters/AddParameters"
import Login from "./Pages/Login/Login"
import Unauthorized from "./Pages/Unauthorized/Unauthorized"
import NotFound from "./Pages/NotFound/NotFound"
import ProtectedRoute from "./Components/ProtectedRoute"
import Dashboard from "./Pages/Dashboard/Dashboard"



const router = createBrowserRouter(createRoutesFromElements(
  <Route>
    {/* Public routes */}
    <Route path="/login" element={<Login />} />
    <Route path="/unauthorized" element={<Unauthorized />} />

    {/* Protected routes with Layout */}
    <Route path="/" element={<Layout />}>
      {/* Dashboard - redirects based on role */}
      <Route index element={<Dashboard />} />

      {/* Reception routes - require 'reception' role */}
      <Route element={<ProtectedRoute requiredRoles={['reception', 'clinicAdmin']} />}>
        <Route path="reception">
          <Route index element={<PatientMaster/>} />
          <Route path="referral" element={<Referral />} />
          <Route path="add-referral" element={<AddReferral />} />
          <Route path="view-referral/:id" element={<ViewReferral />} />
          <Route path="edit-referral/:id" element={<EditReferral />} />
          <Route path="new-patient-registration" element={<NewPatientRegistration />} />
          <Route path="patient-master" element={<PatientMaster/>} />
          <Route path="patient-record/:id" element={<PatientRecord/>} />
          <Route path="book-appointment/:id" element={<BookAppoinment/>} />
          <Route path="admit-patient/:id" element={<AdmitPatient/>} />
          <Route path="services" element={<Service/>} />
        </Route>
      </Route>

      {/* Doctor routes - require 'doctor' role */}
      <Route element={<ProtectedRoute requiredRoles={['doctor', 'clinicAdmin']} />}>
        <Route path="doctor">
          <Route index element={<OPQueue/>} />
          <Route path="op-queue" element={<OPQueue/>} />
          <Route path="patient-record-medicalform/:id" element={<MedicalForm/>} />
          <Route path="ip-dashboard" element={<IPDashboard/>} />
        </Route>
      </Route>

      {/* Nurse routes - require 'nurse' role */}
      <Route element={<ProtectedRoute requiredRoles={['nurse', 'clinicAdmin']} />}>
        <Route path="nurse">
          <Route index element={<OpAssessment/>} />
          <Route path="op-assessment" element={<OpAssessment/>}/>
          <Route path="ip-care-management" element={<IpCareManagement/>}/>
          <Route path="admission-note" element={<AdmissionNotes/>}/>
          <Route path="admission-note-patient/:id" element={<AdmissionNotePatient/>}/>
        </Route>
      </Route>

      {/* Lab routes - require 'lab' role */}
      <Route element={<ProtectedRoute requiredRoles={['lab', 'clinicAdmin']} />}>
        <Route path="lab">
          <Route index element={<TestParameterMaster/>} />
          <Route path="test-parameters-master" element={<TestParameterMaster/>}/>
          <Route path="add-parameter" element={<AddParameters/>}/>
        </Route>
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </Route>
))

function App() {
  return (
    <AuthProvider>
      <MenuProvider>
        <RouterProvider router={router} />
      </MenuProvider>
    </AuthProvider>
  )
}

export default App
