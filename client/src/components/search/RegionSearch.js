import { useState, useRef, useEffect } from 'react';
import './regionSearch.css';

export default function RegionsSearch({ regions, updActivePlace, getCitiesByRegion, searchTerm, setSearchTerm, updTours }) {
  const selectRef = useRef(null);
  const inpRef = useRef(null);


  const handleSelectChange = async (event, inputPlaces) => {
    const placeName = inputPlaces ? inputPlaces[0] : event.currentTarget.value;
    const district = document.querySelector('.district');
    updActivePlace(placeName);
    setSearchTerm(placeName);
    if (district) {
      district.style.display = 'none';
      const elementsWithDataTitle = document.querySelectorAll(`[data-code]`);
      elementsWithDataTitle.forEach((el) => {
        el.classList.remove('activePlace');
        if (el.getAttribute('data-title').toLowerCase() === placeName.toLowerCase() && placeName !== '') {
          document.querySelector('.district').style.display = 'block';
          el.classList.add('activePlace');
        }
      });
      if (updTours)
        updTours([]);

      await getCitiesByRegion(placeName);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    selectRef.current.size = 3; // Лимитируем отображаемое количество элементов
  };

  return (
    <div className='search-container'>
      <input
        type="text"
        ref={inpRef}
        value={searchTerm}
        onChange={handleSearch}
        className=''
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            handleSelectChange(e, regions
              .filter((place) => place?.toLowerCase().includes(searchTerm.toLowerCase())));
          }
        }}
        placeholder="Едем в..."
      />
      <br></br>
      <select
        size="3"
        ref={selectRef}
        onClick={handleSelectChange}
        style={{ display: 'block', overflow: 'auto' }} // Показываем или скрываем выпадающий список в зависимости от состояния
      >
        {regions
          .filter((place) => place?.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((option, index) => (
            <option className='region' key={index} value={option}>
              {option}
            </option>
          ))}
      </select>
    </div >
  );
};