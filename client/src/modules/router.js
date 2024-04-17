import axios from "axios"
import CONSTANTS from "./constants"
export default class BaseRouter {

    sendPost(method, body, headers, params = '') {
        const answer = axios.post(`http://${CONSTANTS.SERVER_API}/api/${method}${params}`, body, { headers: headers })
        if (answer)
            return answer
    }

    sendGet(method, params = '', headers) {
        const answer = axios.get(`http://${CONSTANTS.SERVER_API}/api/${method}${params}`, {
            headers: headers
        })
        if (answer)
            return answer
    }

    sendPut(method, body, headers, params = '') {
        const answer = axios.put(`http://${CONSTANTS.SERVER_API}/api/${method}${params}`, body, { headers: headers })
        if (answer)
            return answer
    }

    sendDelete(method, body, headers, params = '') {
        const answer = axios.delete(`http://${CONSTANTS.SERVER_API}/api/${method}${params}`, body, { headers: headers })
        if (answer)
            return answer
    }

    getTable = async (name) => {
        return await this.sendGet('tables/get-table/', `?name=${name}`);
    }

    getTourInfoByUrl = async (url) => {
        return await this.sendGet('tours/get-tour/', `?url=${url}`);
    }

    sendPageData = async (body) => {
        return await this.sendPost('tours/insert-tour/', body, { 'Content-Type': 'multipart/form-data' })
    }

    updateEntry = async (name, body) => {
        return await this.sendPut('tables/update-entry/', body, {}, `?name=${name}`);
    }

    insertUser = async (body) => {
        return await this.sendPost('users/insert-user', body, {});
    }

    deleteEntryById = async (name, id) => {
        return await this.sendDelete('tables/delete-entry/', {}, {}, `?name=${name}&id=${id}`);
    }

    auth = async (body) => {
        return await this.sendPost('users/auth', body, {});
    }

    getRegions = async () => {
        return await this.sendGet('tours/get-regions/');
    }

    getCitiesByRegion = async (region) => {
        return await this.sendGet('tours/get-cities/', `?region=${region}`);
    }

    getAllCities = async () => {
        return await this.sendGet('tours/get-all-cities/');
    }

    getToursByCity = async (city) => {
        console.log(city)
        return await this.sendGet('tours/get-tours-by-city/', `?city=${city}`);
    }


    deletePhoto = async (path, name) => {
        return await this.sendDelete('tours/delete-photo/', {}, {}, `?path=${path}&name=${name}`);
    }

    getMe = async (token) => {
        return await this.sendGet('users/get-me/', `?token=${token}`);
    }
}