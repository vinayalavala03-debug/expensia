import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { LuImage, LuX } from 'react-icons/lu';

const EmojiPickerPopup = ({ icon, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pickerRef = useRef();

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768); // breakpoint for mobile
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close popup when clicking outside (desktop only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen && !isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isMobile]);

  return (
    <div className='flex flex-col md:flex-row items-start gap-5 mb-6'>
      {/* Trigger */}
      <div
        className='flex items-center gap-4 cursor-pointer'
        onClick={() => setIsOpen(true)}
      >
        <div className='w-12 h-12 flex items-center justify-center text-2xl bg-purple-50 text-primary rounded-lg'>
          {icon ? (
            <span className="text-2xl">{icon}</span>
          ) : (
            <LuImage />
          )}
        </div>
        <p>{icon ? "Change Icon" : "Pick Icon"}</p>
      </div>

      {/* Emoji Picker */}
      {isOpen && (
        <>
          {/* Desktop inline picker */}
          {!isMobile && (
            <div className='relative z-20' ref={pickerRef}>
              <button
                aria-label="Close Emoji Picker"
                className='w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-full absolute -top-2 -right-2 cursor-pointer z-30'
                onClick={() => setIsOpen(false)}
              >
                <LuX />
              </button>

              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  onSelect(emojiData.emoji);
                  setIsOpen(false);
                }}
              />
            </div>
          )}

          {/* Mobile fullscreen picker */}
          {isMobile && (
            <div className="fixed inset-0 bg-white z-50 flex flex-col">
              <div className="flex justify-end p-3 border-b">
                <button
                  aria-label="Close Emoji Picker"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                  onClick={() => setIsOpen(false)}
                >
                  <LuX />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <EmojiPicker
                  width="100%"
                  height="100%"
                  onEmojiClick={(emojiData) => {
                    onSelect(emojiData.emoji);
                    setIsOpen(false);
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EmojiPickerPopup;
