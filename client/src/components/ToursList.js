import { useState } from "react";
import './toursList.css';

export default function ToursList({ cities, updCities, updActivePlace, tours, updTourList }) {

    return (
        <div id="info">
            <select size="3" onClick={(e) => { updTourList(e.currentTarget.value) }}>
                {cities.map((city) => (<option >
                    {city}
                </option>))
                }
            </select>
            <button onClick={() => { updCities([]); updActivePlace('') }}>X</button>
            <div style={{ maxHeight: '30dvh', paddingBottom: '2dvh', overflow: 'auto' }}>
                {tours.map((tour) => (
                    <a className="tour-container" href={`/tours/${tour.url}`}>
                        <div style={{ display: 'flex' }}>
                            <div className="tour-image" style={{ content: `url(${tour.path})`, width: '10dvw', height: '10dvw' }}></div>
                            <div className="tour-details">
                                <p>{tour.name}</p>
                                <p>{tour.price}₽</p>
                            </div>

                        </div>
                    </a>
                ))
                }
            </div>
        </div >
    );
}