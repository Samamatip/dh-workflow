import React from 'react';
import { useRouter } from 'next/navigation';

const ReviewUpload = ({shifts, back}) => {
    const router = useRouter();

  return (
    <div className='flex flex-col gap-5 justify-center items-center text-text-gray h-full w-full'>
        <h2>
            <span 
                onClick={back} 
                className='py-3 bg-primary rounded-md px-5 cursor-pointer hover:scale-110 text-white absolute top-16 left-5'
            >Back</span>
        </h2>

        <div className='flex flex-col gap-5 justify-center items-center h-full w-full'>
            <h2>Review your upload</h2>
            
            <div className='max-h-[70vh] overflow-y-auto scrollbar-thin relative'>
                <table className='w=full'>
                    <thead className='sticky top-0'>
                        <tr className='bg-gray-500 text-white'>
                            <th className="px-4 border-y">S/No</th>
                            <th className="px-4 border-y">Date</th>
                            <th className="px-4 border-y">Day</th>
                            <th className="px-4 border-y">Shift</th>
                            <th className="px-4 border-y">Number of slots</th>
                        </tr>
                    </thead>
                    <tbody className='w-full'>
                        {Array.isArray(shifts) && shifts.length > 0 ? (
                            shifts?.map((shift, idx) => (
                                <tr key={idx} className={`w-full ${shift.number_of_slots < 1? 'bg-amber-400' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                                    <th className="px-4 pt-1 border-b border-gray-300">{idx + 1}</th>
                                    <td className="px-4 pt-1 border-b border-gray-300">{shift.date ? new Date(shift.date).toLocaleDateString('en-GB') : '-'}</td>
                                    <td className="px-4 pt-1 border-b border-gray-300">{shift.date ? new Date(shift.date).toLocaleDateString('en-US', { weekday: 'long' }) : '-'}</td>
                                    <td className="px-4 pt-1 border-b border-gray-300">{shift.shift || '-'}</td>
                                    <td className={`px-4 pt-1 border-b border-gray-300 ${shift.number_of_slots < 1? 'text-error font-bold' :''}`}>{shift.number_of_slots || '-'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="px-4 py-2 border text-center" colSpan={5}>
                                    No shifts to review.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    
                </table>
                
            </div>
            <button 
                onClick={()=> router.push('/overtime/upload-shifts/upload-details')}
                className='py-3 bg-primary rounded-md px-5 cursor-pointer hover:scale-110 text-white'
            >
                Next
            </button>
        </div>

    </div>
  )
}

export default ReviewUpload;