import React from 'react'

const Footer = () => {
  return (
    <div className='bg-black text-white py-8'>
      <div className='flex flex-wrap justify-around gap-8'>
        {/* Contact Information */}
        <div className='flex flex-col'>
          <p className='text-[16px] pb-[10px] font-bold'>Contact</p>
          <span className='text-[12px] py-1'>Email: <a href="mailto:cleonafashion2023@gmail.com" className="underline">cleonafashion2023@gmail.com</a></span>
          <span className='text-[12px] py-1'>WhatsApp: <a href="tel:0716700468" className="underline">071 6 700 468</a></span>
          <span className='text-[12px] py-1'>Mobile: <a href="tel:0754446805" className="underline">075 444 6805</a></span>
        </div>

        {/* Location */}
        <div className='flex flex-col'>
          <p className='text-[16px] pb-[10px] font-bold'>Location</p>
          <span className='text-[12px] py-1'>Galle, Welipatha</span>
          <a
            href="https://maps.app.goo.gl/kKoBtW1cxdkwhJHo7"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] underline py-1"
          >
            View on Google Maps
          </a>
        </div>

        {/* CLEONE Contacts */}
        <div className='flex flex-col'>
          <p className='text-[16px] pb-[10px] font-bold'>CLEONE</p>
          <span className='text-[12px] py-1'>077 741 6728</span>
          <span className='text-[12px] py-1'>076 557 6129</span>
        </div>

        {/* Useful Links */}
        <div className='flex flex-col'>
          <p className='text-[16px] pb-[10px] font-bold'>Track Your Order</p>
          <a
            href="https://domex.lk/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] underline py-1"
          >
            Domex Courier
          </a>
          <a
            href="https://promptxpress.lk/TrackItem.aspx#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] underline py-1"
          >
            PromptXpress Tracking
          </a>
        </div>
      </div>

      {/* Copyright */}
      <p className='text-sm text-white text-center content-center'>
        © {new Date().getFullYear()} CLEONE. All rights reserved.
      </p>
    </div>
  )
}

export default Footer
