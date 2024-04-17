import { createRef, useEffect, useState } from 'react';
import './tourPage.css';
import CONSTANTS from '../modules/constants';
import RegionsSearch from '../components/search/RegionSearch';
import saveIcon from '../assets/save.png';
import viewIcon from '../assets/view.png';
import editIcon from '../assets/edit-icon.png';
import addAvatarIcon from '../assets/add-avatar.png';
import addGalleryIcon from '../assets/add-gallery.png';
import arrowIcon from '../assets/arrow.png';
import delIcon from '../assets/delete.png';

function rus_to_latin(str) {

    var ru = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
        'е': 'e', 'ё': 'e', 'ж': 'j', 'з': 'z', 'и': 'i',
        'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh',
        'щ': 'shch', 'ы': 'y', 'э': 'e', 'ю': 'u', 'я': 'ya',
        'ъ': 'ie', 'ь': '', 'й': 'i'
    }, n_str = [];

    for (var i = 0; i < str.length; ++i) {
        n_str.push(
            ru[str[i]]
            || ru[str[i].toLowerCase()] == undefined && str[i]
            || ru[str[i].toLowerCase()].replace(/^(.)/, function (match) { return match.toUpperCase() })
        );
    }

    return n_str.join('');
}

export default function TourPage({ router, authToken, updBackgrColor, updNavShadow, updShadowOpacity, updNavBttnColor }) {
    const [images, updImages] = useState([]); //отображаются на странице
    const [editState, updEditState] = useState(false);
    const [avatar, updAvatar] = useState(''); //отображается на странице
    const [searchTerm, setSearchTerm] = useState('');
    const [viewState, updViewState] = useState(false);

    const [uploadPhotos, updUploadPhotos] = useState({ avatar: null, list: [] })
    const [suggestions, setSuggestions] = useState([]);
    const [activePlace, updActivePlace] = useState('');
    const [errPageState, updErrPageState] = useState(false);
    const [cityValue, updCityValue] = useState('');

    const refs = {
        name: createRef(null),
        price: createRef(null),
        location: createRef(null),
        description: createRef(null),
        city: createRef(null)
    }

    const [indexImage, updIndexImage] = useState(0);

    const [tour, updTour] = useState({
        name: 'Название тура',
        price: 'Цена',
        region: 'Регион',
        city: 'город',
        description: ''
    });


    useEffect(() => {
        updEditState(authToken ? true : false);
    })

    useEffect(() => {
        updBackgrColor('#65256f');
        updShadowOpacity(0.855);
        updNavBttnColor('#fff');
        updNavShadow(0.25);
        getTourInfoByUrl();
    }, [])

    async function getTourInfoByUrl() {
        const url = window.location.href.replace(`http://${CONSTANTS.PAGE_API}/tours/`, '');
        if (url === '') {
            const token = localStorage.getItem('maps-auth-token')
            if (!token) {
                updErrPageState(true);
            }
        } else {
            try {
                const tourInfo = await router.getTourInfoByUrl(url);
                updTour(tourInfo?.data?.tour);
                updImages(tourInfo?.data?.photos);
                updAvatar(tourInfo?.data?.avatar);
                updActivePlace(tourInfo?.data?.tour?.region);
                setSearchTerm(tourInfo?.data?.tour?.region)
                updCityValue(tourInfo?.data?.tour?.city);
            } catch (e) {
                updErrPageState(true);
            }

        }
    }

    function switchImage(step) {
        if (indexImage + step < 0)
            updIndexImage(images.length - 1);
        else if (indexImage + step > images.length - 1) {
            let localImages = [...images];
            if (editState && !viewState) {
                localImages.push('');
                updImages(localImages)
                updIndexImage(indexImage + step)
            } else {
                updIndexImage(0)
            }
        }
        else updIndexImage(indexImage + step)
    }

    async function savePage() {
        /*очищаем вывод ошибок, если были */
        refs.city.current.style.borderColor = '#ccc';
        refs.name.current.style.border = '';

        const city = refs.city.current.value ? refs.city.current.value.trim() : '';

        const url = window.location.href.replace(`http://${CONSTANTS.PAGE_API}/tours/`, '');
        const pageData = {
            name: refs.name.current.textContent.trim(),
            price: refs.price.current.textContent.trim(),
            description: refs.description.current.value.trim(),
            region: activePlace.trim(),
            city: city,
            url: url
        }

        const formData = new FormData();

        if (uploadPhotos.avatar)
            formData.append('avatar', uploadPhotos.avatar);
        formData.append('pageData', JSON.stringify(pageData));
        for (let i = 0; i < uploadPhotos.list.length; i++) {
            if (uploadPhotos.list[i]) {
                formData.append('photos', uploadPhotos.list[i]);
                formData.append('indexPhotos', i);
            }
        }
        if (pageData.city !== '' && pageData.region !== '' && pageData.name !== '') {
            try {
                const sendDataInfo = await sendData(formData);
                if (sendDataInfo?.data?.url)
                    window.location.replace(`http://${CONSTANTS.PAGE_API}/tours/${sendDataInfo?.data?.url}`);
            } catch (e) {

            }
        } else {
            if (pageData.city === '')
                refs.city.current.style.borderColor = 'red';
            if (pageData.name === '') {
                refs.name.current.textContent = 'Введите название тура';
                refs.name.current.style.border = '0.25dvw solid red';
            }
        }

    }

    async function sendData(body, url) {
        try {
            return await router.sendPageData(body);
        } catch (e) {

        }
    }

    const handleFileUpload = (name) => {
        if (editState && !viewState) {
            const input = document.createElement('input');
            input.type = 'file';
            input.onchange = e => handleFileChosen(e.target.files[0], name);
            input.click();
        }
    };

    const handleFileChosen = (file, name) => {
        const renamedFile = new File([file], rus_to_latin(file.name), { type: file.type });
        const reader = new FileReader();
        const uploads = uploadPhotos;
        reader.onload = e => {
            const imageUrl = e.target.result;
            if (name === 'avatar') {
                updAvatar(imageUrl);
                uploads.avatar = renamedFile;
            }
            else {
                let localImages = [...images];
                localImages[indexImage] = imageUrl;
                updImages(localImages);
                uploads.list[indexImage] = renamedFile;
            }
        }
        reader.readAsDataURL(renamedFile);
        updUploadPhotos(uploads);
    };

    async function delImage(name) {
        const deleteImage = name === 'photos' ? images[indexImage] : avatar;
        console.log(deleteImage, CONSTANTS.SERVER_API)
        if (deleteImage.includes(CONSTANTS.SERVER_API)) {
            const answer = await router.deletePhoto(deleteImage, name);
        }
        if (name === 'photos') {
            let localImages = images.filter((image, index) => {
                return image !== images[indexImage]
            });
            updImages(localImages)
        } else {
            updAvatar('');
        }
    }

    return (
        <div style={{ paddingTop: '4dvh' }}>
            {errPageState ? <div>
                <h1>Страница не найдена</h1>
            </div> :
                <div className='tour'>
                    <div className='tour-info'>
                        {editState && !viewState &&
                            <img onClick={() => delImage('avatars')}
                                src={delIcon}
                                className='delete'
                            />}
                        {<img className="avatar" onClick={() => handleFileUpload('avatar')}
                            style={{
                                backgroundImage: `url(${avatar !== '' ? avatar : addAvatarIcon})`,
                                display: (!editState || viewState) && avatar === '' ? 'none' : 'block'
                            }} />}
                        <div>
                            <div className="tour-main-info" style={{ display: "inline-block" }}>
                                <span
                                    ref={refs.name}
                                    contentEditable={!viewState && editState}
                                    className='tour-name' name="name"
                                >{tour.name}</span >
                            </div>
                            <div className="tour-main-info">
                                <span
                                    ref={refs.price}
                                    className='tour-price' name="price"
                                    contentEditable={!viewState && editState}
                                >{tour.price}</span ><span className='price-icon'>₽</span>
                                <div>
                                    {editState && !viewState ? <>
                                        <RegionsSearch
                                            searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                                            activePlace={activePlace} regions={CONSTANTS.defaultRegions} updActivePlace={updActivePlace} />
                                        <input ref={refs.city}
                                            onChange={(e) => updCityValue(e.target.value)} defaultValue={cityValue}
                                            placeholder='Населенный пункт' />
                                    </>
                                        : <p
                                            ref={refs.location}
                                            className="tour-location"
                                            name="location">{`${activePlace ? activePlace : tour.region}, ${cityValue ? cityValue : tour.city}`}</p>}
                                </div>

                                <ul>
                                    {suggestions.map((suggestion, index) => (
                                        <li key={index}>{suggestion}</li>
                                    ))}
                                </ul>
                                {editState && !viewState ?
                                    <textarea ref={refs.description}
                                        placeholder='Введите описание тура'
                                        onChange={(e) => {
                                            let tourInfo = tour;
                                            tourInfo.description = e.target.value;
                                            updTour(tourInfo)
                                        }}
                                        defaultValue={tour.description}
                                    />
                                    :
                                    <p
                                        ref={refs.description}
                                        className='description'
                                        name="description">{tour.description}</p>}
                            </div>
                        </div>
                    </div>
                    <div style={{ paddingBottom: '10dvh', }}>
                        {editState && !viewState &&
                            <img onClick={() => delImage('photos')}
                                src={delIcon}
                                className='delete' />}
                        <div className="gallery-container" >
                            <img
                                className='arrow right-arrow' src={arrowIcon}
                                style={{ display: (!editState || viewState) && (images[0] === '' || !images[0]) ? 'none' : 'block', }}
                                onClick={() => switchImage(-1)} />
                            <div className="gallery" onClick={() => { handleFileUpload('gallery') }}
                                style={{
                                    display: (!editState || viewState) && (images[0] === '' || !images[0]) ? 'none' : 'block',
                                    backgroundImage: `url(${editState && !viewState ? (images[indexImage] ? images[indexImage] : addGalleryIcon)
                                        : (images[indexImage])})`
                                }}>
                            </div>
                            <img className='arrow left-arrow' src={arrowIcon}
                                style={{ display: (!editState || viewState) && (images[0] === '' || !images[0]) ? 'none' : 'block', }}
                                onClick={() => switchImage(1)} />
                        </div>
                        {editState && !viewState && <img src={saveIcon} className='save-button' onClick={savePage} />}
                        {editState && <img className={'view-state-button ' + (viewState ? 'edit' : 'view')}
                            src={viewState ? editIcon : viewIcon}
                            onClick={() => {
                                if (!viewState) {
                                    updImages(images.filter((el) => el !== ''))
                                    if (images[0] !== '')
                                        updIndexImage(0);
                                }
                                updViewState(!viewState)
                            }} />}
                    </div>

                </div>
            }
        </div>
    )
}