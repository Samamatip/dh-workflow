import React from 'react'
import AdminHeader from '../../../AdminHeader';
import { motion } from 'framer-motion';
import Image from 'next/image';
import BulkUploadInterface from './BulkUploadInterface';

const BulkUpload = () => {
  const [notSeenInstruction, setNotseenInstruction] = React.useState(true);

  return (
    <div className="max-h-screen overflow-y-auto scrollbar-thin h-screen">
      {/* Header */}
      <div className="sticky top-0 w-full z-10 shadow-md">
        <AdminHeader />
      </div>
      {notSeenInstruction? (
        <div className="flex flex-col lg:flex-row lg:px-10 w-full gap-5 h-[90vh]">
          <div className="">
            <button 
              onClick={() => window.location.href = '/overtime/upload-shifts'}
              className="bg-secondary my-5 text-white py-2 px-4 rounded-lg shadow-md hover:scale-105 transition duration-200 mb-2 lg:mb-0 cursor-pointer">
              Upload single day shift
            </button>
          </div>
          {/* Bulk Shift creation instruction */}
          { notSeenInstruction &&
            <div className="flex flex-col items-center justify-center p-5 w-full lg:w-2/3 bg-gray-100 rounded-lg shadow-md">
              <motion.div 
                  className="bg-white lg:w-[60%] lg:h-[50%] w-full h-full rounded-md py-10 gap-3 shadow-md flex flex-col items-center justify-between"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1 }}
              >
                <p className="text-base text-center text-success font-semibold">
                  Upload shifts in bulk
                </p>
                <Image src="/assets/upload.png" alt="error" width={50} height={50} />
                <span className="text-sm text-center px-5 text-text-gray">
                  For a seamless shift upload, please download the compatible template for your shift upload
                </span>
                <span className='flex lg:flex-row flex-col gap-3'>
                  <a
                    onClick={() => setNotseenInstruction(false)}
                    href='/documents/dh_shift_Upload_template.xlsx'
                    download
                    className={`py-2 px-5 my-2 text-text-white bg-primary rounded-md shadow-md text-white cursor-pointer hover:scale-105`}
                  >
                    Download template
                  </a>
                  <button
                    onClick={()=>setNotseenInstruction(false)}
                    className={`py-2 px-5 my-2 text-text-white bg-secondary text-white rounded-md shadow-md cursor-pointer hover:scale-105`}
                  >
                    I already have a template
                  </button>
                </span>
                <footer className='bg-brand-blue h-[15%] w-full rounded-b-md'></footer>
              </motion.div>
            </div>
          }
        </div>
      ):(
        <div className="flex flex-col lg:flex-row lg:px-10 w-full gap-5 h-[90vh]">
          <BulkUploadInterface />
        </div>
      )}
    </div>
  )
}

export default BulkUpload;