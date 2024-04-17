import { useEffect, useState } from 'react';
import './footer.css';

export default function Footer({ router, updActivePlace, updTourList, updTourCities }) {
    const [cities, updCities] = useState([]);
    useEffect(() => {
        getCities();
    }, []);

    const handleClick = async (title) => {
        updActivePlace(title);
        updTourCities([title]);
        updTourList(title)
        //await getCitiesByRegion(title);
    };

    async function getCities() {
        try {
            const citiesInfo = await router.getAllCities();
            const sortedCities = citiesInfo.data.cities?.reduce((acc, el) => {
                const firstLetter = el.city.charAt(0).toUpperCase();
                if (!acc[firstLetter]) {
                    acc[firstLetter] = [];
                }
                acc[firstLetter].push(el.city);
                return acc;
            }, {})
            updCities(sortedCities);
        } catch (e) {
            console.log(e);
        }
    }

    const renderCityBlock = (cities) => (
        <div className="city-block">
            {cities.map((city, index) => (
                <div key={index} onClick={() => handleClick(city)} className="city">{city}</div>
            ))}
        </div>
    );

    const renderCityGroups = (cities) => {
        return (
            Object.entries(cities).map(([letter, cities], index) => (
                <div key={index} className="city-group">
                    <div className="first-letter">{letter}</div>
                    {renderCityBlock(cities)}
                </div>
            ))
        );
    }



    return (
        <>
            {<footer className="footer">
                <div className="groups-container">
                    {renderCityGroups(cities)}
                </div>

            </footer>}
        </>
    )
}