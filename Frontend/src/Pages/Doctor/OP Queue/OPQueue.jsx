import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOPQueue } from "../../../api/doctorService";

export default function OPQueue() {
  const [appointments, setAppointments] = useState({
    today: [],
    future: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await getOPQueue();

      if (response) {
        // Separate today's appointments from future appointments
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

        const todayAppts = response.filter(appt => {
          const apptDate = new Date(appt.appointmentDate).toISOString().split('T')[0];
          return apptDate === today;
        });

        const futureAppts = response.filter(appt => {
          const apptDate = new Date(appt.appointmentDate).toISOString().split('T')[0];
          return apptDate > today;
        });

        setAppointments({
          today: todayAppts,
          future: futureAppts
        });
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderTable = (title, appointments, columns) => {
    // Map column names to API data fields
    const columnMapping = {
      'MRN': 'mrn',
      'Name': 'patientName',
      'Age': 'age',
      'Gender': 'gender',
      'Phone': 'phoneNumber',
      'Time': 'appointmentTime',
      'Date': 'appointmentDate',
      'Status': 'status'
    };

    // Format date for display
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    };

    // Format time for display
    const formatTime = (timeString) => {
      if (!timeString) return 'N/A';
      return timeString;
    };

    return (
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-4 text-gray-700">{title}</h2>
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-6 py-2 text-left text-xs font-semibold uppercase tracking-wider bg-[#DEFCFA]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment._id} className="hover:bg-gray-100">
                  {columns.map((col) => {
                    const field = columnMapping[col];
                    let value = appointment[field] || 'N/A';

                    // Format date and time fields
                    if (field === 'appointmentDate') {
                      value = formatDate(value);
                    } else if (field === 'appointmentTime') {
                      value = formatTime(value);
                    }

                    return (
                      <td
                        key={`${appointment._id}-${field}`}
                        className={`px-6 py-3 whitespace-nowrap text-sm text-gray-900
                              ${
                                field === "status" && value === "Completed"
                                  ? "text-green-600"
                                  : field === "status" && value === "Awaiting"
                                  ? "text-orange-600"
                                  : field === "status" && value === "Scheduled"
                                  ? "text-blue-600"
                                  : ""
                              }`}
                      >
                        {field === 'patientName' ? (
                          <Link to={`/patient-record-medicalform/${appointment.patientId}`}>
                            {value}
                          </Link>
                        ) : (
                          value
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  return (
    <div className="w-full h-full flex bg-white flex-col">
      <div className="flex justify-between items-center border-b-2 border-gray-400 p-4">
        <h1 className="text-lg font-bold">OP Queue</h1>
        <button
          onClick={fetchAppointments}
          className="px-4 py-2 bg-[#0D8E83] text-white rounded-lg text-sm"
        >
          Refresh
        </button>
      </div>

      <div className="bg-gray-100 p-4 flex flex-col gap-6 h-full">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D8E83]"></div>
          </div>
        ) : (
          <div className="container mx-auto">
            {appointments.today.length > 0 ? (
              renderTable("Appointments for Today", appointments.today, [
                "MRN",
                "Name",
                "Age",
                "Gender",
                "Phone",
                "Time",
                "Status",
              ])
            ) : (
              <div className="mb-4">
                <h2 className="text-lg font-bold mb-4 text-gray-700">Appointments for Today</h2>
                <div className="bg-white shadow p-6 rounded-lg text-center">
                  <p className="text-gray-500">No appointments scheduled for today</p>
                </div>
              </div>
            )}

            {appointments.future.length > 0 ? (
              renderTable("Future Appointments", appointments.future, [
                "MRN",
                "Name",
                "Age",
                "Gender",
                "Phone",
                "Date",
                "Time",
              ])
            ) : (
              <div className="mb-4">
                <h2 className="text-lg font-bold mb-4 text-gray-700">Future Appointments</h2>
                <div className="bg-white shadow p-6 rounded-lg text-center">
                  <p className="text-gray-500">No future appointments scheduled</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
