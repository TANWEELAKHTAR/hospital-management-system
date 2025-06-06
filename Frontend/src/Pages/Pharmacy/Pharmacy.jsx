export default function Pharmacy() {
  return (
    <div className="w-full h-full flex bg-white flex-col">
      <div className="flex justify-between items-center border-b-2 border-gray-400 p-4">
        <h1 className="text-lg font-bold">Pharmacy Dashboard</h1>
      </div>
      <div className="border border-gray-200 rounded-lg h-full p-4 bg-[#FDFDFE]">
        <div className="flex flex-col items-center justify-center h-full">
          <img className='h-16' src="/images/EmptyDocuments.png" alt="" />
          <p className="text-gray-500 mt-4">Welcome to Pharmacy Module</p>
          <p className="text-gray-400 text-sm mt-2">Use the navigation menu to access pharmacy features</p>
        </div>
      </div>
    </div>
  )
}
