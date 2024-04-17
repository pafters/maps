import { useState, useEffect } from 'react';

import image from '../assets/placemark.png';
import Map from '../components/map/Map';
import RegionsSearch from '../components/search/RegionSearch';
import ToursList from '../components/ToursList';

import './mapContent.css';
import Footer from '../components/footer/Footer';

export default function MapContent({ router, updBackgrColor, updShadowOpacity, updNavBttnColor, updNavShadow }) {
    const [activePlace, updActivePlace] = useState('');
    const [currentPlace, updCurrentPlaces] = useState('');
    const [places, updPlaces] = useState([]);
    const [cities, updCities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        updBackgrColor('#fff0');
        updShadowOpacity(0.855);
        updNavBttnColor('#fff');
        updNavShadow(0)
        // Получаем все элементы с атрибутом data-title
        const elementsWithDataTitle = document.querySelectorAll('[data-code]');
        // Добавляем обработчики событий ко всем элементам
        const elems = [];
        getRegions();
        elementsWithDataTitle.forEach((el) => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
            el.addEventListener('mouseup', handleClick);
            elems.push(el.getAttribute('data-title'));
        });

        const handleScroll = () => {
            const position = window.scrollY;
            if (position > window.innerHeight - 30) { // Измени это значение на пиксель, на котором нужно изменить цвет
                updBackgrColor('#65256f');
                updNavShadow(0.25);
            } else {
                updBackgrColor('#fff0');
                updNavShadow(0);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            elementsWithDataTitle.forEach((el) => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
                el.removeEventListener('click', handleClick);
            });
        };
    }, []);

    async function getCitiesByRegion(region) {
        updCities([]);
        try {
            const answer = await router.getCitiesByRegion(region);
            updCities(answer?.data?.cities);
        } catch (e) {

        }

    }

    async function getRegions() {
        try {
            const answer = await router.getRegions();
            updPlaces(answer?.data?.regions);
        } catch (e) {

        }
    }

    const handleMouseEnter = (event) => {
        const title = event.currentTarget.getAttribute('data-title');
        document.querySelector('.district span').innerHTML = title;
        updCurrentPlaces(title);
        document.querySelector('.district').style.display = 'block';
    };

    const handleMouseLeave = () => {
        if (!document.querySelector('.rf-map').classList.contains("open")) {
            // document.querySelector('.district').style.display = 'none';
            updCurrentPlaces('')
        }
    };

    const handleClick = async (event) => {
        const elementsWithDataTitle = document.querySelectorAll('[data-code]');
        elementsWithDataTitle.forEach((el) => {
            el.classList.remove('activePlace');
        });
        event.currentTarget.classList.add('activePlace');
        const title = event.currentTarget.getAttribute('data-title');
        document.querySelector('.district span').innerHTML = title;
        updActivePlace(title);
        await getCitiesByRegion(title);
    };

    const [tours, updTours] = useState([]);

    async function updTourList(city) {
        try {
            updTours([]);
            const answer = await router.getToursByCity(city);
            updTours(answer?.data?.tours);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div>
            <div className='header'>
                <div className='header-inner'>
                    <div className='name-container'>
                        <span className='site-name'>russia-regions.ru</span>
                    </div>

                    <RegionsSearch regions={places} getCitiesByRegion={getCitiesByRegion}
                        updActivePlace={updActivePlace} updTours={updTours} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    {activePlace && cities[0] && <ToursList router={router}
                        updActivePlace={updActivePlace}
                        updCities={updCities}
                        tours={tours} updTours={updTours}
                        updTourList={updTourList}
                        getCitiesByRegion={getCitiesByRegion}
                        activePlace={activePlace} cities={cities} />}
                </div>

            </div>
            <div className={activePlace && cities[0] ? 'no-active' : ''} >
                <Map currentPlace={currentPlace} activePlace={activePlace} />
            </div>
            <Footer updActivePlace={updActivePlace}
                updTourCities={updCities}
                updTourList={updTourList} getCitiesByRegion={getCitiesByRegion} router={router} />
        </div>
    );
}

