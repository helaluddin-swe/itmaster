import { useAppContext } from '../context/AppContext';
import {  BCS_Question_List, dummyData } from '../assets/assest';
import { useState } from 'react';

const DataSwitcher = () => {
    const { setDataSource, setSearchTerm, setSelectedCategory } = useAppContext();
    const [activeSet, setActiveSet] = useState('41th'); // Local state for UI feedback

    const handleSwitch = (newData, name) => {
        setDataSource(newData);
        setSearchTerm(""); 
        setSelectedCategory("All");
        setActiveSet(name);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="flex flex-wrap gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
            <button 
                onClick={() => handleSwitch(BCS_Question_List, '50th')}
                className={`px-5 py-2.5 rounded-xl font-bold transition-all ${
                    activeSet === '50th' 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
                50তম বিসিএস প্রিলি
            </button>

            <button 
                onClick={() => handleSwitch(dummyData, '50th')}
                className={`px-5 py-2.5 rounded-xl font-bold transition-all ${
                    activeSet === '51th' 
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-200" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
                51তম বিসিএস (স্পেশাল)
            </button>
        </div>
    );
};

export default DataSwitcher;